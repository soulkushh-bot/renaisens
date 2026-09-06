'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { adapterPlan } from '@/lib/engine/adapt'
import { construireProfil } from '@/lib/engine/profile'
import { genererPlan, NB_SEMAINES, semaineDuPlan } from '@/lib/engine/plan'
import { stockage } from '@/lib/storage'
import { mesurer } from '@/lib/analytics'
import type { AnswerValue, AppState, PlanChange, WeekLog } from '@/types'

type Contexte = {
  pret: boolean
  etat: AppState | null
  brouillon: Record<string, AnswerValue>

  ecrireBrouillon: (reponses: Record<string, AnswerValue>) => void
  terminerBilan: (reponses: Record<string, AnswerValue>) => AppState
  basculerAction: (actionId: string) => void
  completerRituel: (log: Omit<WeekLog, 'completeLe'>) => PlanChange[]
  toutEffacer: () => void
}

const Ctx = createContext<Contexte | null>(null)

export function FournisseurEtat({ children }: { children: React.ReactNode }) {
  const [pret, setPret] = useState(false)
  const [etat, setEtat] = useState<AppState | null>(null)
  const [brouillon, setBrouillon] = useState<Record<string, AnswerValue>>({})

  useEffect(() => {
    let vivant = true
    void (async () => {
      const [e, b] = await Promise.all([stockage.lire(), stockage.lireBrouillon()])
      if (!vivant) return
      setEtat(e)
      setBrouillon(b)
      setPret(true)
    })()
    return () => {
      vivant = false
    }
  }, [])

  const persister = useCallback((suivant: AppState) => {
    setEtat(suivant)
    void stockage.ecrire(suivant)
  }, [])

  const ecrireBrouillon = useCallback((reponses: Record<string, AnswerValue>) => {
    setBrouillon(reponses)
    void stockage.ecrireBrouillon(reponses)
  }, [])

  const terminerBilan = useCallback(
    (reponses: Record<string, AnswerValue>): AppState => {
      const profile = construireProfil(reponses)
      const plan = genererPlan(profile)
      const suivant: AppState = {
        version: 1,
        createdAt: new Date().toISOString(),
        answers: reponses,
        profile,
        plan,
        progress: { faites: [], semaines: [], dernierRituel: null },
      }
      persister(suivant)
      void stockage.effacerBrouillon()
      setBrouillon({})
      mesurer('onboarding_completed')
      mesurer('plan_generated', { archetype: profile.archetypeId })
      return suivant
    },
    [persister],
  )

  const basculerAction = useCallback(
    (actionId: string) => {
      setEtat((courant) => {
        if (!courant) return courant
        const deja = courant.progress.faites.includes(actionId)
        const faites = deja
          ? courant.progress.faites.filter((id) => id !== actionId)
          : [...courant.progress.faites, actionId]

        if (!deja && courant.progress.faites.length === 0) mesurer('first_action_checked')

        const suivant: AppState = {
          ...courant,
          progress: { ...courant.progress, faites },
        }
        void stockage.ecrire(suivant)
        return suivant
      })
    },
    [],
  )

  const completerRituel = useCallback(
    (partiel: Omit<WeekLog, 'completeLe'>): PlanChange[] => {
      if (!etat) return []
      const log: WeekLog = { ...partiel, completeLe: new Date().toISOString() }

      const progress = {
        faites: Array.from(new Set([...etat.progress.faites, ...log.faites])),
        semaines: [...etat.progress.semaines, log],
        dernierRituel: log.completeLe,
      }

      const { plan, changements } = adapterPlan({
        plan: etat.plan,
        profile: etat.profile,
        progress,
        log,
      })

      persister({ ...etat, plan, progress })
      mesurer('weekly_ritual_completed', { semaine: log.semaine })
      if (log.semaine >= NB_SEMAINES) mesurer('day30_reached')
      return changements
    },
    [etat, persister],
  )

  const toutEffacer = useCallback(() => {
    setEtat(null)
    setBrouillon({})
    void stockage.effacer()
  }, [])

  const valeur = useMemo<Contexte>(
    () => ({
      pret,
      etat,
      brouillon,
      ecrireBrouillon,
      terminerBilan,
      basculerAction,
      completerRituel,
      toutEffacer,
    }),
    [pret, etat, brouillon, ecrireBrouillon, terminerBilan, basculerAction, completerRituel, toutEffacer],
  )

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>
}

export function useEtat(): Contexte {
  const c = useContext(Ctx)
  if (!c) throw new Error('useEtat doit être utilisé dans <FournisseurEtat>')
  return c
}

/**
 * La semaine en cours = le nombre de rituels déjà faits + 1.
 *
 * Volontairement fondé sur ses rituels, pas sur le calendrier : si elle disparaît trois semaines,
 * elle revient à la semaine 2, pas à la semaine 5 avec trois semaines « ratées ». Une semaine
 * manquée ne casse rien — c'est la règle du produit, et c'est ce qui la fait revenir.
 */
export function semaineCourante(etat: AppState | null): number {
  if (!etat) return 1
  return Math.min(etat.progress.semaines.length + 1, etat.plan.semaines.length)
}

export function actionsDeLaSemaine(etat: AppState | null) {
  if (!etat) return []
  const semaine = semaineDuPlan(etat.plan, semaineCourante(etat))
  return semaine?.actions ?? []
}

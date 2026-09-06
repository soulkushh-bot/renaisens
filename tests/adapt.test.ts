import { describe, expect, it } from 'vitest'
import { adapterPlan } from '@/lib/engine/adapt'
import { construireProfil } from '@/lib/engine/profile'
import { actionsParSemaine, genererPlan, semaineDuPlan } from '@/lib/engine/plan'
import type { Plan, Profile, Progress, WeekLog } from '@/types'
import { CADRE_QUI_PART } from './profils'

const MAINTENANT = '2026-01-05T08:00:00.000Z'

function depart(): { profil: Profile; plan: Plan } {
  const profil = construireProfil(CADRE_QUI_PART)
  return { profil, plan: genererPlan(profil, { maintenant: MAINTENANT }) }
}

function log(semaine: number, faites: string[], nonFaites: string[]): WeekLog {
  return {
    semaine,
    completeLe: `2026-01-${String(5 + semaine * 7).padStart(2, '0')}T08:00:00.000Z`,
    faites,
    nonFaites,
    reflexion: { questionId: 'r-test', reponse: 'ok' },
  }
}

/** Enchaîne des rituels comme le ferait l'app : le journal du jour fait partie de la progression. */
function jouer(profil: Profile, plan: Plan, logs: WeekLog[]) {
  let courant = plan
  let progress: Progress = { faites: [], semaines: [], dernierRituel: null }
  let dernierChangements = courant.historique

  for (const l of logs) {
    progress = {
      faites: Array.from(new Set([...progress.faites, ...l.faites])),
      semaines: [...progress.semaines, l],
      dernierRituel: l.completeLe,
    }
    const r = adapterPlan({ plan: courant, profile: profil, progress, log: l })
    courant = r.plan
    dernierChangements = r.changements
  }
  return { plan: courant, progress, changements: dernierChangements }
}

describe('adapt.ts — le plan vivant', () => {
  it('reporte simplement une action manquée une première fois', () => {
    const { profil, plan } = depart()
    const s1 = semaineDuPlan(plan, 1)!
    const rate = s1.actions[0]!.actionId

    const r = jouer(profil, plan, [
      log(1, s1.actions.slice(1).map((a) => a.actionId), [rate]),
    ])

    const s2 = semaineDuPlan(r.plan, 2)!
    const reportee = s2.actions.find((a) => a.actionId === rate)
    expect(reportee).toBeDefined()
    expect(reportee!.reduite).toBe(false)
    expect(r.changements.some((c) => c.type === 'glissee' && c.actionId === rate)).toBe(true)
  })

  it('ne répète jamais à l’identique une action manquée deux fois : elle est proposée à la baisse', () => {
    const { profil, plan } = depart()
    const rate = semaineDuPlan(plan, 1)!.actions[0]!.actionId

    const r = jouer(profil, plan, [log(1, [], [rate]), log(2, [], [rate])])

    const s3 = semaineDuPlan(r.plan, 3)!
    const reduite = s3.actions.find((a) => a.actionId === rate)
    expect(reduite).toBeDefined()
    expect(reduite!.reduite).toBe(true)
    expect(r.changements.some((c) => c.type === 'reduite' && c.actionId === rate)).toBe(true)
  })

  it('retire du plan une action manquée trois fois, et propose autre chose', () => {
    const { profil, plan } = depart()
    const rate = semaineDuPlan(plan, 1)!.actions[0]!.actionId

    const r = jouer(profil, plan, [
      log(1, [], [rate]),
      log(2, [], [rate]),
      log(3, [], [rate]),
    ])

    const s4 = semaineDuPlan(r.plan, 4)!
    expect(s4.actions.some((a) => a.actionId === rate)).toBe(false)
    expect(r.changements.some((c) => c.type === 'remplacee' && c.actionId === rate)).toBe(true)
    expect(s4.actions.length).toBeGreaterThan(0)
  })

  it('ne dépasse jamais la capacité hebdomadaire, même quand tout s’accumule', () => {
    const { profil, plan } = depart()
    const capacite = actionsParSemaine(profil.minutesParSemaine)

    const r = jouer(profil, plan, [
      log(1, [], semaineDuPlan(plan, 1)!.actions.map((a) => a.actionId)),
      log(2, [], semaineDuPlan(plan, 2)!.actions.map((a) => a.actionId)),
    ])

    for (const s of r.plan.semaines) {
      expect(s.actions.length).toBeLessThanOrEqual(capacite)
    }
  })

  it('garde exactement une action prioritaire par semaine après réécriture', () => {
    const { profil, plan } = depart()
    const r = jouer(profil, plan, [log(1, [], semaineDuPlan(plan, 1)!.actions.map((a) => a.actionId))])

    for (const s of r.plan.semaines) {
      if (s.actions.length === 0) continue
      expect(s.actions.filter((a) => a.prioritaire)).toHaveLength(1)
    }
  })

  it('monte d’une marche après deux semaines pleines — mais jamais d’une action', () => {
    const { profil, plan } = depart()
    const capacite = actionsParSemaine(profil.minutesParSemaine)
    const s1 = semaineDuPlan(plan, 1)!.actions.map((a) => a.actionId)
    const s2 = semaineDuPlan(plan, 2)!.actions.map((a) => a.actionId)

    const r = jouer(profil, plan, [log(1, s1, []), log(2, s2, [])])

    expect(r.changements.some((c) => c.type === 'montee')).toBe(true)
    const s3 = semaineDuPlan(r.plan, 3)!
    expect(s3.actions.length).toBeLessThanOrEqual(capacite)
  })

  it('ne punit pas une semaine vide : aucune remise à zéro, aucun rattrapage', () => {
    const { profil, plan } = depart()
    const s1 = semaineDuPlan(plan, 1)!.actions.map((a) => a.actionId)

    const r = jouer(profil, plan, [log(1, [], s1)])

    // Tout ce qui a été manqué est reporté ; rien n'est supprimé, rien n'est doublé.
    const s2 = semaineDuPlan(r.plan, 2)!
    for (const id of s1) {
      const present =
        s2.actions.some((a) => a.actionId === id) ||
        (semaineDuPlan(r.plan, 3)?.actions.some((a) => a.actionId === id) ?? false)
      expect(present).toBe(true)
    }
    expect(r.changements.every((c) => c.type !== 'terminee')).toBe(true)
  })

  it('journalise chaque réécriture pour qu’elle puisse voir ce qui a changé', () => {
    const { profil, plan } = depart()
    expect(plan.revision).toBe(1)
    const r = jouer(profil, plan, [log(1, [], semaineDuPlan(plan, 1)!.actions.map((a) => a.actionId))])
    expect(r.plan.revision).toBe(2)
    expect(r.plan.historique.length).toBeGreaterThan(0)
    for (const c of r.plan.historique) expect(c.texte.length).toBeGreaterThan(10)
  })
})

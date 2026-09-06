import { describe, expect, it } from 'vitest'
import { action } from '@/content/actions'
import { construireProfil } from '@/lib/engine/profile'
import { actionsDuPlan, actionsParSemaine, genererPlan, repartirSlots } from '@/lib/engine/plan'
import { DIMENSIONS, type Plan, type Profile } from '@/types'
import { CADRE_QUI_PART, ENTREPRENEUSE_FAUCHEE, MERE_QUI_REPREND, TOUS } from './profils'

const MAINTENANT = '2026-01-05T08:00:00.000Z'

function planPour(reponses: Record<string, string | number>): { profil: Profile; plan: Plan } {
  const profil = construireProfil(reponses)
  return { profil, plan: genererPlan(profil, { maintenant: MAINTENANT }) }
}

describe('plan.ts — les invariants de charge', () => {
  for (const [nom, reponses] of TOUS) {
    describe(nom, () => {
      const { profil, plan } = planPour(reponses)
      const capacite = actionsParSemaine(profil.minutesParSemaine)

      it('ne dépasse jamais la capacité hebdomadaire', () => {
        for (const s of plan.semaines) {
          expect(s.actions.length).toBeLessThanOrEqual(capacite)
          expect(s.actions.length).toBeLessThanOrEqual(3)
        }
      })

      it('a exactement une action prioritaire par semaine non vide', () => {
        for (const s of plan.semaines) {
          if (s.actions.length === 0) continue
          expect(s.actions.filter((a) => a.prioritaire)).toHaveLength(1)
        }
      })

      it('propose une semaine 1 douce, et au moins une action faisable ce soir', () => {
        const s1 = plan.semaines[0]!
        expect(s1.actions.length).toBeGreaterThan(0)
        for (const a of s1.actions) {
          const def = action(a.actionId)
          expect(def.difficulte).toBeLessThanOrEqual(2)
          expect(def.effortMinutes).toBeLessThanOrEqual(30)
        }
        // La phrase de contrôle du produit : « une première action qu'elle peut faire dès ce soir ».
        expect(s1.actions.some((a) => action(a.actionId).ceSoir === true)).toBe(true)
      })

      it('respecte le budget de temps qu’elle a déclaré, sauf pour une action seule', () => {
        for (const s of plan.semaines) {
          if (s.actions.length <= 1) continue
          const total = s.actions.reduce((n, a) => n + action(a.actionId).effortMinutes, 0)
          expect(total).toBeLessThanOrEqual(profil.minutesParSemaine)
        }
      })

      it('ne propose jamais une action avant son prérequis', () => {
        const ordre = actionsDuPlan(plan)
        ordre.forEach((id, i) => {
          for (const p of action(id).prerequis) {
            const j = ordre.indexOf(p)
            if (j !== -1) expect(j).toBeLessThan(i)
          }
        })
      })

      it('ne répète jamais deux fois la même action', () => {
        const ids = actionsDuPlan(plan)
        expect(new Set(ids).size).toBe(ids.length)
      })

      it('touche toutes les dimensions de sa vie, pas seulement son point faible', () => {
        const dims = new Set(actionsDuPlan(plan).map((id) => action(id).dimension))
        expect(dims.size).toBeGreaterThanOrEqual(3)
      })

      it('rend son horizon à un an dans ses propres mots', () => {
        expect(plan.horizon).toBe(profil.horizonUnAn)
      })

      it('nomme des actions concrètes dans les jalons 90 jours, pas de la prose', () => {
        expect(plan.jalons90).toHaveLength(3)
        expect(plan.jalons90.map((j) => j.jour)).toEqual([30, 60, 90])
        expect(plan.jalons90.some((j) => j.actionIds.length > 0)).toBe(true)
      })

      it('propose à trois mois des actions plus exigeantes qu’à trente jours, jamais l’inverse', () => {
        const effort = (ids: string[]) =>
          ids.length === 0 ? 0 : Math.max(...ids.map((id) => action(id).difficulte))
        const j30 = effort(plan.jalons90[0]!.actionIds)
        const j90 = effort(plan.jalons90[2]!.actionIds)
        expect(j90).toBeGreaterThanOrEqual(j30)

        // Et jamais une action d'entrée de gamme : un jalon à trois mois qui propose « lis ton
        // relevé » décrédibilise tout le reste du plan.
        for (const j of plan.jalons90) {
          for (const id of j.actionIds) expect(action(id).difficulte).toBeGreaterThanOrEqual(2)
        }
      })

      it('ne renvoie jamais dans les jalons une action déjà au plan', () => {
        const dansLePlan = new Set(actionsDuPlan(plan))
        for (const j of plan.jalons90) {
          for (const id of j.actionIds) expect(dansLePlan.has(id)).toBe(false)
        }
      })
    })
  }
})

describe('plan.ts — déterminisme', () => {
  it('rend deux fois le même plan pour le même profil', () => {
    const a = planPour(CADRE_QUI_PART).plan
    const b = planPour(CADRE_QUI_PART).plan
    expect(a).toEqual(b)
  })
})

describe('plan.ts — trois profils, trois plans', () => {
  const cadre = planPour(CADRE_QUI_PART)
  const mere = planPour(MERE_QUI_REPREND)
  const entrepreneuse = planPour(ENTREPRENEUSE_FAUCHEE)

  const ids = (p: Plan) => new Set(actionsDuPlan(p))
  const chevauchement = (a: Set<string>, b: Set<string>) =>
    [...a].filter((x) => b.has(x)).length / Math.max(a.size, b.size)

  it('ne rend pas des plans interchangeables', () => {
    expect(chevauchement(ids(cadre.plan), ids(mere.plan))).toBeLessThan(0.6)
    expect(chevauchement(ids(cadre.plan), ids(entrepreneuse.plan))).toBeLessThan(0.6)
    expect(chevauchement(ids(mere.plan), ids(entrepreneuse.plan))).toBeLessThan(0.6)
  })

  it('donne trois archétypes de situation différents', () => {
    const a = new Set([
      cadre.profil.archetypeId,
      mere.profil.archetypeId,
      entrepreneuse.profil.archetypeId,
    ])
    expect(a.size).toBe(3)
  })

  it('donne un plan plus court à celle qui n’a que des miettes de temps', () => {
    expect(actionsDuPlan(mere.plan).length).toBeLessThan(actionsDuPlan(cadre.plan).length)
  })

  it('met l’argent au premier plan pour l’entrepreneuse fauchée', () => {
    const dims = actionsDuPlan(entrepreneuse.plan).map((id) => action(id).dimension)
    const finances = dims.filter((d) => d === 'finances').length
    expect(finances).toBeGreaterThanOrEqual(3)
    expect(entrepreneuse.profil.tensions[0]).toBe('finances')
  })

  it('met le travail et la confiance au premier plan pour la mère qui reprend', () => {
    expect(mere.profil.tensions).toContain('projet')
    const prioritaires = mere.plan.semaines
      .flatMap((s) => s.actions.filter((a) => a.prioritaire))
      .map((a) => action(a.actionId).dimension)
    expect(new Set(prioritaires).size).toBeGreaterThanOrEqual(2)
  })
})

describe('repartirSlots', () => {
  const scores = { soi: 40, carriere: 20, finances: 80, projet: 30, entourage: 60 }

  it('distribue exactement le nombre de slots demandé', () => {
    for (const total of [8, 12]) {
      const a = repartirSlots(scores, total)
      const somme = DIMENSIONS.reduce((n, d) => n + a[d], 0)
      expect(somme).toBe(total)
    }
  })

  it('donne au moins un slot à chaque dimension', () => {
    const a = repartirSlots(scores, 12)
    for (const d of DIMENSIONS) expect(a[d]).toBeGreaterThanOrEqual(1)
  })

  it('donne au moins trois slots à la dimension la plus en tension', () => {
    expect(repartirSlots(scores, 12).carriere).toBeGreaterThanOrEqual(3)
  })

  it('ne passe pas le mois à consolider ce qui va déjà bien', () => {
    expect(repartirSlots(scores, 12).finances).toBeLessThanOrEqual(2)
  })
})

import { describe, expect, it } from 'vitest'
import { ACTIONS } from '@/content/actions'
import { ARCHETYPES } from '@/content/archetypes'
import { QUESTIONS } from '@/content/questions'
import { calculerScores, classement, minutesParSemaine } from '@/lib/engine/score'
import { construireProfil, horizonUnAn, reformulerVision } from '@/lib/engine/profile'
import { DIMENSIONS } from '@/types'
import { CADRE_QUI_PART, ENTREPRENEUSE_FAUCHEE, MERE_QUI_REPREND } from './profils'

describe('score.ts', () => {
  it('rend un score entre 0 et 100 pour chaque dimension', () => {
    const s = calculerScores(CADRE_QUI_PART)
    for (const d of DIMENSIONS) {
      expect(s[d]).toBeGreaterThanOrEqual(0)
      expect(s[d]).toBeLessThanOrEqual(100)
    }
  })

  it('inverse bien les questions à rebours', () => {
    const bloquee = calculerScores({ ...CADRE_QUI_PART, soi_permission: 5 })
    const libre = calculerScores({ ...CADRE_QUI_PART, soi_permission: 1 })
    expect(libre.soi).toBeGreaterThan(bloquee.soi)
  })

  it('retombe sur une valeur neutre quand rien n’est répondu', () => {
    const s = calculerScores({})
    for (const d of DIMENSIONS) expect(s[d]).toBe(50)
  })

  it('départage les égalités par l’ordre canonique, jamais au hasard', () => {
    const egaux = { soi: 50, carriere: 50, finances: 50, projet: 50, entourage: 50 }
    expect(classement(egaux)).toEqual([...DIMENSIONS])
  })

  it('lit le temps réellement disponible', () => {
    expect(minutesParSemaine(MERE_QUI_REPREND)).toBe(45)
    expect(minutesParSemaine(ENTREPRENEUSE_FAUCHEE)).toBe(300)
    expect(minutesParSemaine({})).toBe(120)
  })
})

describe('profile.ts — sa phrase lui est rendue, jamais réécrite en autre chose', () => {
  it('passe à la deuxième personne quand c’est sûr', () => {
    expect(reformulerVision('Je veux ouvrir ma boutique')).toBe(
      'Dans un an, tu veux ouvrir ta boutique.',
    )
    expect(reformulerVision('Je veux avoir quitté mon poste et vivre de mon activité')).toBe(
      'Dans un an, tu veux avoir quitté ton poste et vivre de ton activité.',
    )
    expect(reformulerVision('Dans un an, j’aimerais retravailler')).toBe(
      'Dans un an, tu aimerais retravailler.',
    )
  })

  it('cite ses mots plutôt que d’inventer quand la conversion n’est pas sûre', () => {
    const r = reformulerVision('Ma fille sera scolarisée et j’aurai déménagé')
    expect(r).toContain('«')
    expect(r).toContain('Ma fille sera scolarisée')
  })

  it('cite aussi dès qu’un second verbe à la première personne traîne dans la phrase', () => {
    // « tu veux … et que je sois fière » serait bancal : on ne prend pas le risque.
    const r = reformulerVision('Je veux lancer mon activité et que je sois fière de moi')
    expect(r).toContain('«')
    expect(r).not.toContain('Dans un an, tu veux lancer')
  })

  it('ne fabrique rien quand elle n’a rien écrit', () => {
    expect(reformulerVision('')).toContain('pas encore mis de mots')
    expect(reformulerVision(undefined)).toContain('pas encore mis de mots')
    expect(horizonUnAn('')).toContain('À écrire')
  })

  it('rend l’horizon à un an mot pour mot', () => {
    expect(horizonUnAn('je veux vivre de ma pâtisserie')).toBe('Je veux vivre de ma pâtisserie.')
  })
})

describe('profile.ts — archétypes de situation', () => {
  it('choisit toujours le même archétype pour le même profil', () => {
    const a = construireProfil(MERE_QUI_REPREND)
    const b = construireProfil(MERE_QUI_REPREND)
    expect(a.archetypeId).toBe(b.archetypeId)
  })

  it('ne mélange jamais forces et tensions', () => {
    const p = construireProfil(ENTREPRENEUSE_FAUCHEE)
    expect(p.forces).toHaveLength(2)
    expect(p.tensions).toHaveLength(2)
    for (const t of p.tensions) expect(p.forces).not.toContain(t)
  })
})

describe('contenu — les garde-fous éditoriaux', () => {
  it('a une bibliothèque assez large pour que deux profils diffèrent', () => {
    expect(ACTIONS.length).toBeGreaterThanOrEqual(80)
  })

  it('n’a aucun identifiant d’action en double', () => {
    const ids = ACTIONS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('donne à chaque action une version réduite non vide', () => {
    for (const a of ACTIONS) {
      expect(a.versionReduite.trim().length).toBeGreaterThan(5)
      expect(a.versionReduite).not.toBe(a.titre)
    }
  })

  it('ne référence que des prérequis qui existent', () => {
    const ids = new Set(ACTIONS.map((a) => a.id))
    for (const a of ACTIONS) for (const p of a.prerequis) expect(ids.has(p)).toBe(true)
  })

  it('offre dans chaque dimension de quoi remplir une semaine 1 douce', () => {
    for (const d of DIMENSIONS) {
      const douces = ACTIONS.filter(
        (a) => a.dimension === d && a.difficulte <= 2 && a.effortMinutes <= 30 && a.ceSoir,
      )
      expect(douces.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('couvre chaque dimension comme tension possible d’un archétype', () => {
    const tensions = new Set(ARCHETYPES.map((a) => a.tension))
    for (const d of DIMENSIONS) expect(tensions.has(d)).toBe(true)
  })

  it('garde l’onboarding entre 18 et 22 questions, avec trois champs libres', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(18)
    expect(QUESTIONS.length).toBeLessThanOrEqual(22)
    expect(QUESTIONS.filter((q) => q.type === 'texte')).toHaveLength(3)
  })
})

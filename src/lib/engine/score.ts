import { QUESTIONS } from '@/content/questions'
import { DIMENSIONS, type AnswerValue, type DimensionId } from '@/types'

/**
 * Réponses → un score 0–100 par dimension.
 *
 * Ces scores ne sont JAMAIS affichés. Ni en chiffre, ni en jauge, ni en radar : afficher
 * « Finances : 23/100 » à quelqu'un qui vient d'écrire qu'elle a peur de manquer est un mauvais
 * moment produit, et c'est la Roue de la Vie que fait déjà tout le secteur. Ils servent à une seule
 * chose : répartir les actions entre les dimensions.
 *
 * Déterministe : aucune horloge, aucun hasard.
 */

const DEFAUT = 50

export function calculerScores(
  answers: Readonly<Record<string, AnswerValue>>,
): Record<DimensionId, number> {
  const somme: Record<string, number> = {}
  const poids: Record<string, number> = {}

  for (const q of QUESTIONS) {
    if (q.type === 'texte' || q.type === 'temps') continue
    const brut = answers[q.id]
    if (brut === undefined || brut === '') continue

    let valeur: number | null = null

    if (q.type === 'echelle') {
      const n = typeof brut === 'number' ? brut : Number(brut)
      if (!Number.isFinite(n) || n < 1 || n > 5) continue
      const base = ((n - 1) / 4) * 100
      valeur = q.inverse ? 100 - base : base
    } else {
      const option = q.options.find((o) => o.valeur === String(brut))
      if (!option) continue
      valeur = option.score
    }

    somme[q.dimension] = (somme[q.dimension] ?? 0) + valeur * q.poids
    poids[q.dimension] = (poids[q.dimension] ?? 0) + q.poids
  }

  const scores = {} as Record<DimensionId, number>
  for (const d of DIMENSIONS) {
    const p = poids[d] ?? 0
    scores[d] = p === 0 ? DEFAUT : Math.round(Math.min(100, Math.max(0, (somme[d] ?? 0) / p)))
  }
  return scores
}

/**
 * Le temps qu'elle a vraiment, en minutes par semaine.
 * Ce n'est pas décoratif : ce nombre plafonne la taille du plan dans `plan.ts`.
 * Une femme qui a quarante-cinq minutes ne reçoit pas le même plan qu'une femme qui en a cinq heures.
 */
export function minutesParSemaine(answers: Readonly<Record<string, AnswerValue>>): number {
  const q = QUESTIONS.find((x) => x.type === 'temps')
  if (!q || q.type !== 'temps') return 120
  const brut = answers[q.id]
  const option = q.options.find((o) => o.valeur === String(brut))
  return option?.minutesParSemaine ?? 120
}

/** Les dimensions du plus haut au plus bas. Égalité départagée par l'ordre canonique. */
export function classement(scores: Record<DimensionId, number>): DimensionId[] {
  return [...DIMENSIONS].sort((a, b) => {
    const d = scores[b] - scores[a]
    if (d !== 0) return d
    return DIMENSIONS.indexOf(a) - DIMENSIONS.indexOf(b)
  })
}

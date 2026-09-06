import { ARCHETYPES } from '@/content/archetypes'
import { QUESTION_VISION } from '@/content/questions'
import type { AnswerValue, DimensionId, Profile } from '@/types'
import { calculerScores, classement, minutesParSemaine } from './score'

/**
 * Scores + ses trois textes libres → le Profil de Renaissance.
 *
 * Aucun appel LLM. Normalisation + gabarits. Là où la transformation n'est pas sûre (une phrase
 * qu'on ne sait pas passer à la deuxième personne), on cite ses mots au lieu d'en inventer.
 * Ne jamais lui rendre une phrase qu'elle n'a pas dite.
 */

const ESPACES = /\s+/g

export function nettoyer(texte: string): string {
  return texte.replace(ESPACES, ' ').trim()
}

/** Conversions sûres de la première personne à la deuxième. Rien d'ambitieux, rien de faux. */
const CONVERSIONS: [RegExp, string][] = [
  [/^je ne veux plus\b/i, 'tu ne veux plus'],
  [/^je ne serai plus\b/i, 'tu ne seras plus'],
  [/^je veux\b/i, 'tu veux'],
  [/^je voudrais\b/i, 'tu voudrais'],
  [/^je souhaite\b/i, 'tu souhaites'],
  [/^je rêve\b/i, 'tu rêves'],
  [/^je compte\b/i, 'tu comptes'],
  [/^je serai\b/i, 'tu seras'],
  [/^je serais\b/i, 'tu serais'],
  [/^j['’]aimerais\b/i, 'tu aimerais'],
  [/^j['’]ai envie\b/i, 'tu as envie'],
  [/^j['’]aurai\b/i, 'tu auras'],
  [/^j['’]aurais\b/i, 'tu aurais'],
  [/^j['’]espère\b/i, 'tu espères'],
]

const AMORCE = /^(dans un an,?|d['’]ici un an,?|en un an,?)\s*/i

/**
 * Sa phrase, rendue à la deuxième personne quand c'est sûr — citée sinon.
 * Le repli n'est pas un échec : citer ses mots vaut toujours mieux que lui prêter les nôtres.
 */
export function reformulerVision(texte: string | undefined): string {
  const brut = nettoyer(texte ?? '')
  if (brut.length < 8) {
    return 'Tu n’as pas encore mis de mots sur l’année qui vient. Ce n’est pas grave — la question reste ouverte, et tu pourras y répondre au premier rituel.'
  }

  const sansAmorce = brut.replace(AMORCE, '')
  for (const [motif, remplacement] of CONVERSIONS) {
    if (motif.test(sansAmorce)) {
      const converti = sansAmorce.replace(motif, remplacement)
      return `Dans un an, ${terminer(converti)}`
    }
  }
  return `Tu l’as écrit toi-même : « ${terminer(brut)} »`
}

function terminer(s: string): string {
  const t = s.trim()
  if (t.length === 0) return t
  return /[.!?…»]$/.test(t) ? t : `${t}.`
}

/** L'horizon à un an est SA phrase. On ne lui invente pas un futur. */
export function horizonUnAn(texte: string | undefined): string {
  const brut = nettoyer(texte ?? '')
  if (brut.length < 8) return 'À écrire — la question t’attend au premier rituel.'
  return terminer(brut.charAt(0).toUpperCase() + brut.slice(1))
}

/**
 * L'archétype est choisi par la FORME du profil : la tension compte double, la force compte simple.
 * Départage par l'ordre du tableau — deux fois le même profil, deux fois le même archétype.
 */
export function choisirArchetype(forces: DimensionId[], tensions: DimensionId[]) {
  let meilleur = ARCHETYPES[0]!
  let meilleurScore = -Infinity

  for (const a of ARCHETYPES) {
    let s = 0
    if (a.tension === tensions[0]) s += 4
    else if (a.tension === tensions[1]) s += 2
    if (a.force === forces[0]) s += 2
    else if (a.force === forces[1]) s += 1
    if (s > meilleurScore) {
      meilleurScore = s
      meilleur = a
    }
  }
  return meilleur
}

export function construireProfil(answers: Readonly<Record<string, AnswerValue>>): Profile {
  const scores = calculerScores(answers)
  const ordre = classement(scores)
  const forces = ordre.slice(0, 2)
  const tensions = [...ordre].reverse().slice(0, 2)

  const a = choisirArchetype(forces, tensions)
  const vision = answers[QUESTION_VISION]

  return {
    archetypeId: a.id,
    titre: a.titre,
    situation: a.situation,
    levier: a.levier,
    forces,
    tensions,
    visionReformulee: reformulerVision(typeof vision === 'string' ? vision : undefined),
    horizonUnAn: horizonUnAn(typeof vision === 'string' ? vision : undefined),
    scores,
    minutesParSemaine: minutesParSemaine(answers),
  }
}

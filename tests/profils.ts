import type { AnswerValue } from '@/types'

/**
 * Trois profils contrastés, écrits pour ressembler à trois femmes réelles du segment pilote.
 * Ils servent de socle à tous les tests : si le moteur leur rend trois plans interchangeables,
 * le produit ne vaut rien, quelle que soit la qualité du reste.
 */

/** La cadre qui veut partir : elle tient financièrement, elle ne tient plus son poste. */
export const CADRE_QUI_PART: Record<string, AnswerValue> = {
  soi_energie: 2,
  soi_voix: 4,
  soi_permission: 3,
  soi_decision: 'avis',
  car_situation: 'salariee_partir',
  car_sens: 1,
  car_horizon: 5,
  car_competence: 4,
  fin_visibilite: 4,
  fin_coussin: 'trois_mois',
  fin_epargne: 4,
  fin_charge: 2,
  pro_clarte: 'parle',
  pro_premiere_cliente: 3,
  pro_priorite: 4,
  ent_soutien: 4,
  ent_charge: 3,
  ent_reseau: 'joignables',
  temps_dispo: 'trois_heures',
  q_vision: 'Je veux avoir quitté mon poste et vivre de mon activité.',
  q_frein: 'La peur de perdre un salaire que tout le monde m’envie.',
  q_journee: 'Le travail, et les trajets.',
}

/** La mère qui reprend : deux ans d'arrêt, la charge de tout le monde, presque pas de temps. */
export const MERE_QUI_REPREND: Record<string, AnswerValue> = {
  soi_energie: 2,
  soi_voix: 2,
  soi_permission: 5,
  soi_decision: 'repousse',
  car_situation: 'reprise',
  car_sens: 2,
  car_horizon: 5,
  car_competence: 2,
  fin_visibilite: 3,
  fin_coussin: 'un_mois',
  fin_epargne: 2,
  fin_charge: 4,
  pro_clarte: 'aucun',
  pro_premiere_cliente: 1,
  pro_priorite: 5,
  ent_soutien: 2,
  ent_charge: 5,
  ent_reseau: 'aucune',
  temps_dispo: 'miettes',
  q_vision: 'Dans un an, j’aimerais retravailler sans culpabiliser.',
  q_frein: 'Je n’ai jamais deux heures d’affilée à moi.',
  q_journee: 'Les enfants, la maison, tout.',
}

/** L'entrepreneuse lancée mais fauchée : ça tourne, et il ne reste rien à la fin du mois. */
export const ENTREPRENEUSE_FAUCHEE: Record<string, AnswerValue> = {
  soi_energie: 4,
  soi_voix: 5,
  soi_permission: 2,
  soi_decision: 'vite',
  car_situation: 'a_mon_compte',
  car_sens: 5,
  car_horizon: 2,
  car_competence: 5,
  fin_visibilite: 1,
  fin_coussin: 'deux_semaines',
  fin_epargne: 1,
  fin_charge: 5,
  pro_clarte: 'demarre',
  pro_premiere_cliente: 5,
  pro_priorite: 2,
  ent_soutien: 3,
  ent_charge: 3,
  ent_reseau: 'de_loin',
  temps_dispo: 'large',
  q_vision: 'Je veux enfin me payer un vrai salaire tous les mois.',
  q_frein: 'Je travaille beaucoup et je ne sais pas où part l’argent.',
  q_journee: 'Les commandes et les livraisons.',
}

export const TOUS = [
  ['cadre qui part', CADRE_QUI_PART],
  ['mère qui reprend', MERE_QUI_REPREND],
  ['entrepreneuse fauchée', ENTREPRENEUSE_FAUCHEE],
] as const

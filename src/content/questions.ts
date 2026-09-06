import type { Ecran, Question } from '@/types'

/**
 * 22 questions, 6 écrans de 3 à 4. Ton direct, jamais thérapeutique : elle n'est pas malade,
 * elle est en transition.
 *
 * Trois champs libres. Ce sont eux qu'elle relira en semaine 4 — c'est le moment de récompense
 * du produit, pas un ornement.
 *
 * `temps_dispo` n'est pas décoratif non plus : sa réponse plafonne mécaniquement le budget
 * d'effort hebdomadaire dans `plan.ts`.
 */

export const QUESTION_VISION = 'q_vision'

export const QUESTIONS: Question[] = [
  // — Soi et confiance ——————————————————————————————————————————————
  {
    id: 'soi_energie',
    type: 'echelle',
    dimension: 'soi',
    poids: 1,
    texte: 'En ce moment, tu te lèves avec de l’énergie pour ta journée.',
    bas: 'Presque jamais',
    haut: 'Presque tous les jours',
  },
  {
    id: 'soi_voix',
    type: 'echelle',
    dimension: 'soi',
    poids: 1,
    texte: 'Tu dis ce que tu penses, même quand ça peut déranger.',
    bas: 'Je me tais',
    haut: 'Je le dis',
  },
  {
    id: 'soi_permission',
    type: 'echelle',
    dimension: 'soi',
    poids: 1.2,
    inverse: true,
    texte: 'Tu as l’impression de devoir mériter le droit d’essayer.',
    bas: 'Pas du tout',
    haut: 'Tout le temps',
  },
  {
    id: 'soi_decision',
    type: 'choix',
    dimension: 'soi',
    poids: 1,
    texte: 'Quand une décision importante se présente, qu’est-ce qui arrive le plus souvent ?',
    options: [
      { valeur: 'vite', libelle: 'Je tranche vite et j’assume', score: 85 },
      { valeur: 'avis', libelle: 'Je prends deux ou trois avis, puis je tranche', score: 68 },
      { valeur: 'doute', libelle: 'Je tranche, puis je doute pendant des semaines', score: 40 },
      { valeur: 'repousse', libelle: 'Je repousse jusqu’à ce que ça se décide sans moi', score: 20 },
    ],
  },

  // — Carrière ————————————————————————————————————————————————————
  {
    id: 'car_situation',
    type: 'choix',
    dimension: 'carriere',
    poids: 1.2,
    texte: 'Professionnellement, aujourd’hui, tu es plutôt :',
    options: [
      { valeur: 'salariee_rester', libelle: 'Salariée, je veux évoluer là où je suis', score: 72 },
      { valeur: 'salariee_partir', libelle: 'Salariée, mais je veux partir', score: 42 },
      { valeur: 'entre_deux', libelle: 'Entre deux emplois', score: 25 },
      { valeur: 'a_mon_compte', libelle: 'Déjà à mon compte', score: 62 },
      { valeur: 'reprise', libelle: 'En reprise après une pause', score: 30 },
    ],
  },
  {
    id: 'car_sens',
    type: 'echelle',
    dimension: 'carriere',
    poids: 1,
    texte: 'Ce que tu fais de tes journées a du sens pour toi.',
    bas: 'Plus vraiment',
    haut: 'Oui, clairement',
  },
  {
    id: 'car_horizon',
    type: 'echelle',
    dimension: 'carriere',
    poids: 1,
    inverse: true,
    texte: 'Tu ne vois pas où tu seras professionnellement dans deux ans.',
    bas: 'Je le vois bien',
    haut: 'Aucune idée',
  },
  {
    id: 'car_competence',
    type: 'echelle',
    dimension: 'carriere',
    poids: 1,
    texte: 'Tu sais nommer précisément ce que tu fais mieux que la plupart des gens.',
    bas: 'Je sècherais',
    haut: 'Je peux le dire en une phrase',
  },

  // — Finances ————————————————————————————————————————————————————
  {
    id: 'fin_visibilite',
    type: 'echelle',
    dimension: 'finances',
    poids: 1,
    texte: 'Tu sais combien tu as dépensé le mois dernier.',
    bas: 'Aucune idée',
    haut: 'Au millier près',
  },
  {
    id: 'fin_coussin',
    type: 'choix',
    dimension: 'finances',
    poids: 1.4,
    texte: 'Si tes revenus s’arrêtaient demain, tu tiendrais :',
    options: [
      { valeur: 'deux_semaines', libelle: 'Moins de deux semaines', score: 8 },
      { valeur: 'un_mois', libelle: 'Environ un mois', score: 32 },
      { valeur: 'trois_mois', libelle: 'Deux à trois mois', score: 66 },
      { valeur: 'plus', libelle: 'Plus de trois mois', score: 92 },
    ],
  },
  {
    id: 'fin_epargne',
    type: 'echelle',
    dimension: 'finances',
    poids: 1,
    texte: 'Tu mets de l’argent de côté régulièrement, même une petite somme.',
    bas: 'Jamais',
    haut: 'Chaque mois',
  },
  {
    id: 'fin_charge',
    type: 'echelle',
    dimension: 'finances',
    poids: 1.2,
    inverse: true,
    texte: 'L’argent est le sujet qui t’empêche de dormir.',
    bas: 'Non',
    haut: 'C’est celui-là',
  },

  // — Projet ——————————————————————————————————————————————————————
  {
    id: 'pro_clarte',
    type: 'choix',
    dimension: 'projet',
    poids: 1.4,
    texte: 'Ton projet, aujourd’hui :',
    options: [
      { valeur: 'aucun', libelle: 'Je n’en ai pas encore, mais je cherche', score: 15 },
      { valeur: 'secret', libelle: 'J’ai une idée que je n’ai dite à presque personne', score: 32 },
      { valeur: 'parle', libelle: 'J’en parle, mais je n’ai rien lancé', score: 48 },
      { valeur: 'demarre', libelle: 'J’ai commencé, j’ai eu quelques clientes', score: 72 },
      { valeur: 'tourne', libelle: 'Ça tourne, je veux structurer', score: 88 },
    ],
  },
  {
    id: 'pro_premiere_cliente',
    type: 'echelle',
    dimension: 'projet',
    poids: 1.2,
    texte: 'Tu sais à qui tu vendrais en premier — une personne précise, avec un prénom.',
    bas: 'Pas du tout',
    haut: 'Je vois exactement qui',
  },
  {
    id: 'pro_priorite',
    type: 'echelle',
    dimension: 'projet',
    poids: 1,
    inverse: true,
    texte: 'Ton projet passe toujours après tout le reste.',
    bas: 'Non, il a sa place',
    haut: 'Toujours',
  },

  // — Famille et entourage ————————————————————————————————————————
  {
    id: 'ent_soutien',
    type: 'echelle',
    dimension: 'entourage',
    poids: 1.2,
    texte: 'Il y a au moins une personne à qui tu peux dire que ça ne va pas.',
    bas: 'Personne',
    haut: 'Oui, et je le fais',
  },
  {
    id: 'ent_charge',
    type: 'echelle',
    dimension: 'entourage',
    poids: 1,
    inverse: true,
    texte: 'On compte sur toi pour beaucoup de choses, tous les jours.',
    bas: 'Ça va',
    haut: 'Je porte tout',
  },
  {
    id: 'ent_reseau',
    type: 'choix',
    dimension: 'entourage',
    poids: 1,
    texte: 'Des femmes qui font déjà ce que tu veux faire, tu en connais :',
    options: [
      { valeur: 'aucune', libelle: 'Aucune', score: 15 },
      { valeur: 'de_loin', libelle: 'Une, mais de loin', score: 38 },
      { valeur: 'joignables', libelle: 'Deux ou trois, je peux leur écrire', score: 68 },
      { valeur: 'proches', libelle: 'Plusieurs, on se parle vraiment', score: 88 },
    ],
  },

  // — Charge réelle ————————————————————————————————————————————————
  {
    id: 'temps_dispo',
    type: 'temps',
    texte: 'Combien de temps tu as vraiment pour toi dans une semaine ?',
    aide: 'Sois honnête, pas optimiste. Ce chiffre décide de la taille de ton plan.',
    options: [
      { valeur: 'miettes', libelle: 'Des miettes, moins d’une heure', minutesParSemaine: 45 },
      { valeur: 'une_heure', libelle: 'Environ deux heures', minutesParSemaine: 120 },
      { valeur: 'trois_heures', libelle: 'Trois à quatre heures', minutesParSemaine: 210 },
      { valeur: 'large', libelle: 'Plus de cinq heures', minutesParSemaine: 300 },
    ],
  },

  // — Ses mots ————————————————————————————————————————————————————
  {
    id: QUESTION_VISION,
    type: 'texte',
    texte: 'Qu’est-ce que tu veux qui soit différent dans un an ?',
    aide: 'Écris-le comme tu le dirais à une amie, à voix basse.',
    placeholder: 'Dans un an, je veux…',
    max: 280,
  },
  {
    id: 'q_frein',
    type: 'texte',
    texte: 'Qu’est-ce qui t’a arrêtée jusqu’ici ?',
    aide: 'Une phrase suffit. Tu la reliras dans un mois.',
    placeholder: 'Ce qui m’arrête, c’est…',
    max: 280,
  },
  {
    id: 'q_journee',
    type: 'texte',
    texte: 'Qu’est-ce qui prend le plus de place dans tes journées en ce moment ?',
    aide: 'Le travail, les enfants, quelqu’un, une inquiétude — ce qui vient en premier.',
    placeholder: 'Ce qui prend toute la place…',
    max: 200,
  },
]

export const ECRANS: Ecran[] = [
  {
    id: 'e1',
    intention: 'On commence par toi, pas par tes projets.',
    questions: ['soi_energie', 'soi_voix', 'soi_permission', 'soi_decision'],
  },
  {
    id: 'e2',
    intention: 'Ce que tu fais de tes journées.',
    questions: ['car_situation', 'car_sens', 'car_horizon', 'car_competence'],
  },
  {
    id: 'e3',
    intention: 'L’argent. Sans détour, et sans jugement.',
    questions: ['fin_visibilite', 'fin_coussin', 'fin_epargne', 'fin_charge'],
  },
  {
    id: 'e4',
    intention: 'Ce que tu veux construire.',
    questions: ['pro_clarte', 'pro_premiere_cliente', 'pro_priorite'],
  },
  {
    id: 'e5',
    intention: 'Autour de toi, et le temps que tu as vraiment.',
    questions: ['ent_soutien', 'ent_charge', 'ent_reseau', 'temps_dispo'],
  },
  {
    id: 'e6',
    intention: 'Tes mots. C’est ce que tu reliras dans un mois.',
    questions: [QUESTION_VISION, 'q_frein', 'q_journee'],
  },
]

const PAR_ID = new Map(QUESTIONS.map((q) => [q.id, q]))

export function question(id: string): Question {
  const q = PAR_ID.get(id)
  if (!q) throw new Error(`Question inconnue : ${id}`)
  return q
}

/** Nombre de questions réellement obligatoires (les champs libres peuvent rester vides). */
export const NB_QUESTIONS_REQUISES = QUESTIONS.filter((q) => q.type !== 'texte').length

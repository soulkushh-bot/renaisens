/**
 * Types du domaine RENaiSENS.
 * Le moteur de plan est déterministe : rien ici ne dépend de l'horloge ni du hasard.
 */

export type DimensionId = 'soi' | 'carriere' | 'finances' | 'projet' | 'entourage'

/** Ordre canonique. Sert de départage stable partout où deux scores sont à égalité. */
export const DIMENSIONS: readonly DimensionId[] = [
  'soi',
  'carriere',
  'finances',
  'projet',
  'entourage',
] as const

export const NOM_DIMENSION: Record<DimensionId, string> = {
  soi: 'Soi et confiance',
  carriere: 'Carrière',
  finances: 'Finances',
  projet: 'Projet',
  entourage: 'Famille et entourage',
}

/** Formulation courte utilisée dans les phrases, à la place d'une note chiffrée. */
export const SUJET_DIMENSION: Record<DimensionId, string> = {
  soi: 'ta confiance',
  carriere: 'ton travail',
  finances: "l'argent",
  projet: 'ton projet',
  entourage: 'ton entourage',
}

export type Difficulte = 1 | 2 | 3

export type Action = {
  id: string
  dimension: DimensionId
  titre: string
  /** Une phrase. Pourquoi cette action, pour elle, maintenant. */
  pourquoi: string
  effortMinutes: number
  difficulte: Difficulte
  /** ids d'actions qui doivent apparaître avant celle-ci. */
  prerequis: string[]
  /** Même intention, plus petite. Sert quand adapt.ts baisse la marche. */
  versionReduite: string
  /** Faisable ce soir, sans rendez-vous, sans bureau ouvert, sans argent. */
  ceSoir?: boolean
}

// --- Onboarding ---------------------------------------------------------

export type QuestionEchelle = {
  id: string
  type: 'echelle'
  dimension: DimensionId
  texte: string
  poids: number
  /** true = une note haute signifie une situation difficile. */
  inverse?: boolean
  bas: string
  haut: string
}

export type QuestionChoix = {
  id: string
  type: 'choix'
  dimension: DimensionId
  texte: string
  poids: number
  options: { valeur: string; libelle: string; score: number }[]
}

/** Question de charge : sa réponse plafonne le budget d'effort hebdomadaire du plan. */
export type QuestionTemps = {
  id: string
  type: 'temps'
  texte: string
  aide: string
  options: { valeur: string; libelle: string; minutesParSemaine: number }[]
}

export type QuestionTexte = {
  id: string
  type: 'texte'
  texte: string
  aide?: string
  placeholder: string
  max: number
}

export type Question = QuestionEchelle | QuestionChoix | QuestionTemps | QuestionTexte

export type Ecran = {
  id: string
  intention: string
  questions: string[]
}

export type AnswerValue = number | string

// --- Profil -------------------------------------------------------------

export type Archetype = {
  id: string
  /** Décrit une situation, pas une personnalité. Elle doit pouvoir la rejeter. */
  titre: string
  situation: string
  levier: string
  tension: DimensionId
  force: DimensionId
}

export type Profile = {
  archetypeId: string
  titre: string
  situation: string
  levier: string
  forces: DimensionId[]
  tensions: DimensionId[]
  visionReformulee: string
  horizonUnAn: string
  /** Scores internes. Jamais affichés en chiffres — ils servent à répartir les actions. */
  scores: Record<DimensionId, number>
  minutesParSemaine: number
}

// --- Plan ---------------------------------------------------------------

export type PlannedAction = {
  actionId: string
  prioritaire: boolean
  reduite: boolean
}

export type PlanWeek = {
  index: number
  intention: string
  actions: PlannedAction[]
}

export type Milestone = {
  jour: 30 | 60 | 90
  titre: string
  detail: string
  /** Les actions qui se débloquent à ce jalon. Un jalon nomme du concret, pas une intention. */
  actionIds: string[]
}

export type PlanChange = {
  revision: number
  type: 'reduite' | 'remplacee' | 'montee' | 'glissee' | 'terminee'
  actionId: string
  texte: string
}

export type Plan = {
  revision: number
  generatedAt: string
  semaines: PlanWeek[]
  jalons90: Milestone[]
  horizon: string
  historique: PlanChange[]
}

// --- Progression --------------------------------------------------------

export type WeekLog = {
  semaine: number
  completeLe: string
  faites: string[]
  nonFaites: string[]
  reflexion: { questionId: string; reponse: string }
}

export type Progress = {
  faites: string[]
  semaines: WeekLog[]
  dernierRituel: string | null
}

export type AppState = {
  version: 1
  createdAt: string
  answers: Record<string, AnswerValue>
  profile: Profile
  plan: Plan
  progress: Progress
}

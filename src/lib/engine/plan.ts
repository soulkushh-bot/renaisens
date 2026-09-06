import { ACTIONS, actionsParDimension } from '@/content/actions'
import {
  DIMENSIONS,
  type Action,
  type DimensionId,
  type Milestone,
  type Plan,
  type PlanWeek,
  type PlannedAction,
  type Profile,
} from '@/types'

/**
 * Profil → plan de 30 jours.
 *
 * Règle de charge, non négociable : 3 actions par semaine au maximum, 1 seule prioritaire.
 * Une femme en transition n'a pas douze créneaux disponibles. Un plan trop lourd est abandonné en
 * semaine 2 — et un plan abandonné en semaine 2 est un produit qui a échoué, quelle que soit la
 * qualité de son diagnostic.
 *
 * Entièrement déterministe : aucun `Math.random`, aucune horloge dans la sélection. Deux ouvertures
 * du même profil donnent le même plan, et le moteur est testable.
 */

export const MAX_ACTIONS_SEMAINE = 3
export const NB_SEMAINES = 4

/** Difficulté maximale autorisée par semaine. La semaine 1 ne fait jamais peur. */
const DIFFICULTE_MAX = [2, 2, 3, 3] as const
/** La semaine 1 ne contient que des actions courtes. */
const EFFORT_MAX_SEMAINE_1 = 30

const INTENTIONS: Record<DimensionId, [string, string, string, string]> = {
  soi: [
    'tu reprends un peu de place.',
    'tu poses une limite, une seule.',
    'tu regardes ce que tu sais déjà faire.',
    'tu vérifies ce qui a bougé.',
  ],
  carriere: [
    'tu remets ton travail à plat.',
    'tu mets des chiffres sur ce que tu fais.',
    'tu ouvres une porte à l’extérieur.',
    'tu poses une date.',
  ],
  finances: [
    'tu regardes tes chiffres en face.',
    'tu ranges ce que tu as vu.',
    'tu récupères de l’argent qui t’échappe.',
    'tu fixes le montant qui te libère.',
  ],
  projet: [
    'tu sors ton projet de ta tête.',
    'tu vas chercher ta première cliente.',
    'tu mets un prix dessus.',
    'tu vends, ou tu testes.',
  ],
  entourage: [
    'tu le dis à quelqu’un.',
    'tu demandes quelque chose.',
    'tu allèges ce que tu portes.',
    'tu trouves des femmes qui font pareil.',
  ],
}

// --- outils déterministes ------------------------------------------------

function comparer(x: Action, y: Action): number {
  return (
    x.difficulte - y.difficulte ||
    x.effortMinutes - y.effortMinutes ||
    (x.id < y.id ? -1 : x.id > y.id ? 1 : 0)
  )
}

/**
 * Ordonne une liste d'actions en garantissant qu'une action n'arrive jamais avant son prérequis.
 * Sans ça, le plan pourrait proposer « Demande le rendez-vous » avant « Prépare ta demande ».
 */
export function ordonnerAvecPrerequis(liste: Action[]): Action[] {
  const dispo = new Map(liste.map((a) => [a.id, a]))
  const sortie: Action[] = []
  const emises = new Set<string>()

  const visiter = (a: Action, pile: Set<string>): void => {
    if (emises.has(a.id) || pile.has(a.id)) return
    pile.add(a.id)
    for (const p of a.prerequis) {
      const pa = dispo.get(p)
      if (pa) visiter(pa, pile)
    }
    pile.delete(a.id)
    emises.add(a.id)
    sortie.push(a)
  }

  for (const a of [...liste].sort(comparer)) visiter(a, new Set())
  return sortie
}

/** Les dimensions, de la plus en tension à la plus solide. */
export function ordreTension(scores: Record<DimensionId, number>): DimensionId[] {
  return [...DIMENSIONS].sort(
    (a, b) => scores[a] - scores[b] || DIMENSIONS.indexOf(a) - DIMENSIONS.indexOf(b),
  )
}

/** Une femme qui a 45 minutes par semaine ne reçoit pas le même plan qu'une femme qui en a cinq heures. */
export function actionsParSemaine(minutes: number): number {
  return minutes < 60 ? 2 : MAX_ACTIONS_SEMAINE
}

/**
 * Répartit les slots entre les 5 dimensions, proportionnellement au déficit (100 − score).
 * Chaque dimension reçoit au moins 1 slot — le plan touche toute sa vie, pas seulement son point
 * faible. La dimension la plus en tension en reçoit au moins 3, sa plus grande force au plus 2.
 */
export function repartirSlots(
  scores: Record<DimensionId, number>,
  total: number,
): Record<DimensionId, number> {
  const ordre = ordreTension(scores)
  const tension = ordre[0]!
  const force = ordre[ordre.length - 1]!

  const alloc = {} as Record<DimensionId, number>
  for (const d of DIMENSIONS) alloc[d] = 1

  const restants = Math.max(0, total - DIMENSIONS.length)
  const poids = DIMENSIONS.map((d) => Math.max(1, 100 - scores[d]))
  const sommePoids = poids.reduce((a, b) => a + b, 0)

  const parts = DIMENSIONS.map((d, i) => ({
    d,
    exact: (restants * poids[i]!) / sommePoids,
  }))
  let places = 0
  for (const p of parts) {
    const n = Math.floor(p.exact)
    alloc[p.d] += n
    places += n
  }
  const reste = [...parts].sort(
    (a, b) =>
      b.exact - Math.floor(b.exact) - (a.exact - Math.floor(a.exact)) ||
      DIMENSIONS.indexOf(a.d) - DIMENSIONS.indexOf(b.d),
  )
  for (let i = 0; i < restants - places; i++) alloc[reste[i % reste.length]!.d] += 1

  const transferer = (de: DimensionId, vers: DimensionId) => {
    alloc[de] -= 1
    alloc[vers] += 1
  }

  // Plancher sur la tension principale.
  for (let garde = 0; alloc[tension] < 3 && garde < 20; garde++) {
    const src = [...DIMENSIONS]
      .filter((d) => d !== tension && alloc[d] > 1)
      .sort((a, b) => scores[b] - scores[a] || DIMENSIONS.indexOf(a) - DIMENSIONS.indexOf(b))[0]
    if (!src) break
    transferer(src, tension)
  }

  // Plafond sur la force principale : on ne passe pas le mois à consolider ce qui va déjà bien.
  for (let garde = 0; alloc[force] > 2 && garde < 20; garde++) {
    const dst = ordre.filter((d) => d !== force && alloc[d] < 4)[0]
    if (!dst) break
    transferer(force, dst)
  }

  // Plafond général : un plan monothématique n'est pas un plan de vie.
  for (const d of DIMENSIONS) {
    for (let garde = 0; alloc[d] > 4 && garde < 20; garde++) {
      const dst = ordre.filter((x) => x !== d && alloc[x] < 4)[0]
      if (!dst) break
      transferer(d, dst)
    }
  }

  return alloc
}

/**
 * Choisit `quota` actions dans une dimension, en entrant dans la liste à une hauteur qui dépend de
 * son score sur cette dimension.
 *
 * C'est ce qui empêche deux femmes différentes de recevoir le même plan. Sans ça, toute sélection
 * est un préfixe de la liste « du plus doux au plus exigeant » et tout le monde reçoit les mêmes
 * actions d'entrée de gamme. Concrètement : on ne demande pas à une femme qui suit déjà ses
 * dépenses au franc près d'aller « lire son relevé » — on lui donne le calcul de son prix plancher.
 *
 * Les prérequis restent garantis : si l'action visée en demande une, c'est le prérequis qui est
 * pris d'abord, et il compte dans le quota.
 */
export function selectionnerDansDimension(
  liste: Action[],
  quota: number,
  score: number,
): Action[] {
  if (quota <= 0) return []
  const parId = new Map(liste.map((a) => [a.id, a]))
  const choisies: Action[] = []
  const prises = new Set<string>()

  const prendre = (a: Action): void => {
    if (prises.has(a.id) || choisies.length >= quota) return
    for (const p of a.prerequis) {
      const pa = parId.get(p)
      if (pa && !prises.has(p)) prendre(pa)
    }
    if (prises.has(a.id) || choisies.length >= quota) return
    prises.add(a.id)
    choisies.push(a)
  }

  const marge = Math.max(0, liste.length - quota)
  const depart = Math.min(marge, Math.max(0, Math.round((score / 100) * marge)))

  for (let i = depart; i < liste.length && choisies.length < quota; i++) prendre(liste[i]!)
  // Filet : si la fin de liste ne suffit pas (prérequis manquants), on complète par le début.
  for (let i = 0; i < liste.length && choisies.length < quota; i++) prendre(liste[i]!)

  return choisies
}

// --- génération ----------------------------------------------------------

export type OptionsPlan = { maintenant?: string }

export function genererPlan(profile: Profile, options: OptionsPlan = {}): Plan {
  const parSemaine = actionsParSemaine(profile.minutesParSemaine)
  const total = parSemaine * NB_SEMAINES
  const alloc = repartirSlots(profile.scores, total)
  const ordre = ordreTension(profile.scores)

  const selection: Action[] = []
  const suiteParDimension = new Map<DimensionId, Action[]>()
  for (const d of DIMENSIONS) {
    const liste = ordonnerAvecPrerequis(actionsParDimension(d))
    const choisies = selectionnerDansDimension(liste, alloc[d], profile.scores[d])
    const prises = new Set(choisies.map((a) => a.id))
    selection.push(...choisies)
    suiteParDimension.set(
      d,
      liste.filter((a) => !prises.has(a.id)),
    )
  }

  const pool = ordonnerAvecPrerequis(selection)
  const idsPool = new Set(pool.map((a) => a.id))
  const placees = new Set<string>()
  const prioritairesUtilisees = new Set<DimensionId>()
  const semaines: PlanWeek[] = []

  for (let s = 1; s <= NB_SEMAINES; s++) {
    const diffMax = DIFFICULTE_MAX[s - 1]!
    const choisies: Action[] = []
    let effort = 0

    const admissible = (a: Action): boolean => {
      if (placees.has(a.id)) return false
      if (a.difficulte > diffMax) return false
      if (s === 1 && a.effortMinutes > EFFORT_MAX_SEMAINE_1) return false
      return a.prerequis.every(
        (p) => placees.has(p) || choisies.some((c) => c.id === p) || !idsPool.has(p),
      )
    }

    const prendre = (a: Action) => {
      choisies.push(a)
      effort += a.effortMinutes
      placees.add(a.id)
    }

    // La semaine 1 doit contenir au moins une action faisable ce soir.
    // C'est littéralement la phrase de contrôle du produit : « une première action dès ce soir ».
    if (s === 1) {
      const ceSoir = pool.find((a) => a.ceSoir && admissible(a))
      if (ceSoir) prendre(ceSoir)
    }

    for (const a of pool) {
      if (choisies.length >= parSemaine) break
      if (!admissible(a)) continue
      // Le budget d'effort vient de SA réponse sur le temps qu'elle a vraiment.
      // Une semaine n'est jamais vide pour autant : la première action passe quoi qu'il arrive.
      if (choisies.length > 0 && effort + a.effortMinutes > profile.minutesParSemaine) continue
      prendre(a)
    }

    const dimPrio =
      ordre.find((d) => !prioritairesUtilisees.has(d) && choisies.some((c) => c.dimension === d)) ??
      ordre.find((d) => choisies.some((c) => c.dimension === d))
    if (dimPrio) prioritairesUtilisees.add(dimPrio)

    const idPrio = (choisies.find((c) => c.dimension === dimPrio) ?? choisies[0])?.id

    semaines.push({
      index: s,
      intention: dimPrio ? `Cette semaine, ${INTENTIONS[dimPrio][s - 1]}` : 'Cette semaine, tu avances à ton rythme.',
      actions: choisies.map<PlannedAction>((a) => ({
        actionId: a.id,
        prioritaire: a.id === idPrio,
        reduite: false,
      })),
    })
  }

  return {
    revision: 1,
    generatedAt: options.maintenant ?? new Date().toISOString(),
    semaines,
    jalons90: construireJalons(ordre, suiteParDimension, placees),
    horizon: profile.horizonUnAn,
    historique: [],
  }
}

const TITRES_JALONS: Record<30 | 60 | 90, string> = {
  30: 'Ce que les trente premiers jours ouvrent',
  60: 'Ce qui devient faisable ensuite',
  90: 'Ce que tu peux viser à trois mois',
}

/**
 * Les jalons ne sont pas de la prose de remplissage : ils nomment les actions qui se débloquent
 * une fois les trente jours passés, tirées de la même bibliothèque, dans l'ordre de tension.
 */
function construireJalons(
  ordre: DimensionId[],
  suiteParDimension: Map<DimensionId, Action[]>,
  placees: Set<string>,
): Milestone[] {
  const suite: Action[] = []
  for (const d of ordre) {
    const restantes = (suiteParDimension.get(d) ?? []).filter((a) => !placees.has(a.id))
    suite.push(...restantes.slice(0, 2))
  }

  return ([30, 60, 90] as const).map((jour, i) => {
    const lot = suite.slice(i * 2, i * 2 + 2)
    return {
      jour,
      titre: TITRES_JALONS[jour],
      detail:
        lot.length > 0
          ? lot.map((a) => a.titre).join(' ')
          : 'À ce stade, le plan se réécrit à partir de ce que tu auras réellement fait.',
      actionIds: lot.map((a) => a.id),
    }
  })
}

// --- lecture -------------------------------------------------------------

export function actionsDuPlan(plan: Plan): string[] {
  return plan.semaines.flatMap((s) => s.actions.map((a) => a.actionId))
}

export function semaineDuPlan(plan: Plan, index: number): PlanWeek | undefined {
  return plan.semaines.find((s) => s.index === index)
}

/** Une action de la bibliothèque qui n'est ni au plan, ni déjà faite. Sert aux remplacements. */
export function actionDisponible(
  plan: Plan,
  faites: readonly string[],
  dimensionsPreferees: DimensionId[],
  options: { difficulteMin?: number } = {},
): Action | undefined {
  const prises = new Set([...actionsDuPlan(plan), ...faites])
  const min = options.difficulteMin ?? 0
  const utilisable = (a: Action) =>
    !prises.has(a.id) &&
    a.difficulte >= min &&
    a.prerequis.every((p) => faites.includes(p) || prises.has(p))

  for (const d of dimensionsPreferees) {
    const candidate = ordonnerAvecPrerequis(actionsParDimension(d)).find(utilisable)
    if (candidate) return candidate
  }
  return ordonnerAvecPrerequis(ACTIONS).find(utilisable)
}

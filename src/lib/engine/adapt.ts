import { action, actionOptionnelle } from '@/content/actions'
import type { DimensionId, Plan, PlanChange, PlanWeek, Profile, Progress, WeekLog } from '@/types'
import { actionDisponible, actionsParSemaine, ordreTension } from './plan'

/**
 * Le plan vivant — la correction de la faille n°1.
 *
 * Un questionnaire qui rend un document est un moment fort suivi de rien. Ici, le plan se réécrit
 * à partir de ce qu'elle a réellement fait, et elle voit *quoi* a changé et *pourquoi*.
 *
 * Trois règles, dans cet ordre :
 *  1. Une action non faite deux semaines de suite n'est jamais répétée à l'identique : elle est
 *     proposée à la baisse, dans sa version réduite. Même intention, taille d'une semaine difficile.
 *  2. Une action non faite une troisième fois sort du plan. Ce n'est pas la bonne action pour elle,
 *     ou pas le bon moment. On la remplace ailleurs plutôt que d'insister.
 *  3. Deux semaines pleines de suite autorisent une marche de plus. Jamais une action de plus.
 *
 * Ce qui n'arrive JAMAIS : une semaine ratée ne casse rien. Pas de série remise à zéro, pas de
 * compteur rouge, pas de rattrapage à faire. Le rituel de la semaine 2 se fait quand elle revient,
 * qu'il se soit passé sept jours ou vingt. Le produit doit être plus indulgent qu'une app de fitness.
 */

export type Adaptation = { plan: Plan; changements: PlanChange[] }

function compterManques(progress: Progress, actionId: string): number {
  return progress.semaines.filter((s) => s.nonFaites.includes(actionId)).length
}

function assurerSemaine(semaines: PlanWeek[], index: number): PlanWeek {
  const existante = semaines.find((s) => s.index === index)
  if (existante) return existante
  const nouvelle: PlanWeek = {
    index,
    intention: 'Cette semaine, tu continues. Rien de plus.',
    actions: [],
  }
  semaines.push(nouvelle)
  semaines.sort((a, b) => a.index - b.index)
  return nouvelle
}

function titreLisible(actionId: string): string {
  return actionOptionnelle(actionId)?.titre ?? actionId
}

export function adapterPlan(args: {
  plan: Plan
  profile: Profile
  progress: Progress
  log: WeekLog
}): Adaptation {
  const { plan, profile, progress, log } = args
  const revision = plan.revision + 1
  const changements: PlanChange[] = []
  const capacite = actionsParSemaine(profile.minutesParSemaine)
  const ordre = ordreTension(profile.scores)

  const semaines: PlanWeek[] = plan.semaines.map((s) => ({
    ...s,
    actions: s.actions.map((a) => ({ ...a })),
  }))

  /** Où chaque action se trouvait avant réécriture. Sert à ne raconter chaque mouvement qu'une fois. */
  const positionAvant = new Map<string, number>()
  for (const s of plan.semaines) {
    if (s.index <= log.semaine) continue
    for (const a of s.actions) positionAvant.set(a.actionId, s.index)
  }
  for (const id of log.nonFaites) positionAvant.set(id, log.semaine)

  const suivante = assurerSemaine(semaines, log.semaine + 1)
  const courante = semaines.find((s) => s.index === log.semaine)

  /**
   * Ce qu'elle n'a pas fait passe DEVANT ce qui était prévu.
   * C'est ce qu'elle a déjà en tête ; le repousser derrière une action neuve serait lui demander
   * de recommencer une semaine plus tard avec une chose de plus sur la liste.
   */
  const ajouter = (actionId: string, reduite: boolean, devant: boolean) => {
    if (suivante.actions.some((a) => a.actionId === actionId)) return
    const entree = { actionId, prioritaire: false, reduite }
    if (devant) suivante.actions.unshift(entree)
    else suivante.actions.push(entree)
  }

  // 1 et 2 — ce qui n'a pas été fait.
  for (const actionId of log.nonFaites) {
    const manques = compterManques(progress, actionId)

    if (manques >= 3) {
      const remplacante = actionDisponible(plan, progress.faites, ordre)
      retirerPartout(semaines, actionId, log.semaine)
      if (remplacante) {
        ajouter(remplacante.id, false, false)
        changements.push({
          revision,
          type: 'remplacee',
          actionId,
          texte: `On arrête « ${titreLisible(actionId)} ». Trois fois, ce n’est pas de la paresse : ce n’est pas la bonne action pour toi maintenant. À la place : ${remplacante.titre}`,
        })
      } else {
        changements.push({
          revision,
          type: 'remplacee',
          actionId,
          texte: `On retire « ${titreLisible(actionId)} » du plan. Elle reviendra si tu la veux.`,
        })
      }
      continue
    }

    if (manques >= 2) {
      ajouter(actionId, true, true)
      changements.push({
        revision,
        type: 'reduite',
        actionId,
        texte: `« ${titreLisible(actionId)} » devient : ${action(actionId).versionReduite} Plus petit, mais tu l’auras fait.`,
      })
      continue
    }

    // Aucun message ici : le déplacement réel est décrit une seule fois, plus bas, quand on sait
    // dans quelle semaine l'action a fini par atterrir.
    ajouter(actionId, false, true)
  }

  // 3 — deux semaines pleines de suite : une marche de plus, jamais une action de plus.
  const deuxPleines =
    progress.semaines.length >= 2 &&
    progress.semaines.slice(-2).every((s) => s.nonFaites.length === 0 && s.faites.length > 0)

  if (deuxPleines && suivante.actions.length > 0) {
    const remplacable = [...suivante.actions]
      .filter((a) => !a.prioritaire)
      .sort(
        (x, y) =>
          (actionOptionnelle(x.actionId)?.difficulte ?? 3) -
          (actionOptionnelle(y.actionId)?.difficulte ?? 3),
      )[0]
    const actuelle = remplacable ? (actionOptionnelle(remplacable.actionId)?.difficulte ?? 3) : 3
    const montee = actionDisponible(
      plan,
      progress.faites,
      ordre.filter((d) => estTension(d, ordre)),
      { difficulteMin: actuelle + 1 },
    )
    if (remplacable && montee) {
      remplacable.actionId = montee.id
      remplacable.reduite = false
      changements.push({
        revision,
        type: 'montee',
        actionId: montee.id,
        texte: `Deux semaines pleines. On monte d’une marche, pas d’une action : ${montee.titre}`,
      })
    }
  }

  // Plafond de charge, en cascade. Ce qui dépasse glisse d'une semaine, autant de fois qu'il faut —
  // on n'empile jamais. C'est la règle qui évite qu'une mauvaise quinzaine produise une semaine à
  // neuf actions, c'est-à-dire un plan qu'on abandonne.
  for (let i = 0; i < semaines.length; i++) {
    const s = semaines[i]!
    if (s.index <= log.semaine || s.actions.length <= capacite) continue
    const surplus = s.actions.splice(capacite)
    const apres = assurerSemaine(semaines, s.index + 1)
    for (const a of surplus) {
      if (!apres.actions.some((x) => x.actionId === a.actionId)) apres.actions.push(a)
    }
    i = -1 // on repart du début : le débordement peut se propager de semaine en semaine
  }

  // Exactement une action prioritaire par semaine.
  for (const s of semaines) retablirPriorite(s, ordre)

  /*
    Les déplacements sont racontés UNE seule fois, à la fin, quand on connaît la destination réelle.
    Sans ça, une action qui glisse de la semaine 2 à la 3 puis de la 3 à la 4 produisait trois
    messages pour un seul mouvement.

    Et surtout : une semaine où elle n'a rien coché ne doit pas lui rendre un mur de dix lignes
    expliquant tout ce qui est repoussé. Au-delà de trois déplacements, on résume en une phrase.
    Le plan glisse, il ne s'écroule pas.
  */
  const deplacements = [...positionAvant.entries()]
    .map(([id, avant]) => ({ id, avant, apres: positionDe(semaines, id, log.semaine) }))
    .filter((d) => d.apres !== undefined && d.apres !== d.avant)
    .filter((d) => !changements.some((c) => c.actionId === d.id))

  // Ce qu'elle n'a pas fait est nommé, une ligne chacun : c'est l'information.
  const reportees = deplacements.filter((d) => log.nonFaites.includes(d.id))
  for (const d of reportees) {
    changements.push({
      revision,
      type: 'glissee',
      actionId: d.id,
      texte: `« ${titreLisible(d.id)} » passe à la semaine ${d.apres}. Rien n’est perdu.`,
    })
  }

  // Le reste du plan décale par simple conséquence du plafond. Ce n'est pas une information par
  // action — c'est une information par plan, et ça tient en une phrase.
  const decalees = deplacements.filter((d) => !log.nonFaites.includes(d.id))
  if (decalees.length === 1) {
    const d = decalees[0]!
    changements.push({
      revision,
      type: 'glissee',
      actionId: d.id,
      texte: `« ${titreLisible(d.id)} » attendra la semaine ${d.apres} : jamais plus de ${capacite} actions dans une semaine.`,
    })
  } else if (decalees.length > 1) {
    changements.push({
      revision,
      type: 'glissee',
      actionId: decalees[0]!.id,
      texte: `Le reste du plan décale d’une semaine — ${decalees.length} actions attendront un peu. Jamais plus de ${capacite} par semaine, et tu n’as rien à rattraper.`,
    })
  }

  if (courante && courante.actions.length > 0 && log.nonFaites.length === 0) {
    changements.push({
      revision,
      type: 'terminee',
      actionId: courante.actions[0]!.actionId,
      texte: `Semaine ${log.semaine} : tout est fait. Le plan de la semaine suivante n’a pas eu besoin d’être allégé.`,
    })
  }

  return {
    plan: {
      ...plan,
      revision,
      semaines,
      historique: [...plan.historique, ...changements],
    },
    changements,
  }
}

/**
 * Où l'action se trouve DANS LES SEMAINES A VENIR.
 * Les semaines passées gardent leur liste telle quelle — c'est l'historique de ce qui a été proposé,
 * et le chercher là fausserait tout calcul de déplacement.
 */
function positionDe(
  semaines: PlanWeek[],
  actionId: string,
  apresLaSemaine: number,
): number | undefined {
  return semaines.find(
    (s) => s.index > apresLaSemaine && s.actions.some((a) => a.actionId === actionId),
  )?.index
}

function estTension(d: DimensionId, ordre: DimensionId[]): boolean {
  return ordre.indexOf(d) < 3
}

function retirerPartout(semaines: PlanWeek[], actionId: string, aPartirDe: number): void {
  for (const s of semaines) {
    if (s.index <= aPartirDe) continue
    s.actions = s.actions.filter((a) => a.actionId !== actionId)
  }
}

function retablirPriorite(semaine: PlanWeek, ordre: DimensionId[]): void {
  if (semaine.actions.length === 0) return
  const dejaUne = semaine.actions.filter((a) => a.prioritaire).length === 1
  if (dejaUne) return

  const rang = (id: string) => {
    const d = actionOptionnelle(id)?.dimension
    return d ? ordre.indexOf(d) : ordre.length
  }
  const meilleure = [...semaine.actions].sort((a, b) => rang(a.actionId) - rang(b.actionId))[0]!
  for (const a of semaine.actions) a.prioritaire = a.actionId === meilleure.actionId
}

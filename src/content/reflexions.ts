import type { DimensionId } from '@/types'

/**
 * Les questions du rituel hebdomadaire.
 *
 * Une seule question par semaine, choisie par (numéro de semaine × dimension la plus en tension).
 * Elle est courte à lire et courte à répondre — le rituel doit tenir en trois minutes, et un champ
 * de journal libre ne tient jamais en trois minutes.
 *
 * Semaine 4 : la question renvoie explicitement à ce qu'elle a écrit le premier jour. C'est le
 * moment de récompense du produit.
 */

export type Reflexion = {
  id: string
  texte: string
  aide?: string
}

const GENERIQUES: Record<number, Reflexion> = {
  1: {
    id: 'r-s1-generique',
    texte: 'Qu’est-ce qui a été plus facile que tu ne le pensais ?',
    aide: 'Même une chose minuscule.',
  },
  2: {
    id: 'r-s2-generique',
    texte: 'Cette semaine, qu’est-ce qui t’a pris du temps sans rien te rapporter ?',
  },
  3: {
    id: 'r-s3-generique',
    texte: 'Qu’est-ce que tu ferais différemment si tu recommençais la semaine ?',
  },
  4: {
    id: 'r-s4-generique',
    texte: 'Un mois plus tard : qu’est-ce qui a changé, même un peu ?',
    aide: 'Tu vas relire ta réponse du premier jour juste après.',
  },
}

const PAR_DIMENSION: Record<DimensionId, Record<number, Reflexion>> = {
  soi: {
    1: { id: 'r-soi-1', texte: 'À quel moment cette semaine tu t’es sentie à ta place ?' },
    2: {
      id: 'r-soi-2',
      texte: 'Qu’est-ce que tu as accepté cette semaine que tu aurais préféré refuser ?',
    },
    3: {
      id: 'r-soi-3',
      texte: 'Qu’est-ce que tu sais faire aujourd’hui que tu ne savais pas faire il y a un an ?',
    },
    4: {
      id: 'r-soi-4',
      texte: 'Est-ce que tu te parles autrement qu’il y a un mois ? Dis-le comme ça vient.',
    },
  },
  carriere: {
    1: { id: 'r-car-1', texte: 'Quelle partie de ta semaine de travail tu recommencerais volontiers ?' },
    2: { id: 'r-car-2', texte: 'Qu’est-ce que tu as appris cette semaine sans t’en rendre compte ?' },
    3: {
      id: 'r-car-3',
      texte: 'Si tu devais expliquer ton métier à une inconnue, tu commencerais par quoi maintenant ?',
    },
    4: { id: 'r-car-4', texte: 'Est-ce que tu vois mieux où tu seras dans deux ans qu’au début du mois ?' },
  },
  finances: {
    1: { id: 'r-fin-1', texte: 'Qu’est-ce que tu as vu dans tes chiffres que tu ne voulais pas voir ?' },
    2: { id: 'r-fin-2', texte: 'Quelle dépense de cette semaine tu ne referais pas ?' },
    3: {
      id: 'r-fin-3',
      texte: 'Combien de temps tu tiendrais aujourd’hui sans revenu ? Une estimation suffit.',
    },
    4: {
      id: 'r-fin-4',
      texte: 'Est-ce que l’argent t’empêche encore de dormir autant qu’il y a un mois ?',
    },
  },
  projet: {
    1: { id: 'r-pro-1', texte: 'Qui a entendu parler de ton projet cette semaine ?' },
    2: { id: 'r-pro-2', texte: 'Qu’est-ce qu’on t’a dit sur ton projet que tu n’avais pas prévu ?' },
    3: {
      id: 'r-pro-3',
      texte: 'Ton offre, aujourd’hui, tu la dirais comment en une phrase ?',
    },
    4: {
      id: 'r-pro-4',
      texte: 'Qu’est-ce qui existe aujourd’hui et qui n’existait pas il y a un mois ?',
    },
  },
  entourage: {
    1: { id: 'r-ent-1', texte: 'À qui tu as demandé quelque chose cette semaine ?' },
    2: { id: 'r-ent-2', texte: 'Qu’est-ce que tu as porté cette semaine qui n’était pas à toi ?' },
    3: { id: 'r-ent-3', texte: 'Qui pourrait t’aider et ne le sait pas encore ?' },
    4: {
      id: 'r-ent-4',
      texte: 'Est-ce qu’il y a plus de monde autour de ce que tu construis qu’il y a un mois ?',
    },
  },
}

/**
 * @param semaine 1..4 (au-delà de 4, on boucle sur les questions de la semaine 4).
 * @param tension la dimension la plus basse du profil.
 */
export function reflexionPour(semaine: number, tension: DimensionId): Reflexion {
  const s = Math.min(Math.max(Math.trunc(semaine), 1), 4)
  return PAR_DIMENSION[tension][s] ?? GENERIQUES[s] ?? GENERIQUES[1]!
}

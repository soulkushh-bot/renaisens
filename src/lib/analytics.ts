import { track } from '@vercel/analytics'

/**
 * Les six événements du produit, définis le premier jour.
 *
 * La métrique qui compte n'est pas le nombre d'inscriptions : c'est le pourcentage qui complète le
 * rituel de la semaine 2. C'est elle qui dit si le produit s'arrête après le diagnostic ou non.
 * Elle est en tête du README pour qu'on ne l'oublie pas.
 */
export type Evenement =
  | 'onboarding_started'
  | 'onboarding_completed'
  | 'plan_generated'
  | 'first_action_checked'
  | 'weekly_ritual_completed'
  | 'day30_reached'

type Proprietes = Record<string, string | number | boolean>

export function mesurer(nom: Evenement, proprietes?: Proprietes): void {
  if (typeof window === 'undefined') return
  if (process.env.NODE_ENV !== 'production') {
    // En développement, on n'envoie rien : on veut voir passer les événements, pas les compter.
    console.debug('[mesure]', nom, proprietes ?? {})
    return
  }
  try {
    track(nom, proprietes)
  } catch {
    // La mesure ne casse jamais un parcours. Surtout pas le rituel, qui doit marcher hors ligne.
  }
}

import type { AnswerValue, AppState } from '@/types'

/**
 * La frontière de persistance.
 *
 * Tout le produit passe par cette interface et par rien d'autre. Aujourd'hui elle est implémentée
 * par `localStorage` : ses réponses sur son argent, son travail et sa famille ne quittent pas son
 * téléphone. C'est un argument produit, dit en clair dans l'onboarding et dans les réglages —
 * pas seulement un raccourci technique.
 *
 * Brancher Supabase plus tard = écrire une deuxième implémentation et changer `storage/index.ts`.
 * Un seul fichier. Aucun écran ne connaît le mode de stockage.
 */
export interface StorageAdapter {
  lire(): Promise<AppState | null>
  ecrire(state: AppState): Promise<void>
  effacer(): Promise<void>

  /** Le bilan en cours. Elle peut fermer l'onglet au milieu et revenir. */
  lireBrouillon(): Promise<Record<string, AnswerValue>>
  ecrireBrouillon(reponses: Record<string, AnswerValue>): Promise<void>
  effacerBrouillon(): Promise<void>
}

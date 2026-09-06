import { stockageLocal } from './local'
import type { StorageAdapter } from './adapter'

/**
 * Le seul fichier a changer pour brancher une base.
 * `export const stockage: StorageAdapter = stockageSupabase` et tout le produit suit.
 */
export const stockage: StorageAdapter = stockageLocal

export type { StorageAdapter }

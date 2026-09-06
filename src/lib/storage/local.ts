import type { AnswerValue, AppState } from '@/types'
import type { StorageAdapter } from './adapter'

const CLE_ETAT = 'renaisens:v1'
const CLE_BROUILLON = 'renaisens:brouillon:v1'

/**
 * `localStorage` peut lever, et pas seulement en navigation privée : certains navigateurs le
 * bloquent, certaines captures d'écran l'isolent. Toute lecture rate proprement — l'app doit
 * s'afficher correctement même sans rien de stocké.
 */
function lireBrut(cle: string): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(cle)
  } catch {
    return null
  }
}

function ecrireBrut(cle: string, valeur: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(cle, valeur)
  } catch {
    // Stockage indisponible ou plein : la session reste utilisable, elle ne sera juste pas reprise.
  }
}

function supprimer(cle: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(cle)
  } catch {
    /* rien à faire */
  }
}

function estEtatValide(v: unknown): v is AppState {
  if (typeof v !== 'object' || v === null) return false
  const o = v as Partial<AppState>
  return o.version === 1 && !!o.profile && !!o.plan && !!o.progress && Array.isArray(o.plan.semaines)
}

export const stockageLocal: StorageAdapter = {
  async lire() {
    const brut = lireBrut(CLE_ETAT)
    if (!brut) return null
    try {
      const parse: unknown = JSON.parse(brut)
      return estEtatValide(parse) ? parse : null
    } catch {
      return null
    }
  },

  async ecrire(state) {
    ecrireBrut(CLE_ETAT, JSON.stringify(state))
  },

  async effacer() {
    supprimer(CLE_ETAT)
    supprimer(CLE_BROUILLON)
  },

  async lireBrouillon() {
    const brut = lireBrut(CLE_BROUILLON)
    if (!brut) return {}
    try {
      const parse: unknown = JSON.parse(brut)
      return typeof parse === 'object' && parse !== null
        ? (parse as Record<string, AnswerValue>)
        : {}
    } catch {
      return {}
    }
  },

  async ecrireBrouillon(reponses) {
    ecrireBrut(CLE_BROUILLON, JSON.stringify(reponses))
  },

  async effacerBrouillon() {
    supprimer(CLE_BROUILLON)
  },
}

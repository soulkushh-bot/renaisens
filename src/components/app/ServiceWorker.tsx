'use client'

import { useEffect } from 'react'

/**
 * Enregistre le service worker.
 *
 * Le plan et le rituel doivent marcher hors ligne : le segment pilote est sur un reseau instable, et
 * un rituel qui echoue parce que la 3G a laché est un rituel qu'on ne refait pas.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return
    const t = window.setTimeout(() => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Pas de service worker : l'app reste utilisable, simplement sans mode avion.
      })
    }, 1500)
    return () => window.clearTimeout(t)
  }, [])

  return null
}

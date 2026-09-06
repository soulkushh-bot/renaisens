'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * Le seul moment orchestré du produit.
 *
 * Partout ailleurs, le mouvement ne répond qu'à une action de l'utilisatrice — pas de fondu-glissé
 * sur chaque section, pas d'animation au survol de chaque carte. Ici, le motif se « teint » en
 * cascade, une fois, pour marquer le passage du bilan au profil.
 *
 * Chargé en import dynamique depuis /profil uniquement : `motion` ne pèse sur aucune autre route.
 * `prefers-reduced-motion` coupe tout — la page s'affiche simplement, sans étape intermédiaire.
 */
export function RevelationProfil({ children }: { children: React.ReactNode[] }) {
  const reduit = useReducedMotion()

  if (reduit) return <>{children}</>

  return (
    <>
      {children.map((enfant, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.16, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {enfant}
        </motion.div>
      ))}
    </>
  )
}

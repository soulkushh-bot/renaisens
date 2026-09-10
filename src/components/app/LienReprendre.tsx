'use client'

import Link from 'next/link'
import { useEtat } from '@/lib/etat'

/**
 * Le retour vers son plan, dans l'en-tête de l'accueil.
 *
 * L'accueil est la seule surface d'application sans rail : c'est une page de conviction pleine
 * largeur. Une femme qui a déjà fait son bilan et qui revient par l'accueil doit quand même
 * pouvoir rentrer chez elle en un geste — sous 1024 px la barre d'onglets s'en charge, au-dessus
 * c'est ce lien.
 */
export function LienReprendre() {
  const { pret, etat } = useEtat()
  if (!pret || !etat) return null

  return (
    <Link
      href="/aujourdhui"
      className="hidden text-[0.98rem] font-semibold text-magenta lg:inline-flex"
    >
      Reprendre mon plan
    </Link>
  )
}

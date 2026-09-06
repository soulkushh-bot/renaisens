'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEtat } from '@/lib/etat'

/**
 * La barre basse n'apparaît qu'après le bilan.
 * Avant, l'écran ne propose qu'une seule chose à faire — c'est ce qui fait qu'on la fait.
 *
 * Icônes dessinées à la main dans la même langue que le tampon (arêtes droites, aucune courbe).
 * Aucune bibliothèque d'icônes n'est chargée : sur un Android d'entrée de gamme, ce sont des
 * dizaines de kilo-octets qui ne servent à rien.
 */

const ENTREES = [
  { href: '/aujourdhui', libelle: 'Aujourd’hui', glyphe: <rect x="4" y="4" width="8" height="8" /> },
  {
    href: '/plan',
    libelle: 'Plan',
    glyphe: (
      <>
        <rect x="2" y="3" width="12" height="2" />
        <rect x="2" y="7" width="9" height="2" />
        <rect x="2" y="11" width="6" height="2" />
      </>
    ),
  },
  {
    href: '/recits',
    libelle: 'Récits',
    glyphe: (
      <>
        <rect x="2" y="2" width="8" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="4" width="8" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    href: '/reglages',
    libelle: 'Réglages',
    glyphe: (
      <>
        <rect x="7" y="2" width="2" height="12" />
        <rect x="2" y="7" width="12" height="2" />
      </>
    ),
  },
]

export function NavBasse() {
  const { etat, pret } = useEtat()
  const chemin = usePathname()

  if (!pret || !etat) return null
  if (chemin === '/bilan' || chemin === '/profil') return null

  return (
    <nav
      aria-label="Navigation principale"
      className="sticky bottom-0 z-10 mt-10 border-t border-encre/20 bg-coton"
    >
      <ul className="colonne flex">
        {ENTREES.map((e) => {
          const actif = chemin === e.href || chemin.startsWith(`${e.href}/`)
          return (
            <li key={e.href} className="flex-1">
              <Link
                href={e.href}
                aria-current={actif ? 'page' : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-[0.72rem] ${
                  actif ? 'text-cuve' : 'text-encre/55'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  {e.glyphe}
                </svg>
                <span>{e.libelle}</span>
                <span
                  aria-hidden="true"
                  className="block h-[2px] w-6"
                  style={{ background: actif ? 'var(--color-laiton)' : 'transparent' }}
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

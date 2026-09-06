'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEtat } from '@/lib/etat'

/**
 * La barre basse : une bande de papier indigo au bord cranté, collée en bas de la page.
 * Elle n'apparaît qu'après le bilan — avant, l'écran ne propose qu'une seule chose à faire.
 *
 * Les icônes sont des formes découpées pleines, dans la même langue que la rosace : aucune ligne,
 * aucun contour, aucune bibliothèque chargée. L'onglet actif est découpé dans un autre papier —
 * la couleur n'est pas seule à le dire, il y a aussi la fleur et le fond.
 */

const ENTREES = [
  {
    href: '/aujourdhui',
    libelle: 'Aujourd’hui',
    forme: <path d="M12 2 C18 7 20 15 12 22 C4 15 6 7 12 2 Z" />,
  },
  {
    href: '/plan',
    libelle: 'Plan',
    forme: (
      <>
        <rect x="2" y="3" width="20" height="4" rx="1" />
        <rect x="2" y="10" width="14" height="4" rx="1" />
        <rect x="2" y="17" width="8" height="4" rx="1" />
      </>
    ),
  },
  {
    href: '/recits',
    libelle: 'Récits',
    forme: (
      <>
        <circle cx="8" cy="8" r="6" />
        <circle cx="16" cy="16" r="6" />
      </>
    ),
  },
  {
    href: '/reglages',
    libelle: 'Réglages',
    forme: (
      <>
        <circle cx="12" cy="5" r="4" />
        <circle cx="12" cy="19" r="4" />
        <circle cx="5" cy="12" r="4" />
        <circle cx="19" cy="12" r="4" />
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
      className="sur-fond-sombre sticky bottom-0 z-10 mt-14"
    >
      <div
        aria-hidden="true"
        className="couche feston"
        style={{ ['--teinte' as never]: 'var(--color-indigo)', height: '14px' }}
      />
      <div className="couche" style={{ ['--teinte' as never]: 'var(--color-indigo)' }}>
        <ul className="colonne flex">
          {ENTREES.map((e) => {
            const actif = chemin === e.href || chemin.startsWith(`${e.href}/`)
            return (
              <li key={e.href} className="flex-1">
                <Link
                  href={e.href}
                  aria-current={actif ? 'page' : undefined}
                  className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1.5 py-2.5"
                >
                  <span
                    className="couche coupe flex h-8 w-8 items-center justify-center"
                    style={{
                      ['--teinte' as never]: actif
                        ? 'var(--color-souci)'
                        : 'transparent',
                    }}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill={actif ? 'var(--color-indigo)' : 'var(--color-papier-clair)'}
                      opacity={actif ? 1 : 0.7}
                    >
                      {e.forme}
                    </svg>
                  </span>
                  <span
                    className={`font-display text-[0.72rem] font-bold uppercase tracking-[-0.005em] ${
                      actif ? 'text-souci' : 'text-papier-clair/70'
                    }`}
                  >
                    {e.libelle}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

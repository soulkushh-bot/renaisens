'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEtat } from '@/lib/etat'

/**
 * La barre basse n'apparait qu'apres le bilan.
 * Avant, l'ecran ne propose qu'une seule chose a faire — c'est ce qui fait qu'on la fait.
 *
 * L'onglet actif est signale par la couleur ET par une pastille pleine derriere l'icone : la
 * couleur ne porte jamais l'information seule.
 */

const ENTREES = [
  {
    href: '/aujourdhui',
    libelle: 'Aujourd’hui',
    forme: <path d="M12 3 C17 8 19 14 12 21 C5 14 7 8 12 3 Z" />,
  },
  {
    href: '/plan',
    libelle: 'Plan',
    forme: (
      <>
        <rect x="3" y="4" width="18" height="3" rx="1.5" />
        <rect x="3" y="10.5" width="13" height="3" rx="1.5" />
        <rect x="3" y="17" width="8" height="3" rx="1.5" />
      </>
    ),
  },
  {
    href: '/recits',
    libelle: 'Récits',
    forme: (
      <>
        <circle cx="9" cy="9" r="5.5" />
        <circle cx="15.5" cy="15.5" r="5.5" />
      </>
    ),
  },
  {
    href: '/reglages',
    libelle: 'Réglages',
    forme: (
      <>
        <circle cx="12" cy="5.5" r="3.4" />
        <circle cx="12" cy="18.5" r="3.4" />
        <circle cx="5.5" cy="12" r="3.4" />
        <circle cx="18.5" cy="12" r="3.4" />
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
      className="sticky bottom-0 z-10 mt-14 border-t bg-white"
      style={{ borderColor: '#efe4dd' }}
    >
      <ul className="colonne flex">
        {ENTREES.map((e) => {
          const actif = chemin === e.href || chemin.startsWith(`${e.href}/`)
          return (
            <li key={e.href} className="flex-1">
              <Link
                href={e.href}
                aria-current={actif ? 'page' : undefined}
                className="flex min-h-[3.6rem] flex-col items-center justify-center gap-1 py-2.5"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: actif ? 'var(--color-rose-pale)' : 'transparent' }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill={actif ? 'var(--color-prune)' : '#9a8f95'}
                  >
                    {e.forme}
                  </svg>
                </span>
                <span
                  className="text-[0.74rem] font-semibold"
                  style={{ color: actif ? 'var(--color-prune)' : 'var(--color-encre-douce)' }}
                >
                  {e.libelle}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

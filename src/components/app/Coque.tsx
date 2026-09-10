'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/marque/Phenix'
import { useEtat } from '@/lib/etat'

/**
 * La coque de l'application : ce qui entoure les écrans une fois le bilan fait.
 *
 * Sous 1024 px, une barre d'onglets en bas — le produit se tient à une main.
 * À partir de 1024 px, un RAIL LATÉRAL, et la barre d'onglets disparaît. Une barre d'onglets de
 * téléphone posée en bas d'un écran de bureau, c'est un téléphone agrandi, pas un écran composé ;
 * et le rail rend enfin sa largeur utile à la page, qui s'ouvre à côté de lui.
 *
 * La navigation n'apparaît qu'après le bilan. Avant, l'écran ne propose qu'une seule chose à faire
 * — c'est ce qui fait qu'on la fait. Elle disparaît aussi sur le bilan et sur le profil : l'un est
 * une tâche qu'on ne quitte pas par accident, l'autre est le pic émotionnel du produit.
 *
 * L'onglet actif est signalé par la couleur ET par une pastille pleine derrière l'icône : la
 * couleur ne porte jamais l'information seule.
 *
 * Les quatre glyphes sont tracés dans le MÊME système que les marques de domaine — grille de 24,
 * trait de 1.7, extrémités arrondies, aucun aplat. Deux vocabulaires d'icônes qui cohabitent sur
 * le même écran, c'est deux mains différentes sur un seul dessin.
 */

const ENTREES = [
  {
    href: '/aujourdhui',
    libelle: 'Aujourd’hui',
    forme: <path d="M12 3.4c4.3 4.5 6 9.8 0 17.2-6-7.4-4.3-12.7 0-17.2Z" />,
  },
  {
    href: '/plan',
    libelle: 'Plan',
    forme: <path d="M4.2 6.6h15.6M4.2 12h10.6M4.2 17.4h6.4" />,
  },
  {
    href: '/recits',
    libelle: 'Récits',
    forme: (
      <>
        <circle cx="9.4" cy="9.4" r="5.1" />
        <circle cx="15.1" cy="15.1" r="5.1" />
      </>
    ),
  },
  {
    href: '/reglages',
    libelle: 'Réglages',
    forme: (
      <>
        <circle cx="12" cy="5.6" r="2.5" />
        <circle cx="12" cy="18.4" r="2.5" />
        <circle cx="5.6" cy="12" r="2.5" />
        <circle cx="18.4" cy="12" r="2.5" />
      </>
    ),
  },
]

/** Le trait commun aux quatre glyphes. */
const TRAIT = {
  fill: 'none',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const estActif = (chemin: string, href: string) =>
  chemin === href || chemin.startsWith(`${href}/`)

function Rail({ chemin }: { chemin: string }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r bg-white px-4 py-6 lg:flex"
      style={{ borderColor: '#efe4dd' }}
    >
      <Link href="/" className="px-2">
        <Logo taille={34} />
      </Link>

      <nav aria-label="Navigation principale" className="mt-9 flex flex-col gap-1">
        {ENTREES.map((e) => {
          const actif = estActif(chemin, e.href)
          return (
            <Link
              key={e.href}
              href={e.href}
              aria-current={actif ? 'page' : undefined}
              className="flex min-h-12 items-center gap-3 rounded-[0.7rem] px-3 py-2.5 text-[0.98rem] font-semibold"
              style={{
                background: actif ? 'var(--color-rose-pale)' : 'transparent',
                color: actif ? 'var(--color-prune)' : 'var(--color-encre-douce)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
                {...TRAIT}
                stroke={actif ? 'var(--color-prune)' : '#9a8f95'}
              >
                {e.forme}
              </svg>
              {e.libelle}
            </Link>
          )
        })}
      </nav>

      {/*
        Pas de jauge-phénix ici. Elle est déjà sur la page, en grand — la voir deux fois sur le
        même écran se lit comme un défaut de rendu, pas comme un rappel. Le pied du rail porte la
        seule phrase que ce produit a intérêt à répéter.
      */}
      <p className="mt-auto px-3 text-[0.86rem] leading-relaxed text-encre-douce">
        Ton plan et ton rituel sont calculés sur ton téléphone. Rien ne part sur un serveur.
      </p>
    </aside>
  )
}

function BarreOnglets({ chemin }: { chemin: string }) {
  return (
    <nav
      aria-label="Navigation principale"
      className="sticky bottom-0 z-10 mt-14 border-t bg-white lg:hidden"
      style={{ borderColor: '#efe4dd' }}
    >
      <ul className="colonne flex">
        {ENTREES.map((e) => {
          const actif = estActif(chemin, e.href)
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
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    {...TRAIT}
                    stroke={actif ? 'var(--color-prune)' : '#9a8f95'}
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

export function Coque({ children }: { children: React.ReactNode }) {
  const { etat, pret } = useEtat()
  const chemin = usePathname()

  const navigable = pret && etat !== null && chemin !== '/bilan' && chemin !== '/profil'
  /* Pas de rail sur l'accueil : c'est une page de conviction pleine largeur, avec son propre
     en-tête. Le retour vers son plan y est porté par cet en-tête. */
  const avecRail = navigable && chemin !== '/'

  return (
    <div className="lg:flex lg:items-start">
      {avecRail ? <Rail chemin={chemin} /> : null}
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <div className="flex-1">{children}</div>
        {navigable ? <BarreOnglets chemin={chemin} /> : null}
      </div>
    </div>
  )
}

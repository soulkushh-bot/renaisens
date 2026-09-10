import type { DimensionId } from '@/types'

/**
 * Les cinq marques de domaine.
 *
 * Un seul système de trait : même grille de 24, même épaisseur, mêmes extrémités arrondies, aucun
 * aplat. Elles remplacent cinq carrés de couleur vides — le seul endroit de l'accueil qui avait
 * l'air non fini, parce que la catégorie jouée à fond dessine ses icônes et ne pose pas des taches.
 *
 * Chaque domaine a SA couleur. Deux domaines qui partagent une teinte, c'est un système d'identité
 * qui ment : on croit reconnaître un domaine et on en lit un autre. Le bleu manquant est celui de
 * l'aile du phénix.
 */

type Marque = { fond: string; accent: string; trace: React.ReactNode }

const MARQUES: Record<DimensionId, Marque> = {
  /* Soi — une femme debout, seule dans le cadre. */
  soi: {
    fond: 'var(--color-tuile-rose)',
    accent: 'var(--color-icone-rose)',
    trace: (
      <>
        <circle cx="12" cy="7.6" r="3.9" />
        <path d="M4.6 20.4c1.4-4 4.1-6 7.4-6s6 2 7.4 6" />
      </>
    ),
  },

  /* Carrière — une boussole : une direction, pas une échelle. */
  carriere: {
    fond: 'var(--color-tuile-lavande)',
    accent: 'var(--color-icone-violet)',
    trace: (
      <>
        <circle cx="12" cy="12" r="8.6" />
        <path d="M8.7 15.3 14 13.4 15.3 8.7 10 10.6Z" />
      </>
    ),
  },

  /* Finances — des pièces empilées, vues de trois quarts. */
  finances: {
    fond: 'var(--color-tuile-menthe)',
    accent: 'var(--color-icone-vert)',
    trace: (
      <>
        <ellipse cx="12" cy="6.4" rx="6.4" ry="2.7" />
        <path d="M5.6 6.4v5.2c0 1.5 2.9 2.7 6.4 2.7s6.4-1.2 6.4-2.7V6.4" />
        <path d="M5.6 11.6v5.2c0 1.5 2.9 2.7 6.4 2.7s6.4-1.2 6.4-2.7v-5.2" />
      </>
    ),
  },

  /* Projet — une pousse : ça se met en route, ça ne se lance pas comme une fusée. */
  projet: {
    fond: 'var(--color-tuile-peche)',
    accent: 'var(--color-icone-orange)',
    trace: (
      <>
        <path d="M12 20.8V10.2" />
        <path d="M12 13.2C8.4 13.2 6.4 11 6.4 7.6c3.6 0 5.6 2.2 5.6 5.6Z" />
        <path d="M12 16.4c3.6 0 5.6-2.2 5.6-5.6-3.6 0-5.6 2.2-5.6 5.6Z" />
      </>
    ),
  },

  /* Entourage — quelqu'un derrière elle, pas une foule. */
  entourage: {
    fond: 'var(--color-tuile-ciel)',
    accent: 'var(--color-icone-bleu)',
    trace: (
      <>
        <circle cx="9.3" cy="8.6" r="3.4" />
        <path d="M3.2 19.6c.9-3.4 3-5.2 6.1-5.2s5.2 1.8 6.1 5.2" />
        <path d="M15.6 6.6a2.7 2.7 0 0 1 .6 5.3" />
        <path d="M16.4 14.9c2.4.3 4 2 4.6 4.7" />
      </>
    ),
  },
}

export function fondDomaine(dimension: DimensionId) {
  return MARQUES[dimension].fond
}

export function accentDomaine(dimension: DimensionId) {
  return MARQUES[dimension].accent
}

export function MarqueDomaine({
  dimension,
  taille = 30,
  className = '',
}: {
  dimension: DimensionId
  taille?: number
  className?: string
}) {
  const m = MARQUES[dimension]
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke={m.accent}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {m.trace}
    </svg>
  )
}

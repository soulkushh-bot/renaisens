import Link from 'next/link'

/*
  Les primitives.

  Une seule couleur saturée, et seulement là où l'on peut agir : le prune est réservé à l'action.
  C'est la règle qui rend le bouton principal évident sur chaque écran.

  La couleur passe TOUJOURS par une variante, jamais par une classe `bg-*` posée par-dessus : à
  spécificité égale, c'est l'ordre de la feuille finale qui tranche, c'est-à-dire le hasard.
*/

type Variante = 'action' | 'contour' | 'clair' | 'discret'

const TEINTES: Record<Variante, { fond: string; texte: string; extra?: string }> = {
  action: { fond: 'var(--color-prune)', texte: '#ffffff' },
  contour: {
    fond: 'transparent',
    texte: 'var(--color-prune)',
    extra: 'ring-[1.5px] ring-inset ring-prune',
  },
  clair: { fond: '#ffffff', texte: 'var(--color-prune)' },
  discret: { fond: 'transparent', texte: 'var(--color-prune)', extra: 'underline' },
}

const BASE =
  'inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-[0.7rem] px-6 py-3 text-[1rem] font-semibold transition-[filter,background-color] hover:brightness-[1.08] disabled:cursor-not-allowed'

/*
  L'état désactivé n'est pas une opacité : baisser l'opacité d'un bouton plein donne une teinte
  pâle sur un fond pâle, et le libellé passe sous le seuil de contraste sans que personne le voie.
*/
const DESACTIVE = { fond: '#ece5df', texte: 'var(--color-encre-douce)' }

function habits(variante: Variante, desactive: boolean) {
  const v = desactive ? DESACTIVE : TEINTES[variante]
  return {
    className: `${BASE} ${desactive ? '' : (TEINTES[variante].extra ?? '')}`,
    style: { backgroundColor: v.fond, color: v.texte },
  }
}

export function Bouton({
  variante = 'action',
  className = '',
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  const h = habits(variante, props.disabled === true)
  return (
    <button {...props} className={`${h.className} ${className}`} style={{ ...h.style, ...style }} />
  )
}

export function LienBouton({
  href,
  variante = 'action',
  className = '',
  children,
}: {
  href: string
  variante?: Variante
  className?: string
  children: React.ReactNode
}) {
  const h = habits(variante, false)
  return (
    <Link href={href} className={`${h.className} ${className}`} style={h.style}>
      {children}
    </Link>
  )
}

/** La carte blanche, coins doux, ombre basse. */
export function Carte({
  className = '',
  children,
  fond,
}: {
  className?: string
  children: React.ReactNode
  fond?: string
}) {
  return (
    <div className={`carte ${className}`} style={fond ? { background: fond } : undefined}>
      {children}
    </div>
  )
}

/** Une flèche discrète, réservée aux liens de navigation « voir tout ». */
export function Fleche({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className={className}>
      <path
        d="M3 9h11M10 4.5 14.5 9 10 13.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Un titre de section.
 * Pas d'eyebrow au-dessus — le titre porte son propre poids.
 */
export function TitreSection({
  children,
  sous,
  lien,
}: {
  children: React.ReactNode
  sous?: React.ReactNode
  lien?: { href: string; libelle: string }
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-[1.75rem] md:text-[2rem]">{children}</h2>
        {sous ? <p className="mt-2 text-[1rem] text-encre-douce">{sous}</p> : null}
      </div>
      {lien ? (
        <Link
          href={lien.href}
          className="inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-magenta"
        >
          {lien.libelle}
          <Fleche />
        </Link>
      ) : null}
    </header>
  )
}

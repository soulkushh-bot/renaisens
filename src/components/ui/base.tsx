import Link from 'next/link'

/*
  Les primitives, en papier découpé.

  Un bouton n'est pas un rectangle arrondi teinté : c'est un morceau de papier coupé, avec son grain
  et son bord irrégulier. Un contrôle standard posé dans un monde engagé est un manquement.

  La couleur passe TOUJOURS par `--teinte`, jamais par une classe `bg-*` : `.couche` peint le fond à
  partir de cette variable, et une classe utilitaire de même spécificité perdrait ou gagnerait selon
  l'ordre de la feuille finale — c'est-à-dire au hasard.

  La règle d'action vient du standard de la catégorie, retenue parce qu'elle est juste :
  UNE SEULE COULEUR SATURÉE, ET SEULEMENT LÀ OÙ L'ON PEUT AGIR. Le corail est réservé à l'action.
*/

type Variante = 'action' | 'contour' | 'discret' | 'clair'

const TEINTES: Record<Variante, { teinte: string; texte: string; extra?: string }> = {
  action: { teinte: 'var(--color-corail)', texte: 'var(--color-papier-clair)' },
  contour: {
    teinte: 'transparent',
    texte: 'var(--color-indigo)',
    extra: 'ring-2 ring-inset ring-indigo',
  },
  discret: { teinte: 'transparent', texte: 'var(--color-indigo)', extra: 'underline' },
  clair: { teinte: 'var(--color-papier-clair)', texte: 'var(--color-indigo)' },
}

const BASE =
  'couche coupe inline-flex min-h-[3rem] items-center justify-center gap-2 px-6 py-3 font-display text-[1rem] font-bold uppercase tracking-[-0.01em] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-45'

function habits(variante: Variante) {
  const v = TEINTES[variante]
  return {
    className: `${BASE} ${v.extra ?? ''}`,
    style: { ['--teinte' as never]: v.teinte, color: v.texte },
  }
}

export function Bouton({
  variante = 'action',
  className = '',
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  const h = habits(variante)
  return <button {...props} className={`${h.className} ${className}`} style={{ ...h.style, ...style }} />
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
  const h = habits(variante)
  return (
    <Link href={href} className={`${h.className} ${className}`} style={h.style}>
      {children}
    </Link>
  )
}

/**
 * Un titre de section.
 * Pas d'eyebrow au-dessus — jamais, aucun brief ne le rachète. Le titre porte son propre poids.
 */
export function TitreSection({
  children,
  sous,
  niveau = 2,
}: {
  children: React.ReactNode
  sous?: React.ReactNode
  niveau?: 2 | 3
}) {
  const H = niveau === 2 ? 'h2' : 'h3'
  return (
    <header className="mb-5">
      <H className="decoupe font-display text-[1.6rem]">{children}</H>
      {sous ? <p className="mt-2 text-[0.98rem] text-encre/75">{sous}</p> : null}
    </header>
  )
}

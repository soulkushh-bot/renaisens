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
  action: { teinte: 'var(--color-corail)', texte: 'var(--color-encre)' },
  contour: {
    teinte: 'transparent',
    texte: 'var(--color-indigo)',
    extra: 'ring-2 ring-inset ring-indigo',
  },
  discret: { teinte: 'transparent', texte: 'var(--color-indigo)', extra: 'underline' },
  clair: { teinte: 'var(--color-papier-clair)', texte: 'var(--color-indigo)' },
}

const BASE =
  'couche coupe inline-flex min-h-[3rem] items-center justify-center gap-2 px-6 py-3 font-display text-[1rem] font-bold uppercase tracking-[-0.01em] transition-opacity hover:opacity-88 disabled:cursor-not-allowed'

/*
  L'état désactivé n'est PAS une opacité.
  Baisser l'opacité d'un bouton corail à texte d'encre donne du corail pâle sur du corail pâle :
  l'audit de contraste porte sur les paires de la palette, pas sur les états, et celui-ci passait
  entre les mailles. Un bouton désactivé est un papier kraft à encre douce — lisible, et visiblement
  inactif.
*/
const DESACTIVE = { teinte: 'var(--color-kraft)', texte: 'var(--color-encre-douce)' }

function habits(variante: Variante, desactive = false) {
  const v = desactive ? DESACTIVE : TEINTES[variante]
  return {
    className: `${BASE} ${desactive ? '' : (TEINTES[variante].extra ?? '')}`,
    style: { ['--teinte' as never]: v.teinte, color: v.texte },
  }
}

export function Bouton({
  variante = 'action',
  className = '',
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  const h = habits(variante, props.disabled === true)
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
      <H className="decoupe text-[1.6rem]">{children}</H>
      {sous ? <p className="mt-2 text-[0.98rem] text-encre-douce">{sous}</p> : null}
    </header>
  )
}

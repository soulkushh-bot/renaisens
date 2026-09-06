import Link from 'next/link'

/*
  Les primitives. Trois règles tenues partout :
  — aucune ombre, des aplats et des bordures d'encre ;
  — les libellés disent ce qui se passe (« Voir mon plan »), jamais « Continuer » ;
  — pas de « → » collé au libellé, pas de rayon identique sur tous les blocs.
*/

type Variante = 'principal' | 'second' | 'discret' | 'clair' | 'contourClair'

const STYLES: Record<Variante, string> = {
  principal: 'bg-cuve text-coton border-cuve hover:bg-air',
  second: 'bg-transparent text-encre border-encre hover:bg-encre hover:text-coton',
  discret: 'bg-transparent text-encre/70 border-transparent underline underline-offset-4 hover:text-encre',
  // Les deux variantes pour fond indigo. Elles existent pour ne PAS écraser une variante à coups
  // de classes utilitaires : l'ordre gagnant dans la feuille finale n'est pas celui de la chaîne.
  clair: 'bg-coton text-cuve border-coton hover:bg-pale',
  contourClair: 'bg-transparent text-coton border-coton hover:bg-coton hover:text-cuve',
}

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-[2px] border px-5 py-3 text-[0.98rem] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40'

export function Bouton({
  variante = 'principal',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return <button {...props} className={`${BASE} ${STYLES[variante]} ${className}`} />
}

export function LienBouton({
  href,
  variante = 'principal',
  className = '',
  children,
}: {
  href: string
  variante?: Variante
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={`${BASE} ${STYLES[variante]} ${className}`}>
      {children}
    </Link>
  )
}

/** Le bloc de contenu du produit : un aplat écru, un trait d'encre, pas de coin arrondi. */
export function Carte({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={`border border-encre/25 bg-coton p-4 ${className}`}>{children}</div>
}

export function Bande({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`bande-adire ${className}`} />
}

/** Le titre d'une section. Pas d'eyebrow en capitales espacées au-dessus — jamais. */
export function TitreSection({
  children,
  sous,
}: {
  children: React.ReactNode
  sous?: React.ReactNode
}) {
  return (
    <header className="mb-4">
      <h2 className="text-[1.35rem]">{children}</h2>
      {sous ? <p className="mt-1.5 text-[0.92rem] text-encre/70">{sous}</p> : null}
    </header>
  )
}

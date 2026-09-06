/**
 * Les primitives de papier.
 *
 * Tout ce qui a l'air posé sur la page est une feuille : une couleur pleine, un grain, un bord
 * coupé. Rien n'a d'ombre — ce qui est devant est ce qui recouvre.
 */

type Teinte =
  | 'papier'
  | 'papier-clair'
  | 'indigo'
  | 'corail'
  | 'souci'
  | 'feuille'
  | 'terre'
  | 'kraft'

const VARIABLE: Record<Teinte, string> = {
  papier: 'var(--color-papier)',
  'papier-clair': 'var(--color-papier-clair)',
  indigo: 'var(--color-indigo)',
  corail: 'var(--color-corail)',
  souci: 'var(--color-souci)',
  feuille: 'var(--color-feuille)',
  terre: 'var(--color-terre)',
  kraft: 'var(--color-kraft)',
}

/** Les teintes sur lesquelles le texte doit passer en papier clair. */
const SOMBRES: Teinte[] = ['indigo', 'corail', 'feuille', 'terre']

export function Couche({
  teinte = 'papier-clair',
  coupe = true,
  className = '',
  children,
  ...reste
}: {
  teinte?: Teinte
  coupe?: boolean
  className?: string
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const sombre = SOMBRES.includes(teinte)
  return (
    <div
      {...reste}
      className={`couche ${coupe ? 'coupe' : ''} ${sombre ? 'sur-fond-sombre' : ''} ${className}`}
      style={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--teinte' as any]: VARIABLE[teinte],
        color: sombre ? 'var(--color-papier-clair)' : 'var(--color-encre)',
        ...reste.style,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Le séparateur du produit : une bande de papier au bord cranté.
 * Remplace le filet pointillé, qui se lisait comme un artefact de rendu plutôt que comme une matière.
 */
export function BandeDecoupee({
  teinte = 'feuille',
  className = '',
}: {
  teinte?: Teinte
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`couche feston ${className}`}
      style={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ['--teinte' as any]: VARIABLE[teinte],
        height: '22px',
      }}
    />
  )
}

/** Une petite fleur découpée. Quatre pétales, un cœur — le motif de ponctuation du produit. */
export function PetiteFleur({
  taille = 16,
  className,
  petale = 'corail',
  coeur = 'souci',
}: {
  taille?: number
  className?: string
  petale?: Teinte
  coeur?: Teinte
}) {
  return (
    <svg viewBox="0 0 24 24" width={taille} height={taille} aria-hidden="true" className={className}>
      <circle cx="12" cy="5.5" r="5" fill={VARIABLE[petale]} />
      <circle cx="12" cy="18.5" r="5" fill={VARIABLE[petale]} />
      <circle cx="5.5" cy="12" r="5" fill={VARIABLE[petale]} />
      <circle cx="18.5" cy="12" r="5" fill={VARIABLE[petale]} />
      <circle cx="12" cy="12" r="4.2" fill={VARIABLE[coeur]} />
    </svg>
  )
}

/**
 * Une photographie glissée SOUS une découpe de papier.
 *
 * Le papier kraft dépasse tout autour : l'image n'est pas collée par-dessus, elle apparaît par
 * l'ouverture. C'est le seul traitement de photo que ce monde autorise — un masque géométrique
 * posé sur une image serait la version bon marché de l'effet.
 *
 * `legende` est obligatoire, et elle sert à autre chose qu'à décorer : sur ce produit, une photo
 * mal située peut se lire comme un témoignage. Elle doit dire ce que l'image est, et ce qu'elle
 * n'est pas.
 */
export function PhotoDecoupee({
  src,
  alt,
  legende,
  className = '',
}: {
  src: string
  alt: string
  legende: string
  className?: string
}) {
  return (
    <figure className={className}>
      <div
        className="couche coupe p-2.5"
        style={{ ['--teinte' as never]: VARIABLE.kraft }}
      >
        <div className="coupe overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="block w-full object-cover" loading="lazy" />
        </div>
      </div>
      <figcaption className="mt-3 text-[0.86rem] leading-relaxed text-encre-douce">
        {legende}
      </figcaption>
    </figure>
  )
}

/** Une feuille découpée, en deux moitiés reflétées comme le reste du monde. */
export function FeuilleDecoupee({
  taille = 18,
  className,
  teinte = 'feuille',
}: {
  taille?: number
  className?: string
  teinte?: Teinte
}) {
  return (
    <svg viewBox="0 0 24 24" width={taille} height={taille} aria-hidden="true" className={className}>
      <path d="M12 2 C18 7 20 15 12 22 C4 15 6 7 12 2 Z" fill={VARIABLE[teinte]} />
    </svg>
  )
}

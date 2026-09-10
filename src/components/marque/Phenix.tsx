/**
 * Le phénix arc-en-ciel — le symbole du produit, et son dispositif de progression.
 *
 * Redessiné en vectoriel d'après le logo fourni par l'utilisateur, qui en détient les droits.
 * Vectoriel plutôt que raster : net du favicon de 16 px à l'écran d'accueil, quelques kilo-octets,
 * et chaque plume peut porter sa couleur sans image à charger.
 *
 * `couches` va de 0 à 4 et vaut le nombre de rituels qu'elle a faits.
 * À zéro, l'oiseau est là en entier mais SANS COULEUR — la forme existe, la vie pas encore.
 * Chaque semaine tenue en colore une partie : le corps, puis les ailes hautes, puis les ailes
 * basses, puis la queue et l'œil. Au trentième jour, il est entier et en couleurs.
 *
 * C'est ce qui remplace la barre de pourcentage. Elle ne regarde pas une jauge se remplir, elle
 * regarde son phénix reprendre ses couleurs — et c'est elle qui les lui rend.
 *
 * Par défaut `couches` vaut 4 : le logo est toujours complet.
 *
 * `eclosion` est le seul moment de mouvement du produit. Posé à la clôture du rituel, il fait
 * APPARAÎTRE la part de couleur qu'elle vient de gagner, par-dessus sa jumelle grise. On ne fait
 * pas transiter un `fill` depuis une valeur qu'on ne connaît pas ; on superpose, et c'est la
 * couleur qui monte.
 */

const GRIS = '#ddd2cc'

/** Les plumes de l'aile haute, de la plus haute à la plus basse. */
const PLUMES_HAUTES = [
  { d: 'M96 78 C82 56 74 38 76 22 C86 34 96 52 100 70 Z', couleur: 'var(--color-rose)' },
  { d: 'M94 80 C74 62 58 46 52 30 C66 38 84 54 98 72 Z', couleur: '#b0459f' },
  { d: 'M92 84 C68 74 46 62 34 48 C50 52 74 64 96 78 Z', couleur: '#f0921f' },
  { d: 'M92 90 C66 86 40 80 24 70 C42 70 70 74 94 84 Z', couleur: '#f2c11c' },
]

/** Les plumes de l'aile basse. */
const PLUMES_BASSES = [
  { d: 'M92 96 C66 98 40 100 22 96 C40 90 70 88 94 92 Z', couleur: '#2f9e5f' },
  { d: 'M94 104 C72 110 48 118 32 122 C46 110 70 102 96 100 Z', couleur: '#1f8f6f' },
  { d: 'M96 110 C80 122 62 136 50 144 C58 128 76 114 98 106 Z', couleur: '#2e7fc4' },
]

/** La queue, en panaches qui retombent. */
const QUEUE = [
  { d: 'M104 150 C110 172 108 196 96 214 C92 194 94 170 100 150 Z', couleur: 'var(--color-magenta)' },
  { d: 'M110 152 C122 172 126 196 118 216 C110 198 106 174 106 154 Z', couleur: '#2e7fc4' },
  { d: 'M114 156 C130 170 140 190 138 208 C128 194 118 176 110 158 Z', couleur: '#f0921f' },
]

export function Phenix({
  taille = 64,
  couches = 4,
  className,
  avecNid = true,
  eclosion = false,
  titre,
}: {
  taille?: number
  couches?: number
  className?: string
  avecNid?: boolean
  eclosion?: boolean
  titre?: string
}) {
  const n = Math.min(Math.max(Math.trunc(couches), 0), 4)

  /*
    Un compteur de plumes neuves, pour décaler leur arrivée. Il est remis à zéro à chaque rendu :
    c'est une variable de construction du SVG, jamais un état.
  */
  let rang = 0

  /**
   * Une forme du phénix, à son état juste.
   * Grise tant que la semaine n'est pas tenue ; en couleur ensuite ; et, le soir du rituel, la
   * part tout juste gagnée arrive par-dessus sa jumelle grise.
   */
  const forme = (cle: string, d: string, couleur: string, seuil: number) => {
    if (n < seuil) return <path key={cle} d={d} fill={GRIS} />
    if (!eclosion || seuil !== n) return <path key={cle} d={d} fill={couleur} />
    const retard = 260 + rang++ * 85
    return [
      <path key={`${cle}-gris`} d={d} fill={GRIS} />,
      <path
        key={cle}
        d={d}
        fill={couleur}
        className="plume-neuve"
        style={{ animationDelay: `${retard}ms` }}
      />,
    ]
  }

  const etiquette =
    titre ??
    (n >= 4
      ? 'Le phénix, entier et en couleurs.'
      : n === 0
        ? 'Le phénix, encore sans couleur : ta première semaine lui en rendra.'
        : `Le phénix, ${n} semaine${n > 1 ? 's' : ''} de couleurs sur quatre.`)

  return (
    <svg
      viewBox="0 0 240 240"
      width={taille}
      height={taille}
      role="img"
      aria-label={etiquette}
      className={className}
    >
      {avecNid ? (
        <>
          {/* Les deux feuilles, et le nid posé dessus. */}
          {forme('f1', 'M118 214 C88 214 58 200 40 176 C66 172 96 182 116 202 Z', '#3f9e4d', 1)}
          {forme('f2', 'M122 214 C152 214 182 200 200 176 C174 172 144 182 124 202 Z', '#3f9e4d', 1)}
          {forme('nid', 'M74 206 L166 206 L154 226 L86 226 Z', '#9a5c2a', 1)}
        </>
      ) : null}

      {/* La queue passe derrière le corps. */}
      {QUEUE.map((p, i) => forme(`q${i}`, p.d, p.couleur, 4))}

      {/* Les ailes, dessinées une fois et reflétées : l'oiseau est symétrique. */}
      {[1, -1].map((sens) => (
        <g key={sens} transform={sens === -1 ? 'matrix(-1 0 0 1 240 0)' : undefined}>
          {PLUMES_HAUTES.map((p, i) => forme(`h${i}`, p.d, p.couleur, 2))}
          {PLUMES_BASSES.map((p, i) => forme(`b${i}`, p.d, p.couleur, 3))}
        </g>
      ))}

      {/* Le corps, du magenta vers le violet. */}
      {forme(
        'corps',
        'M120 46 C136 62 142 92 138 124 C134 152 126 172 120 184 C114 172 106 152 102 124 C98 92 104 62 120 46 Z',
        'var(--color-magenta)',
        1,
      )}
      {forme('ombre', 'M120 96 C128 116 130 148 126 176 C122 162 116 132 114 106 Z', '#8b45c4', 1)}

      {/* La tête, le bec, l'œil, la huppe. */}
      {forme('tete', 'M100 52 A20 20 0 1 1 140 52 A20 20 0 1 1 100 52 Z', 'var(--color-magenta)', 1)}
      {forme('bec', 'M100 50 L78 58 L100 66 Z', '#f2a41c', 1)}
      {/*
        L'œil n'est jamais absent : un œil manquant se lit comme un rendu inachevé, pas comme une
        attente. Avant la quatrième semaine il est simplement clair, comme tout ce qui n'a pas
        encore repris sa couleur.
      */}
      <circle cx="126" cy="47" r="4.2" fill={n >= 4 ? '#23232a' : '#b3a49d'} />
      {forme('huppe', 'M126 30 C134 24 140 26 142 32 C136 32 130 34 126 38 Z', 'var(--color-rose)', 4)}
    </svg>
  )
}

/** Le logo : le phénix et le nom, côte à côte. Toujours en couleurs. */
export function Logo({ taille = 44, className = '' }: { taille?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Phenix taille={taille} />
      <span className="font-display text-[1.25rem] font-bold leading-none tracking-[-0.02em] text-foret">
        RenaiSens
      </span>
    </span>
  )
}

/**
 * Le compte des semaines, écrit et compté en pastilles.
 * La couleur ne porte jamais l'information seule : il y a un chiffre, des formes, et une phrase.
 */
export function CompteSemaines({
  couches,
  clair = false,
}: {
  couches: number
  clair?: boolean
}) {
  const n = Math.min(Math.max(Math.trunc(couches), 0), 4)
  const phrase =
    n === 0
      ? 'Ton phénix n’a pas encore ses couleurs. La première semaine lui en rend.'
      : n >= 4
        ? 'Quatre semaines. Ton phénix a toutes ses couleurs — tu les lui as rendues.'
        : `${n === 1 ? 'Une semaine tenue' : `${n} semaines tenues`}. Il en reste ${4 - n}.`

  return (
    <div className="flex items-start gap-3">
      <div className="mt-1.5 flex shrink-0 gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="block h-3 w-3 rounded-full border-2"
            style={{
              borderColor: clair ? '#ffffff' : 'var(--color-magenta)',
              background: i < n ? (clair ? '#ffffff' : 'var(--color-magenta)') : 'transparent',
            }}
          />
        ))}
      </div>
      <p className={`text-[0.92rem] ${clair ? 'text-white' : 'text-encre-douce'}`}>{phrase}</p>
    </div>
  )
}

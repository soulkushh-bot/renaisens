/**
 * La rosace-phénix — l'objet que le produit lui fait fabriquer.
 *
 * Découpée dans une feuille pliée : chaque forme est dessinée une seule fois, puis reflétée. C'est
 * ainsi qu'on découpe vraiment une rosace, et ça divise par deux le tracé.
 *
 * `couches` va de 0 à 4 et vaut le nombre de rituels qu'elle a faits. À zéro, il n'y a que le socle
 * et la silhouette nue — un papier prêt à recevoir. À quatre, l'oiseau est entier.
 *
 * LA PROFONDEUR NE VIENT QUE DU RECOUVREMENT : aucune ombre, aucun dégradé, aucun flou. Une couche
 * paraît devant une autre parce qu'elle la recouvre réellement.
 *
 * C'est ce qui remplace l'ancienne barre de progression et l'ancienne carte qui « fonçait » : elle
 * ne regarde pas un pourcentage monter, elle regarde un objet se faire.
 */

const FESTONS = Array.from({ length: 26 }, (_, i) => {
  const angle = (i / 26) * Math.PI * 2
  return {
    x: Number((100 + Math.cos(angle) * 84).toFixed(2)),
    y: Number((100 + Math.sin(angle) * 84).toFixed(2)),
  }
})

/** Une demi-forme et son reflet. C'est le pli de la feuille. */
function Pliee({ d, fill }: { d: string; fill: string }) {
  return (
    <>
      <path d={d} fill={fill} />
      <path d={d} fill={fill} transform="matrix(-1 0 0 1 200 0)" />
    </>
  )
}

export function RosacePhenix({
  couches = 0,
  taille = 200,
  className,
  titre,
}: {
  couches?: number
  taille?: number
  className?: string
  titre?: string
}) {
  const n = Math.min(Math.max(Math.trunc(couches), 0), 4)
  const etiquette =
    titre ??
    (n === 0
      ? 'Rosace de papier, encore nue : aucune couche collée.'
      : `Rosace de papier, ${n} couche${n > 1 ? 's' : ''} collée${n > 1 ? 's' : ''} sur quatre.`)

  return (
    <svg
      viewBox="0 0 200 200"
      width={taille}
      height={taille}
      role="img"
      aria-label={etiquette}
      className={className}
    >
      {/* — Le socle : toujours là, même à zéro semaine — */}
      {FESTONS.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="14" fill="var(--color-indigo)" />
      ))}
      <circle cx="100" cy="100" r="86" fill="var(--color-indigo)" />
      <circle cx="100" cy="100" r="66" fill="var(--color-papier-clair)" />

      {/*
        La découpe nue : l'oiseau ENTIER, dans un papier non peint.
        Montrer seulement le corps et les ailes donnait une forme vague qu'on ne reconnaissait pas.
        Elle doit voir dès l'accueil ce qu'elle va fabriquer, pas une tache.
      */}
      {n === 0 && (
        <g fill="var(--color-papier)">
          <Pliee d="M100 82 C76 76 52 66 38 60 C44 86 64 108 100 114 Z" fill="var(--color-papier)" />
          <Pliee d="M100 104 C82 104 62 110 50 120 C64 132 84 136 100 130 Z" fill="var(--color-papier)" />
          <Pliee d="M100 140 C96 156 88 172 74 180 C74 162 82 146 100 136 Z" fill="var(--color-papier)" />
          <Pliee d="M100 46 C118 62 126 96 118 132 C112 152 104 162 100 166 Z" fill="var(--color-papier)" />
          <Pliee d="M100 22 C106 28 108 38 104 46 L100 48 Z" fill="var(--color-papier)" />
          <circle cx="100" cy="58" r="17" fill="var(--color-papier)" />
        </g>
      )}

      {/* — Couche 1 : le corps — */}
      {n >= 1 && (
        <Pliee d="M100 46 C118 62 126 96 118 132 C112 152 104 162 100 166 Z" fill="var(--color-corail)" />
      )}

      {/* — Couche 2 : les ailes, qui se lèvent — */}
      {n >= 2 && (
        <>
          <Pliee d="M100 82 C76 76 52 66 38 60 C44 86 64 108 100 114 Z" fill="var(--color-feuille)" />
          <Pliee d="M100 104 C82 104 62 110 50 120 C64 132 84 136 100 130 Z" fill="var(--color-feuille)" />
        </>
      )}

      {/* — Couche 3 : la queue, en éventail — */}
      {n >= 3 && (
        <>
          <Pliee d="M100 140 C96 156 88 172 74 180 C74 162 82 146 100 136 Z" fill="var(--color-souci)" />
          <Pliee d="M100 146 C100 162 98 176 94 184 L100 186 Z" fill="var(--color-souci)" />
        </>
      )}

      {/* — Couche 4 : la tête, la crête, et l'œil — */}
      {n >= 4 && (
        <>
          <Pliee d="M100 22 C106 28 108 38 104 46 L100 48 Z" fill="var(--color-terre)" />
          <circle cx="100" cy="58" r="17" fill="var(--color-terre)" />
          <circle cx="93" cy="55" r="3.4" fill="var(--color-papier-clair)" />
          <circle cx="107" cy="55" r="3.4" fill="var(--color-papier-clair)" />
          <Pliee d="M100 74 C108 78 112 86 110 94 L100 92 Z" fill="var(--color-souci)" />
        </>
      )}
    </svg>
  )
}

/**
 * Le compte des couches, écrit et compté en carrés de papier.
 * La couleur ne porte jamais l'information seule : il y a un chiffre, des carrés, et une phrase.
 */
export function CompteCouches({ couches }: { couches: number }) {
  const n = Math.min(Math.max(Math.trunc(couches), 0), 4)
  const phrase =
    n === 0
      ? 'Ta rosace est encore nue. La première couche se colle à ton premier rituel.'
      : n >= 4
        ? 'Quatre couches. Ta rosace est entière — tu l’as faite en trente jours.'
        : `${n === 1 ? 'Une couche collée' : `${n} couches collées`}. Il en reste ${4 - n}.`

  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex shrink-0 gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="block h-3.5 w-3.5"
            style={{
              background: i < n ? 'currentColor' : 'transparent',
              border: '2px solid currentColor',
            }}
          />
        ))}
      </div>
      <p className="text-[0.86rem] opacity-85">{phrase}</p>
    </div>
  )
}

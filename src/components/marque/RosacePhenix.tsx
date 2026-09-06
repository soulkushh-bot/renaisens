/**
 * La rosace-phénix — l'objet que le produit lui fait fabriquer.
 *
 * Découpée dans une feuille pliée : chaque forme est dessinée une seule fois, puis reflétée. C'est
 * ainsi qu'on découpe vraiment une rosace, et ça divise par deux le tracé.
 *
 * LA PROFONDEUR NE VIENT QUE DU RECOUVREMENT. Concrètement, ici :
 *
 *  — la feuille de base en papier kraft porte l'oiseau ENTIER, dès la première seconde ;
 *  — chaque couche de couleur est posée PAR-DESSUS, un peu plus petite, si bien que le kraft dépasse
 *    tout autour : c'est ce liseré qui fait voir qu'il y a plusieurs épaisseurs ;
 *  — les ailes recouvrent le corps, la queue recouvre le bas du corps, la crête recouvre la tête.
 *
 * Aucune ombre, aucun dégradé, aucun contour tracé. Une première version dessinait l'oiseau au trait
 * fin : c'était un diagramme vectoriel, exactement la froideur qu'on cherchait à éviter.
 *
 * `couches` va de 0 à 4 et vaut le nombre de rituels faits. À zéro, la découpe kraft attend d'être
 * peinte. À quatre, l'oiseau est entier.
 */

const FESTONS = Array.from({ length: 26 }, (_, i) => {
  const angle = (i / 26) * Math.PI * 2
  return {
    x: Number((100 + Math.cos(angle) * 84).toFixed(2)),
    y: Number((100 + Math.sin(angle) * 84).toFixed(2)),
  }
})

/*
  Les formes de l'oiseau, en demi-tracés. Le pli de la feuille fait le reste.

  Les bords des ailes et de la queue sont CRANTÉS, pas lisses : une aile en lobe lisse se lit comme
  une feuille d'arbre, et une première version de cette rosace ressemblait à du végétal plutôt qu'à
  un oiseau. Le cou étroit, la tête ronde et le bec triangulaire finissent de lever le doute.

  Tout tient dans le disque intérieur (rayon 66 depuis le centre) : rien ne déborde sur le feston.
*/
const CORPS = 'M100 64 C114 82 120 110 114 132 C110 145 104 152 100 156 Z'
const AILE = 'M100 86 C80 79 58 68 42 62 L51 78 L38 83 L57 98 L48 106 L71 110 L100 112 Z'
const QUEUE = 'M100 138 L93 158 L85 150 L80 164 L70 155 L100 147 Z'
const CRETE = 'M100 26 L109 39 L100 44 Z'
const BEC = 'M100 52 L105 63 L100 65 Z'

/** Une demi-forme et son reflet. C'est le pli de la feuille. */
function Pliee({ d, fill }: { d: string; fill: string }) {
  return (
    <>
      <path d={d} fill={fill} />
      <path d={d} fill={fill} transform="matrix(-1 0 0 1 200 0)" />
    </>
  )
}

/** L'oiseau entier dans une seule couleur. Sert de feuille de base en kraft. */
function OiseauPlein({ fill }: { fill: string }) {
  return (
    <>
      <Pliee d={AILE} fill={fill} />
      <Pliee d={QUEUE} fill={fill} />
      <Pliee d={CORPS} fill={fill} />
      <Pliee d={CRETE} fill={fill} />
      <circle cx="100" cy="50" r="13" fill={fill} />
      <rect x="94" y="56" width="12" height="14" fill={fill} />
      <Pliee d={BEC} fill={fill} />
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
      ? 'Rosace de papier : la découpe est faite, aucune couleur n’est encore posée.'
      : `Rosace de papier, ${n} couche${n > 1 ? 's' : ''} de couleur collée${n > 1 ? 's' : ''} sur quatre.`)

  return (
    <svg
      viewBox="0 0 200 200"
      width={taille}
      height={taille}
      role="img"
      aria-label={etiquette}
      className={className}
    >
      {/* — Le socle festonné, toujours là — */}
      {FESTONS.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="14" fill="var(--color-indigo)" />
      ))}
      <circle cx="100" cy="100" r="86" fill="var(--color-indigo)" />
      <circle cx="100" cy="100" r="66" fill="var(--color-papier-clair)" />

      {/*
        La feuille de base en kraft, légèrement agrandie : c'est elle qui dépasse autour de chaque
        couche de couleur et qui rend les épaisseurs visibles.
      */}
      <g transform="translate(100 100) scale(1.06) translate(-100 -100)">
        <OiseauPlein fill="var(--color-kraft)" />
      </g>

      {/* — Couche 1 : le corps, le cou et la tête, posés sur le kraft — */}
      {n >= 1 && (
        <>
          <Pliee d={CORPS} fill="var(--color-corail)" />
          <rect x="94" y="56" width="12" height="14" fill="var(--color-corail)" />
          <circle cx="100" cy="50" r="13" fill="var(--color-corail)" />
        </>
      )}

      {/* — Couche 2 : les ailes, qui recouvrent le corps — */}
      {n >= 2 && <Pliee d={AILE} fill="var(--color-feuille)" />}

      {/* — Couche 3 : la queue, qui recouvre le bas du corps — */}
      {n >= 3 && <Pliee d={QUEUE} fill="var(--color-souci)" />}

      {/* — Couche 4 : la crête, le bec et l'œil, qui recouvrent la tête — */}
      {n >= 4 && (
        <>
          <Pliee d={CRETE} fill="var(--color-terre)" />
          <Pliee d={BEC} fill="var(--color-souci)" />
          <circle cx="94" cy="47" r="2.8" fill="var(--color-papier-clair)" />
          <circle cx="106" cy="47" r="2.8" fill="var(--color-papier-clair)" />
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
      ? 'Ta découpe est faite. La première couleur se colle à ton premier rituel.'
      : n >= 4
        ? 'Quatre couches. Ta rosace est entière — tu l’as faite en trente jours.'
        : `${n === 1 ? 'Une couche collée' : `${n} couches collées`}. Il en reste ${4 - n}.`

  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex shrink-0 gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="coupe block h-4 w-4"
            style={{
              background: i < n ? 'currentColor' : 'transparent',
              border: '2px solid currentColor',
            }}
          />
        ))}
      </div>
      <p className="text-[0.9rem]">{phrase}</p>
    </div>
  )
}

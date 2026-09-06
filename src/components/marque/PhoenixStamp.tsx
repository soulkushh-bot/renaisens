/**
 * Le phénix, en motif de réserve à la teinture.
 *
 * Volontairement PAS un oiseau en flammes sur dégradé orange — c'est le rendu attendu, et il
 * ressemblerait à mille autres. Ici il est dessiné comme un tampon adire : symétrique, géométrique,
 * arêtes droites, aucune courbe. Les « trous » sont la couleur du support, comme la cire de réserve
 * qui empêche l'indigo de prendre.
 *
 * Vectoriel : quelques centaines d'octets, net à tout DPI, aucune image à télécharger sur un réseau
 * instable. Sur un Android d'entrée de gamme, c'est ce qui fait la différence.
 */
export function PhoenixStamp({
  taille = 64,
  className,
  couleurReserve = 'var(--color-coton)',
}: {
  taille?: number
  className?: string
  couleurReserve?: string
}) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Phénix, motif au tampon"
      className={className}
      fill="currentColor"
    >
      {/* crête et tête */}
      <polygon points="32,0 29,7 35,7" />
      <polygon points="32,7 27,16 37,16" />
      <rect x="30" y="16" width="4" height="5" />
      {/* corps, losange plein */}
      <polygon points="32,20 42,35 32,50 22,35" />
      {/* ailes : deux chevrons par côté, qui montent — un phénix se relève */}
      <polygon points="22,23 2,5 8,19 22,29" />
      <polygon points="22,31 5,24 14,32 22,37" />
      <polygon points="42,23 62,5 56,19 42,29" />
      <polygon points="42,31 59,24 50,32 42,37" />
      {/* queue : trois lames en éventail */}
      <polygon points="29,50 20,64 27,54" />
      <polygon points="30,50 34,50 35,64 29,64" />
      <polygon points="35,50 44,64 37,54" />
      {/* réserves : ce que la teinture n'a pas pris */}
      <g fill={couleurReserve}>
        <rect x="26" y="28" width="3" height="3" />
        <rect x="35" y="28" width="3" height="3" />
        <rect x="30" y="37" width="4" height="4" />
      </g>
    </svg>
  )
}

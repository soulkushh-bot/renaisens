/**
 * Le fond imprimé au tampon.
 *
 * Sert aussi de dispositif de progression : `densite` monte de 0 à 4 au fil des semaines tenues.
 * La couleur n'est jamais seule à porter l'information — à chaque cran, il y a *plus de matière*,
 * pas seulement une teinte plus foncée. C'est la règle d'accessibilité, et c'est aussi ce qui rend
 * la progression lisible sur un écran bon marché en plein jour.
 */
export function MotifAdire({
  densite = 0,
  className,
  id = 'adire',
}: {
  densite?: number
  className?: string
  id?: string
}) {
  const d = Math.min(Math.max(Math.trunc(densite), 0), 4)

  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={`${id}-tuile`} width="40" height="40" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            {/* niveau 0 : la trame de base, toujours présente */}
            <rect x="19" y="19" width="2" height="2" />

            {d >= 1 && (
              <>
                <rect x="4" y="4" width="3" height="3" />
                <rect x="33" y="33" width="3" height="3" />
              </>
            )}

            {d >= 2 && (
              <>
                <rect x="18" y="4" width="4" height="1" />
                <rect x="19.5" y="2.5" width="1" height="4" />
                <rect x="18" y="35" width="4" height="1" />
                <rect x="19.5" y="33.5" width="1" height="4" />
              </>
            )}

            {d >= 3 && (
              <>
                <rect x="2" y="18" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1" />
                <rect x="33" y="18" width="5" height="5" fill="none" stroke="currentColor" strokeWidth="1" />
              </>
            )}

            {d >= 4 && (
              <>
                <rect x="10" y="10" width="2" height="2" />
                <rect x="28" y="10" width="2" height="2" />
                <rect x="10" y="28" width="2" height="2" />
                <rect x="28" y="28" width="2" height="2" />
                <rect x="14" y="19.5" width="12" height="1" />
              </>
            )}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-tuile)`} />
    </svg>
  )
}

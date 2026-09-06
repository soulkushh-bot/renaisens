import { MotifAdire } from './MotifAdire'
import { PhoenixStamp } from './PhoenixStamp'

/**
 * Sa carte de profil — et le dispositif de progression du produit.
 *
 * Pas de barre de pourcentage. Chaque semaine tenue fait repasser la carte dans la cuve : la teinte
 * fonce d'un cran et la densité du motif de réserve augmente. Au jour 30, elle a un objet visuel qui
 * n'existait pas au jour 1, et qui n'appartient qu'à elle.
 *
 * La teinte ne porte jamais l'information seule : le nombre de passages est aussi écrit, et compté
 * en carrés pleins. Sur un écran bon marché en plein jour, la couleur ne suffit pas.
 */

const TEINTES = [
  { fond: 'var(--color-pale)', texte: 'var(--color-encre)', motif: 'var(--color-cuve)' },
  { fond: '#7C93C9', texte: 'var(--color-encre)', motif: 'var(--color-cuve)' },
  { fond: 'var(--color-air)', texte: 'var(--color-coton)', motif: 'var(--color-cuve)' },
  { fond: '#22356B', texte: 'var(--color-coton)', motif: 'var(--color-pale)' },
  { fond: 'var(--color-cuve)', texte: 'var(--color-coton)', motif: 'var(--color-air)' },
] as const

/**
 * Ce que compte la teinte : les fois où elle est REVENUE faire son rituel. Pas les actions cochées.
 *
 * C'est un choix, et il est défendable : revenir est la seule chose que le produit lui demande, et
 * une semaine où elle n'a rien fait mais où elle est revenue vaut mieux qu'une semaine où elle a
 * disparu. La légende le dit en clair — sinon la carte se lirait comme un compliment qu'elle n'a pas
 * mérité, et un faux compliment coûte plus cher que pas de compliment du tout.
 */
function legende(n: number): string {
  if (n === 0) return 'Coton écru. La couleur prendra à ton premier rituel.'
  if (n === 1) return 'Un passage en cuve. Tu es revenue une fois.'
  if (n >= 4) return 'Quatre passages. C’est la teinte des trente jours.'
  return `${n === 2 ? 'Deux' : 'Trois'} passages en cuve. Tu reviens.`
}

export function CarteTeinte({
  titre,
  vision,
  semainesTenues,
  children,
}: {
  titre: string
  vision?: string
  semainesTenues: number
  children?: React.ReactNode
}) {
  const n = Math.min(Math.max(Math.trunc(semainesTenues), 0), 4)
  const teinte = TEINTES[n]!

  return (
    <section
      className="sur-fond-sombre relative overflow-hidden border border-encre"
      style={{ background: teinte.fond, color: teinte.texte }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{ color: teinte.motif }}
      >
        <MotifAdire densite={n} id={`carte-${n}`} />
      </div>

      <div className="relative px-5 pt-6 pb-5">
        <PhoenixStamp taille={52} couleurReserve={teinte.fond} />

        <h2 className="mt-4 text-[1.55rem]">{titre}</h2>

        {vision ? <p className="mt-3 text-[0.98rem] opacity-90">{vision}</p> : null}

        {children}

        <div className="mt-6 flex items-center gap-3 border-t border-current/25 pt-4">
          <div className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="block h-3 w-3 border border-current"
                style={{ background: i < n ? 'currentColor' : 'transparent' }}
              />
            ))}
          </div>
          <p className="text-[0.82rem] opacity-90">{legende(n)}</p>
        </div>
      </div>
    </section>
  )
}

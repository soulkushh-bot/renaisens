import type { Metadata } from 'next'
import Link from 'next/link'
import { Carte } from '@/components/ui/base'
import { AVERTISSEMENT_RECITS, RECITS } from '@/content/stories'
import { NOM_DIMENSION } from '@/types'

export const metadata: Metadata = {
  title: 'Récits — RenaiSens',
  description:
    'Onze parcours de transition, écrits pour montrer comment ça se passe vraiment. Illustratifs, et signalés comme tels.',
}

/**
 * Les Récits remplacent le fil communautaire ouvert.
 *
 * Aucune photographie n'est attachée à un récit : ils sont fictifs, et un visage réel à côté d'une
 * histoire inventée la transformerait en faux témoignage.
 */
export default function PageRecits() {
  return (
    <main className="colonne-large pb-10 pt-10">
      <h1 className="text-[2.2rem]">Récits</h1>
      <p className="mt-4 max-w-[62ch] text-[1.08rem] text-encre-douce">
        Onze transitions, racontées avec ce qui a coincé et ce qui n’est toujours pas réglé. Une
        histoire sans reste n’est pas une histoire à laquelle on croit.
      </p>

      <div className="mt-6 rounded-[0.9rem] p-4" style={{ background: 'var(--color-tuile-peche)' }}>
        <p className="text-[0.94rem] text-encre">{AVERTISSEMENT_RECITS}</p>
      </div>

      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {RECITS.map((r) => (
          <li key={r.slug}>
            <Link href={`/recits/${r.slug}`} className="block h-full">
              <Carte className="h-full p-6">
                <h2 className="text-[1.2rem]">
                  {r.prenom}, {r.age} ans
                </h2>
                <p className="mt-1 text-[0.9rem] font-semibold text-magenta">{r.ville}</p>
                <p className="mt-3 text-[0.98rem] text-encre-douce">{r.accroche}</p>
                <p className="mt-4 text-[0.84rem] text-encre-douce">
                  {NOM_DIMENSION[r.dimension]} · {r.duree}
                </p>
              </Carte>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

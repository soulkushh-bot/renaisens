import type { Metadata } from 'next'
import Link from 'next/link'
import { BandeDecoupee, Couche } from '@/components/marque/Papier'
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
 * Aucun portrait n'est attaché à un récit : ils sont fictifs, et un visage réel à côté d'une
 * histoire inventée la transformerait en faux témoignage.
 */
export default function PageRecits() {
  const teintes = ['papier-clair', 'souci', 'papier-clair'] as const

  return (
    <main className="pb-6">
      <div className="colonne pt-9">
        <h1 className="decoupe uppercase text-[2.3rem]">Récits</h1>
        <p className="mt-4 text-[1.08rem] leading-relaxed text-encre/85">
          Onze transitions, racontées avec ce qui a coincé et ce qui n’est toujours pas réglé. Une
          histoire sans reste n’est pas une histoire à laquelle on croit.
        </p>

        <Couche teinte="papier-clair" className="mt-6 p-4">
          <p className="text-[0.92rem] leading-relaxed text-encre/75">{AVERTISSEMENT_RECITS}</p>
        </Couche>
      </div>

      <BandeDecoupee teinte="corail" className="mt-12" />

      <div className="colonne mt-9">
        <ul className="flex flex-col gap-3">
          {RECITS.map((r, i) => (
            <li key={r.slug}>
              <Link href={`/recits/${r.slug}`} className="block">
                <Couche teinte={teintes[i % 3]} className="p-5">
                  <p className="decoupe text-[1.2rem]">
                    {r.prenom}, {r.age} ans, {r.ville}
                  </p>
                  <p className="mt-2.5 text-[1rem] leading-relaxed text-encre/80">{r.accroche}</p>
                  <p className="mt-4 font-display text-[0.78rem] font-bold uppercase text-encre/55">
                    {NOM_DIMENSION[r.dimension]} · {r.duree}
                  </p>
                </Couche>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

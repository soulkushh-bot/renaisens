import type { Metadata } from 'next'
import Link from 'next/link'
import { Bande } from '@/components/ui/base'
import { AVERTISSEMENT_RECITS, RECITS } from '@/content/stories'
import { NOM_DIMENSION } from '@/types'

export const metadata: Metadata = {
  title: 'Récits — RENaiSENS',
  description:
    'Onze parcours de transition, écrits pour montrer comment ça se passe vraiment. Illustratifs, et signalés comme tels.',
}

/**
 * Les Récits remplacent le fil communautaire ouvert.
 *
 * Une communauté vide dessert le produit, et un fil où des femmes exposent leurs finances et leur
 * vie familiale demande une modération qu'on n'a pas au premier jour. Les Récits donnent la même
 * chose — se reconnaître dans quelqu'un — sans exposer personne.
 */
export default function PageRecits() {
  return (
    <main className="colonne pb-16 pt-8">
      <h1 className="text-[1.7rem]">Récits</h1>
      <p className="mt-3 text-[1rem] text-encre/80">
        Onze transitions, racontées avec ce qui a coincé et ce qui n’est toujours pas réglé. Une
        histoire sans reste n’est pas une histoire à laquelle on croit.
      </p>

      <p className="mt-5 border border-encre/25 p-3 text-[0.88rem] text-encre/70">
        {AVERTISSEMENT_RECITS}
      </p>

      <Bande className="mt-8" />

      <ul className="mt-6 flex flex-col gap-3">
        {RECITS.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/recits/${r.slug}`}
              className="block border border-encre/25 p-4 transition-colors hover:border-encre"
            >
              <p className="font-display text-[1.1rem]">
                {r.prenom}, {r.age} ans, {r.ville}
              </p>
              <p className="mt-1.5 text-[0.95rem] text-encre/75">{r.accroche}</p>
              <p className="mt-3 text-[0.8rem] text-encre/50">
                {NOM_DIMENSION[r.dimension]} · {r.duree}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

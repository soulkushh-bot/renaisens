import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BandeDecoupee, Couche } from '@/components/marque/Papier'
import { RosacePhenix } from '@/components/marque/RosacePhenix'
import { actionOptionnelle } from '@/content/actions'
import { AVERTISSEMENT_RECITS, RECITS, recit } from '@/content/stories'
import { NOM_DIMENSION } from '@/types'

export function generateStaticParams() {
  return RECITS.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const r = recit(slug)
  if (!r) return { title: 'Récit introuvable — RenaiSens' }
  return {
    title: `${r.prenom}, ${r.age} ans — RenaiSens`,
    description: `${r.accroche} Parcours illustratif.`,
  }
}

export default async function PageRecit({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const r = recit(slug)
  if (!r) notFound()

  const premiere = actionOptionnelle(r.premiereAction)

  return (
    <main className="pb-6">
      <div className="colonne pt-9">
        <Link
          href="/recits"
          className="font-display text-[0.88rem] font-bold uppercase text-indigo underline"
        >
          Tous les récits
        </Link>

        <div className="mt-7 flex items-start justify-between gap-5">
          <div>
            <h1 className="decoupe chiffres text-[2.2rem]">
              {r.prenom}, {r.age} ans
            </h1>
            <p className="mt-2 font-display text-[0.85rem] font-bold uppercase text-encre/60">
              {r.ville} · {NOM_DIMENSION[r.dimension]} · {r.duree}
            </p>
          </div>
          <RosacePhenix couches={4} taille={72} className="mt-1 shrink-0" />
        </div>

        <p className="decoupe mt-7 text-[1.45rem] leading-[1.15] text-corail">{r.accroche}</p>
      </div>

      <BandeDecoupee teinte="feuille" className="mt-11" />

      <article className="colonne mt-9 flex flex-col gap-9">
        <section>
          <h2 className="decoupe uppercase text-[1.25rem] text-encre/60">Avant</h2>
          <p className="mt-3 text-[1.06rem] leading-relaxed">{r.avant}</p>
        </section>

        <section>
          <h2 className="decoupe uppercase text-[1.25rem] text-encre/60">Ce qui a basculé</h2>
          <p className="mt-3 text-[1.06rem] leading-relaxed">{r.bascule}</p>
        </section>

        <section>
          <h2 className="decoupe uppercase text-[1.25rem] text-encre/60">Aujourd’hui</h2>
          <p className="mt-3 text-[1.06rem] leading-relaxed">{r.apres}</p>
        </section>
      </article>

      {premiere ? (
        <div className="colonne mt-10">
          <Couche teinte="souci" className="p-6">
            <h2 className="decoupe uppercase text-[1.3rem] text-encre">Ce qu’elle a fait en premier</h2>
            <p className="mt-3 text-[1.06rem] leading-relaxed text-encre">{premiere.titre}</p>
            <p className="mt-3 text-[0.96rem] leading-relaxed text-encre/75">{premiere.pourquoi}</p>
          </Couche>
        </div>
      ) : null}

      <div className="colonne mt-6">
        <Couche teinte="papier-clair" className="p-6">
          <h2 className="decoupe uppercase text-[1.3rem]">Ce qui n’est pas réglé</h2>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-encre/85">{r.reste}</p>
        </Couche>
      </div>

      <p className="colonne mt-12 text-[0.88rem] leading-relaxed text-encre/60">
        {AVERTISSEMENT_RECITS}
      </p>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Bande } from '@/components/ui/base'
import { PhoenixStamp } from '@/components/marque/PhoenixStamp'
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
  if (!r) return { title: 'Récit introuvable — RENaiSENS' }
  return {
    title: `${r.prenom}, ${r.age} ans — RENaiSENS`,
    description: `${r.accroche} Parcours illustratif.`,
  }
}

export default async function PageRecit({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const r = recit(slug)
  if (!r) notFound()

  const premiere = actionOptionnelle(r.premiereAction)

  return (
    <main className="colonne pb-16 pt-8">
      <Link href="/recits" className="text-[0.88rem] underline underline-offset-4">
        Tous les récits
      </Link>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.8rem]">
            {r.prenom}, {r.age} ans
          </h1>
          <p className="mt-1 text-[0.9rem] text-encre/60">
            {r.ville} · {NOM_DIMENSION[r.dimension]} · {r.duree}
          </p>
        </div>
        <PhoenixStamp taille={44} className="mt-1 shrink-0 text-pale" />
      </div>

      <p className="mt-5 font-display text-[1.25rem] leading-snug">{r.accroche}</p>

      <Bande className="mt-8" />

      <article className="mt-7 flex flex-col gap-7">
        <section>
          <h2 className="text-[1.1rem] text-encre/60">Avant</h2>
          <p className="mt-2 text-[1rem] leading-relaxed">{r.avant}</p>
        </section>

        <section>
          <h2 className="text-[1.1rem] text-encre/60">Ce qui a basculé</h2>
          <p className="mt-2 text-[1rem] leading-relaxed">{r.bascule}</p>
        </section>

        <section>
          <h2 className="text-[1.1rem] text-encre/60">Aujourd’hui</h2>
          <p className="mt-2 text-[1rem] leading-relaxed">{r.apres}</p>
        </section>
      </article>

      {premiere ? (
        <section className="mt-9 border-l-2 border-laiton pl-4">
          <h2 className="text-[1.05rem]">Ce qu’elle a fait en premier</h2>
          <p className="mt-2 text-[1rem]">{premiere.titre}</p>
          <p className="mt-2 text-[0.9rem] text-encre/65">{premiere.pourquoi}</p>
        </section>
      ) : null}

      <section className="mt-9 border border-encre/25 p-4">
        <h2 className="text-[1.05rem]">Ce qui n’est pas réglé</h2>
        <p className="mt-2 text-[0.96rem] text-encre/80">{r.reste}</p>
      </section>

      <p className="mt-10 text-[0.85rem] text-encre/55">{AVERTISSEMENT_RECITS}</p>
    </main>
  )
}

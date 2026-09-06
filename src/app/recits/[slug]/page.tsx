import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Carte } from '@/components/ui/base'
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
    <main className="colonne pb-10 pt-9">
      <Link href="/recits" className="text-[0.92rem] font-semibold text-magenta">
        Tous les récits
      </Link>

      <h1 className="chiffres mt-7 text-[2.1rem]">
        {r.prenom}, {r.age} ans
      </h1>
      <p className="mt-2 text-[0.92rem] font-semibold text-encre-douce">
        {r.ville} · {NOM_DIMENSION[r.dimension]} · {r.duree}
      </p>

      <p className="manuscrit mt-6 text-[1.7rem] text-magenta">{r.accroche}</p>

      <article className="mt-10 flex flex-col gap-9">
        <section>
          <h2 className="text-[1.25rem]">Avant</h2>
          <p className="mt-3 text-[1.06rem] leading-relaxed text-encre-douce">{r.avant}</p>
        </section>

        <section>
          <h2 className="text-[1.25rem]">Ce qui a basculé</h2>
          <p className="mt-3 text-[1.06rem] leading-relaxed text-encre-douce">{r.bascule}</p>
        </section>

        <section>
          <h2 className="text-[1.25rem]">Aujourd’hui</h2>
          <p className="mt-3 text-[1.06rem] leading-relaxed text-encre-douce">{r.apres}</p>
        </section>
      </article>

      {premiere ? (
        <div className="mt-10 rounded-[1.15rem] p-7" style={{ background: 'var(--color-tuile-peche)' }}>
          <h2 className="text-[1.3rem]">Ce qu’elle a fait en premier</h2>
          <p className="mt-3 text-[1.06rem] text-encre">{premiere.titre}</p>
          <p className="mt-3 text-[0.96rem] text-encre-douce">{premiere.pourquoi}</p>
        </div>
      ) : null}

      <Carte className="mt-5 p-7">
        <h2 className="text-[1.3rem]">Ce qui n’est pas réglé</h2>
        <p className="mt-3 text-[1.02rem] text-encre-douce">{r.reste}</p>
      </Carte>

      <p className="mt-12 text-[0.9rem] text-encre-douce">{AVERTISSEMENT_RECITS}</p>
    </main>
  )
}

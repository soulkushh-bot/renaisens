'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CompteSemaines, Phenix } from '@/components/marque/Phenix'
import { LienBouton } from '@/components/ui/base'
import { useEtat } from '@/lib/etat'
import { SUJET_DIMENSION, type DimensionId } from '@/types'

/**
 * Le Profil de Renaissance — le pic émotionnel du produit.
 *
 * Ce qu'on n'affiche jamais ici : un score, une jauge, un radar, une note sur dix. Les scores
 * existent dans le moteur pour répartir les actions, et ils y restent. Ce qu'elle lit, c'est une
 * situation qu'elle peut reconnaître — ou rejeter.
 *
 * La révélation est en CSS pur (`.revelation`) : le contenu est visible par défaut et l'animation
 * ne fait que le retarder. Une version précédente le masquait derrière une bibliothèque chargée en
 * différé, ce qui laissait cet écran blanc plus d'une seconde.
 */

function deux(dims: DimensionId[]): string {
  const [a, b] = dims
  if (!a) return ''
  if (!b) return SUJET_DIMENSION[a]
  return `${SUJET_DIMENSION[a]} et ${SUJET_DIMENSION[b]}`
}

export default function Profil() {
  const router = useRouter()
  const { pret, etat } = useEtat()

  useEffect(() => {
    if (pret && !etat) router.replace('/bilan')
  }, [pret, etat, router])

  if (!pret || !etat) {
    return (
      <main className="colonne py-20">
        <p className="text-encre-douce">Un instant…</p>
      </main>
    )
  }

  const { profile, progress } = etat
  const semaines = progress.semaines.length

  return (
    <main className="pb-10">
      <section className="py-10" style={{ background: 'var(--color-rose-pale)' }}>
        <div className="colonne flex flex-col items-center text-center">
          <Phenix taille={168} couches={semaines} />
          <h1 className="mt-6 text-[1.9rem]">{profile.titre}</h1>
          <p className="mt-4 text-[1.05rem] text-encre-douce">{profile.visionReformulee}</p>
          <div className="mt-7">
            <CompteSemaines couches={semaines} />
          </div>
        </div>
      </section>

      <div className="colonne revelation mt-10 flex flex-col gap-8">
        <section>
          <h2 className="text-[1.5rem]">Ta situation</h2>
          <p className="mt-3 text-[1.06rem] leading-relaxed text-encre-douce">{profile.situation}</p>
        </section>

        <section className="carte-douce p-6" style={{ background: 'var(--color-tuile-peche)' }}>
          <h2 className="text-[1.5rem]">Par où on commence</h2>
          <p className="mt-3 text-[1.06rem] leading-relaxed text-encre">{profile.levier}</p>
        </section>

        <section className="carte p-6">
          <p className="text-[1.04rem] leading-relaxed">
            <span className="text-encre-douce">Ce qui te retient le plus en ce moment :</span>{' '}
            <span className="font-semibold text-prune">{deux(profile.tensions)}</span>.
          </p>
          <p className="mt-4 text-[1.04rem] leading-relaxed">
            <span className="text-encre-douce">Ce sur quoi tu peux t’appuyer :</span>{' '}
            <span className="font-semibold text-prune">{deux(profile.forces)}</span>.
          </p>
          <p className="mt-5 text-[0.9rem] leading-relaxed text-encre-douce">
            Pas de note, pas de pourcentage. Ces deux phrases servent à décider quelles actions tu
            reçois — c’est tout ce qu’elles ont à faire.
          </p>
        </section>

        <section>
          <h2 className="text-[1.5rem]">Ton année, dans tes mots</h2>
          <p className="manuscrit mt-4 text-[1.8rem] text-magenta">{profile.horizonUnAn}</p>
          <p className="mt-4 text-[0.9rem] text-encre-douce">
            On ne te réécrira pas cette phrase. Tu la reliras telle quelle dans un mois.
          </p>
        </section>
      </div>

      <div className="colonne mt-12">
        <LienBouton href="/plan" className="w-full">
          Voir mon plan de trente jours
        </LienBouton>
        <p className="mt-4 text-center text-[0.92rem] text-encre-douce">
          Trois actions par semaine au maximum. Une seule prioritaire.
        </p>
      </div>
    </main>
  )
}

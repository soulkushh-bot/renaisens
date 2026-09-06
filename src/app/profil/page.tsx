'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CarteTeinte } from '@/components/marque/CarteTeinte'
import { Bande, LienBouton } from '@/components/ui/base'
import { useEtat } from '@/lib/etat'
import { SUJET_DIMENSION, type DimensionId } from '@/types'

/**
 * Le Profil de Renaissance.
 *
 * Ce qu'on n'affiche jamais ici : un score, une jauge, un radar, une note sur dix. Les scores
 * existent dans le moteur pour répartir les actions, et ils y restent. Ce qu'elle lit, c'est une
 * situation qu'elle peut reconnaître — ou rejeter.
 */

const Revelation = dynamic(
  () => import('@/components/app/RevelationProfil').then((m) => m.RevelationProfil),
  { ssr: false },
)

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
      <main className="colonne py-16">
        <p className="text-encre/60">Un instant…</p>
      </main>
    )
  }

  const { profile, progress } = etat

  return (
    <main className="colonne pb-16 pt-8">
      <p className="text-[0.85rem] text-encre/60">Ton profil de renaissance</p>

      <div className="mt-4 flex flex-col gap-6">
        <Revelation>
          <CarteTeinte
            titre={profile.titre}
            semainesTenues={progress.semaines.length}
            vision={profile.visionReformulee}
          />

          <section>
            <h2 className="text-[1.15rem]">Ta situation</h2>
            <p className="mt-2 text-[1rem] text-encre/85">{profile.situation}</p>
          </section>

          <section className="border-l-2 border-laiton pl-4">
            <h2 className="text-[1.15rem]">Par où on commence</h2>
            <p className="mt-2 text-[1rem] text-encre/85">{profile.levier}</p>
          </section>

          <section>
            <div className="border border-encre/25 p-4">
              <p className="text-[0.98rem]">
                <span className="text-encre/60">Ce qui te retient le plus en ce moment :</span>{' '}
                {deux(profile.tensions)}.
              </p>
              <p className="mt-3 text-[0.98rem]">
                <span className="text-encre/60">Ce sur quoi tu peux t’appuyer :</span>{' '}
                {deux(profile.forces)}.
              </p>
              <p className="mt-4 text-[0.85rem] text-encre/55">
                Pas de note, pas de pourcentage. Ces deux phrases servent à décider quelles actions
                tu reçois — c’est tout ce qu’elles ont à faire.
              </p>
            </div>
          </section>

          <section>
            <Bande />
            <h2 className="mt-6 text-[1.15rem]">Ton année, dans tes mots</h2>
            <p className="mt-2 border-l-2 border-air pl-4 font-display text-[1.15rem] leading-snug">
              {profile.horizonUnAn}
            </p>
            <p className="mt-3 text-[0.85rem] text-encre/55">
              On ne te réécrira pas cette phrase. Tu la reliras telle quelle dans un mois.
            </p>
          </section>
        </Revelation>
      </div>

      <div className="mt-10">
        <LienBouton href="/plan" className="w-full">
          Voir mon plan de trente jours
        </LienBouton>
        <p className="mt-3 text-center text-[0.85rem] text-encre/60">
          Trois actions par semaine au maximum. Une seule prioritaire.
        </p>
      </div>
    </main>
  )
}

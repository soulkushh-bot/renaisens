'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BandeDecoupee, Couche } from '@/components/marque/Papier'
import { CompteCouches, RosacePhenix } from '@/components/marque/RosacePhenix'
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
 * La révélation est en CSS pur (`.revelation` dans globals.css) : le contenu est visible par défaut
 * et l'animation ne fait que le retarder. La version précédente le masquait derrière une
 * bibliothèque chargée en différé, ce qui laissait cet écran blanc plus d'une seconde — au moment
 * exact où elle attend son profil, et bien plus longtemps sur un téléphone lent.
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
  const couches = progress.semaines.length

  return (
    <main className="pb-6">
      <div className="colonne revelation flex flex-col gap-8 pt-10">
        {/*
          La rosace est posée SUR le bord du panneau : elle le recouvre à moitié.
          C'est le mécanisme du monde appliqué à l'objet du monde.
        */}
        <div>
          <div className="recouvre -mb-24 flex justify-center">
            <RosacePhenix couches={couches} taille={200} />
          </div>
          <div
            className="couche coupe sur-fond-sombre px-6 pb-7 pt-28"
            style={{ ['--teinte' as never]: 'var(--color-indigo)' }}
          >
          <h1 className="decoupe text-[1.95rem] text-papier-clair">{profile.titre}</h1>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-papier-clair">
            {profile.visionReformulee}
          </p>
          <div className="mt-7 text-papier-clair">
            <CompteCouches couches={couches} />
          </div>
          </div>
        </div>

        <section>
          <h2 className="decoupe uppercase text-[1.5rem]">Ta situation</h2>
          <p className="mt-3 text-[1.05rem] leading-relaxed text-encre">{profile.situation}</p>
        </section>

        <Couche teinte="souci" className="p-6">
          <h2 className="decoupe uppercase text-[1.5rem] text-encre">Par où on commence</h2>
          <p className="mt-3 text-[1.05rem] leading-relaxed text-encre">{profile.levier}</p>
        </Couche>

        <Couche teinte="papier-clair" className="p-6">
          <p className="text-[1.02rem] leading-relaxed">
            <span className="text-encre-douce">Ce qui te retient le plus en ce moment :</span>{' '}
            <span className="font-semibold text-indigo">{deux(profile.tensions)}</span>.
          </p>
          <p className="mt-4 text-[1.02rem] leading-relaxed">
            <span className="text-encre-douce">Ce sur quoi tu peux t’appuyer :</span>{' '}
            <span className="font-semibold text-indigo">{deux(profile.forces)}</span>.
          </p>
          <p className="mt-5 text-[0.88rem] leading-relaxed text-encre-douce">
            Pas de note, pas de pourcentage. Ces deux phrases servent à décider quelles actions tu
            reçois — c’est tout ce qu’elles ont à faire.
          </p>
        </Couche>

        <section>
          <BandeDecoupee teinte="corail" />
          <h2 className="decoupe uppercase mt-7 text-[1.5rem]">Ton année, dans tes mots</h2>
          <p className="decoupe mt-4 text-[1.4rem] leading-[1.15] text-indigo">
            {profile.horizonUnAn}
          </p>
          <p className="mt-4 text-[0.88rem] text-encre-douce">
            On ne te réécrira pas cette phrase. Tu la reliras telle quelle dans un mois.
          </p>
        </section>
      </div>

      <div className="colonne mt-12">
        <LienBouton href="/plan" className="w-full">
          Voir mon plan de trente jours
        </LienBouton>
        <p className="mt-4 text-center text-[0.9rem] text-encre-douce">
          Trois actions par semaine au maximum. Une seule prioritaire.
        </p>
      </div>
    </main>
  )
}

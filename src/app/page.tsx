import Link from 'next/link'
import { DebutBilan } from '@/components/app/DebutBilan'
import {
  BandeDecoupee,
  Couche,
  FeuilleDecoupee,
  PetiteFleur,
  PhotoDecoupee,
} from '@/components/marque/Papier'
import { RosacePhenix } from '@/components/marque/RosacePhenix'
import { AVERTISSEMENT_RECITS, RECITS } from '@/content/stories'

/**
 * L'accueil — mode Persuade.
 *
 * Le premier écran ne présente pas le produit, il le démontre : la rosace qu'elle va fabriquer est
 * là, à grande échelle, découpe faite et couleur pas encore posée. La première question du bilan
 * est posée tout de suite, à côté.
 *
 * Deux colonnes à partir de `md` — la promesse et le champ à gauche, la rosace à droite. Une colonne
 * mobile centrée dans 1440 px laissait les deux tiers de l'écran vides.
 *
 * Pas de grille de cartes identiques, pas de témoignages, pas d'eyebrow au-dessus du titre.
 */

const CE_QUI_SE_PASSE = [
  'Un bilan de huit minutes, sur cinq domaines : toi, ton travail, ton argent, ton projet, ton entourage.',
  'Un profil qui décrit ta situation — pas ta personnalité, et sans note sur dix.',
  'Un plan de trente jours : trois actions par semaine au maximum, une seule prioritaire.',
  'Un rituel de trois minutes par semaine. Le plan se réécrit selon ce que tu as vraiment fait.',
]

export default function Accueil() {
  const apercu = RECITS.slice(0, 3)

  return (
    <main className="pb-4">
      <div className="colonne-large pt-8 md:pt-16">
        <p className="decoupe text-[1.35rem] tracking-[-0.03em] text-indigo">RenaiSens</p>

        <div className="mt-8 md:grid md:grid-cols-[1fr_0.9fr] md:items-center md:gap-14">
          <div>
            <h1 className="decoupe uppercase text-[clamp(2.7rem,13vw,4.6rem)]">
              Trente jours.
              <br />
              Une chose
              <br />
              à la fois.
            </h1>

            <p className="mt-7 max-w-[34ch] text-[1.14rem] leading-relaxed text-encre">
              Tu es à un moment de bascule. RenaiSens t’aide à voir clair, puis te donne un plan que
              tu peux vraiment tenir — même les semaines où rien ne va.
            </p>

            <div className="mt-9 md:mt-11">
              <DebutBilan />
            </div>
          </div>

          {/* La démonstration, pas la promesse : l'objet qu'elle va fabriquer. */}
          <div className="mt-12 flex flex-col items-center md:mt-0">
            <RosacePhenix couches={0} taille={300} className="w-full max-w-[19rem]" />
            <p className="mt-6 max-w-[30ch] text-center text-[1rem] leading-relaxed text-encre">
              Voilà ta rosace. La découpe est faite, la couleur ne l’est pas encore. Elle gagne une
              couche de papier collée chaque semaine que tu tiens — au trentième jour, elle est
              entière, et c’est toi qui l’auras faite.
            </p>
          </div>
        </div>
      </div>

      <BandeDecoupee teinte="feuille" className="mt-16" />

      <Couche teinte="feuille" coupe={false} className="pb-20 pt-12">
        <div className="colonne">
          <h2 className="decoupe uppercase text-[2rem] text-papier-clair">Ce qui se passe ensuite</h2>
          <ul className="mt-8 flex flex-col gap-6">
            {CE_QUI_SE_PASSE.map((ligne) => (
              <li key={ligne} className="flex gap-4">
                <PetiteFleur taille={22} petale="souci" coeur="corail" className="mt-0.5 shrink-0" />
                <span className="text-[1.04rem] leading-relaxed text-papier-clair">{ligne}</span>
              </li>
            ))}
          </ul>
        </div>
      </Couche>

      {/*
        Le recouvrement, pour de vrai : ce bloc mord sur la section verte au-dessus de lui.
        C'est le mécanisme du monde, pas un ornement.
      */}
      <div className="colonne recouvre recouvre-haut">
        <Couche teinte="souci" className="p-6 md:p-8">
          <h2 className="decoupe uppercase text-[1.6rem] text-encre">
            Ce que tu écris reste chez toi
          </h2>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-encre">
            Tes réponses sur ton argent, ton travail et ta famille sont enregistrées sur ton
            téléphone, et nulle part ailleurs. Pas de compte, pas de mot de passe, aucun serveur. Tu
            peux tout effacer en deux touches, à tout moment.
          </p>
        </Couche>
      </div>

      <div className="colonne mt-16">
        <PhotoDecoupee
          src="/images/dakar-matin.webp"
          alt="Une femme descend quelques marches de pierre dans une cour aux murs ocre et aux volets bleus, en pleine lumière du jour."
          legende="Photographie d’ambiance, sous licence libre. Ce n’est aucune des femmes dont tu vas lire le parcours ci-dessous."
        />
      </div>

      <div className="colonne mt-14">
        <h2 className="decoupe uppercase text-[2rem]">Des parcours qui ressemblent au tien</h2>
        <p className="mt-3 text-[0.96rem] leading-relaxed text-encre-douce">
          {AVERTISSEMENT_RECITS}
        </p>

        <ul className="mt-8 flex flex-col gap-4">
          {apercu.map((r, i) => (
            <li key={r.slug} className={i % 2 === 1 ? 'md:ml-12' : 'md:mr-12'}>
              <Link href={`/recits/${r.slug}`} className="block">
                <Couche teinte="papier-clair" className="p-5">
                  <p className="decoupe text-[1.15rem] text-indigo">
                    {r.prenom}, {r.age} ans, {r.ville}
                  </p>
                  <p className="mt-2 text-[1rem] leading-relaxed text-encre">{r.accroche}</p>
                </Couche>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/recits"
          className="mt-6 inline-flex items-center gap-2.5 font-display text-[1.02rem] font-bold uppercase text-indigo underline"
        >
          <FeuilleDecoupee taille={18} teinte="corail" />
          Lire les {RECITS.length} parcours
        </Link>
      </div>

      <BandeDecoupee teinte="indigo" className="mt-16" />

      <Couche teinte="indigo" coupe={false} className="pb-16 pt-10">
        <div className="colonne">
          <p className="text-[0.94rem] leading-relaxed text-papier-clair">
            RenaiSens est gratuit. Ton plan et ton rituel fonctionnent sans connexion : tout est
            calculé sur ton téléphone. Écrit pour des femmes francophones en transition, en Afrique
            de l’Ouest et dans la diaspora.
          </p>
        </div>
      </Couche>
    </main>
  )
}

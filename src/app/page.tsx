import Link from 'next/link'
import { DebutBilan } from '@/components/app/DebutBilan'
import { BandeDecoupee, Couche, FeuilleDecoupee, PetiteFleur } from '@/components/marque/Papier'
import { RosacePhenix } from '@/components/marque/RosacePhenix'
import { AVERTISSEMENT_RECITS, RECITS } from '@/content/stories'

/**
 * L'accueil — mode Persuade.
 *
 * Le premier écran ne présente pas le produit, il le démontre : la rosace qu'elle va fabriquer est
 * là, encore nue, et la première question du bilan est posée tout de suite.
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
      <div className="colonne pt-8">
        <p className="font-display text-[1.3rem] font-extrabold tracking-[-0.03em] text-indigo">RenaiSens</p>

        <h1 className="decoupe uppercase mt-7 text-[clamp(2.6rem,13vw,4rem)]">
          Trente jours.
          <br />
          Une chose
          <br />
          à la fois.
        </h1>

        <p className="mt-6 text-[1.12rem] leading-relaxed text-encre/85">
          Tu es à un moment de bascule. RenaiSens t’aide à voir clair, puis te donne un plan que tu
          peux vraiment tenir — même les semaines où rien ne va.
        </p>

        {/* La démonstration, pas la promesse : l'objet qu'elle va fabriquer, encore nu. */}
        <div className="mt-10 flex items-center gap-5">
          <RosacePhenix couches={0} taille={128} className="shrink-0" />
          <p className="text-[0.98rem] leading-relaxed text-encre/80">
            Voilà ta rosace. Elle est en papier, elle est nue, et elle gagne une couche découpée
            chaque semaine que tu tiens. Au trentième jour, elle est entière — et c’est toi qui
            l’auras faite.
          </p>
        </div>

        <div className="mt-10">
          <DebutBilan />
        </div>
      </div>

      <BandeDecoupee teinte="feuille" className="mt-16" />

      <Couche teinte="feuille" coupe={false} className="pb-14 pt-10">
        <div className="colonne">
          <h2 className="decoupe uppercase text-[1.9rem] text-papier-clair">Ce qui se passe ensuite</h2>
          <ul className="mt-7 flex flex-col gap-5">
            {CE_QUI_SE_PASSE.map((ligne) => (
              <li key={ligne} className="flex gap-3.5">
                <PetiteFleur taille={20} petale="souci" coeur="corail" className="mt-0.5 shrink-0" />
                <span className="text-[1.02rem] leading-relaxed text-papier-clair">{ligne}</span>
              </li>
            ))}
          </ul>
        </div>
      </Couche>

      <div className="colonne mt-14">
        <Couche teinte="papier-clair" className="p-6">
          <h2 className="decoupe uppercase text-[1.5rem]">Ce que tu écris reste chez toi</h2>
          <p className="mt-3 text-[1rem] leading-relaxed text-encre/85">
            Tes réponses sur ton argent, ton travail et ta famille sont enregistrées sur ton
            téléphone, et nulle part ailleurs. Pas de compte, pas de mot de passe, aucun serveur. Tu
            peux tout effacer en deux touches, à tout moment.
          </p>
        </Couche>
      </div>

      <div className="colonne mt-16">
        <h2 className="decoupe uppercase text-[1.9rem]">Des parcours qui ressemblent au tien</h2>
        <p className="mt-3 text-[0.94rem] text-encre/70">{AVERTISSEMENT_RECITS}</p>

        <ul className="mt-7 flex flex-col gap-3">
          {apercu.map((r) => (
            <li key={r.slug}>
              <Link href={`/recits/${r.slug}`} className="block">
                <Couche teinte="papier-clair" className="p-5">
                  <p className="decoupe text-[1.1rem]">
                    {r.prenom}, {r.age} ans, {r.ville}
                  </p>
                  <p className="mt-2 text-[0.98rem] text-encre/80">{r.accroche}</p>
                </Couche>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/recits"
          className="mt-5 inline-flex items-center gap-2 font-display text-[1rem] font-bold uppercase text-indigo underline"
        >
          <FeuilleDecoupee taille={16} teinte="corail" />
          Lire les {RECITS.length} parcours
        </Link>
      </div>

      <BandeDecoupee teinte="indigo" className="mt-16" />

      <Couche teinte="indigo" coupe={false} className="pb-16 pt-10">
        <div className="colonne">
          <p className="text-[0.9rem] leading-relaxed text-papier-clair/80">
            RenaiSens est gratuit. Ton plan et ton rituel fonctionnent sans connexion : tout est
            calculé sur ton téléphone. Écrit pour des femmes francophones en transition, en Afrique
            de l’Ouest et dans la diaspora.
          </p>
        </div>
      </Couche>
    </main>
  )
}

import Link from 'next/link'
import { DebutBilan } from '@/components/app/DebutBilan'
import { Bande } from '@/components/ui/base'
import { PhoenixStamp } from '@/components/marque/PhoenixStamp'
import { AVERTISSEMENT_RECITS, RECITS } from '@/content/stories'

/**
 * Un seul écran, sans grille de features et sans témoignages en carrousel.
 * La promesse, puis la première question du bilan, tout de suite.
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
    <main className="colonne pb-16 pt-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-[1.05rem] tracking-tight text-cuve">RENaiSENS</p>
          <h1 className="mt-4 text-[2.1rem]">Devenir une nouvelle version de soi.</h1>
        </div>
        <PhoenixStamp taille={54} className="mt-1 shrink-0 text-cuve" />
      </div>

      <p className="mt-4 text-[1.05rem] text-encre/80">
        Tu es à un moment de bascule. RENaiSENS t’aide à voir clair, à décider ce que tu veux
        vraiment, et à repartir avec un plan que tu peux tenir — même les semaines où rien ne va.
      </p>

      <div className="mt-7">
        <DebutBilan />
      </div>

      <Bande className="mt-12" />

      <section className="mt-8">
        <h2 className="text-[1.3rem]">Ce qui se passe ensuite</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {CE_QUI_SE_PASSE.map((ligne) => (
            <li key={ligne} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 block h-2 w-2 shrink-0 bg-air" />
              <span className="text-[0.98rem] text-encre/85">{ligne}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 border border-encre/25 p-4">
        <h2 className="text-[1.1rem]">Ce que tu écris reste chez toi</h2>
        <p className="mt-2 text-[0.94rem] text-encre/80">
          Tes réponses sur ton argent, ton travail et ta famille sont enregistrées sur ton téléphone,
          et nulle part ailleurs. Pas de compte, pas de mot de passe, aucun serveur. Tu peux tout
          effacer en deux touches, à tout moment.
        </p>
      </section>

      <Bande className="mt-12" />

      <section className="mt-8">
        <h2 className="text-[1.3rem]">Des parcours qui ressemblent au tien</h2>
        <p className="mt-2 text-[0.9rem] text-encre/65">{AVERTISSEMENT_RECITS}</p>

        <ul className="mt-5 flex flex-col gap-3">
          {apercu.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/recits/${r.slug}`}
                className="block border border-encre/25 p-4 transition-colors hover:border-encre"
              >
                <p className="font-display text-[1.05rem]">
                  {r.prenom}, {r.age} ans, {r.ville}
                </p>
                <p className="mt-1 text-[0.94rem] text-encre/75">{r.accroche}</p>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/recits"
          className="mt-4 inline-block text-[0.94rem] underline underline-offset-4"
        >
          Lire les {RECITS.length} parcours
        </Link>
      </section>

      <footer className="mt-14 border-t border-encre/20 pt-5 text-[0.82rem] text-encre/55">
        <p>
          RENaiSENS est gratuit. Ton plan et ton rituel fonctionnent sans connexion : tout est
          calculé sur ton téléphone. Écrit pour des femmes francophones en transition, en Afrique de
          l’Ouest et dans la diaspora.
        </p>
      </footer>
    </main>
  )
}

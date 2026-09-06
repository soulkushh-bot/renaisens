import Link from 'next/link'
import { DebutBilan } from '@/components/app/DebutBilan'
import { Logo, Phenix } from '@/components/marque/Phenix'
import { Carte, Fleche, LienBouton } from '@/components/ui/base'
import { AVERTISSEMENT_RECITS, RECITS } from '@/content/stories'
import { DIMENSIONS, NOM_DIMENSION } from '@/types'

/**
 * L'accueil — mode Persuade.
 *
 * Structure reprise du modèle fourni par l'utilisateur : héros avec photographie, rangée de
 * domaines, contenus, bande d'appel à l'action. Chaque élément est rempli avec du vrai contenu
 * RenaiSens.
 *
 * CE QU'ON N'A PAS FAIT, ET POURQUOI : le modèle affiche « 10 000+ femmes accompagnées »,
 * « 95 % de satisfaction » et des notes d'avis. RenaiSens n'a aujourd'hui aucune utilisatrice,
 * aucun avis, aucune traction — c'est écrit dans PRODUCT.md. La rangée de chiffres existe quand
 * même, mais elle porte des faits vrais et vérifiables sur le produit lui-même. Sur un produit qui
 * demande de parler d'argent et de famille, un chiffre inventé est la première chose qui se
 * retourne contre lui.
 */

const DOMAINES: {
  dimension: (typeof DIMENSIONS)[number]
  texte: string
  fond: string
  accent: string
}[] = [
  {
    dimension: 'soi',
    texte: 'Confiance, énergie, limites, place que tu prends',
    fond: 'var(--color-tuile-rose)',
    accent: 'var(--color-icone-rose)',
  },
  {
    dimension: 'carriere',
    texte: 'Sens, compétences, salaire, direction à deux ans',
    fond: 'var(--color-tuile-lavande)',
    accent: 'var(--color-icone-violet)',
  },
  {
    dimension: 'finances',
    texte: 'Visibilité, épargne, dettes, coussin de sécurité',
    fond: 'var(--color-tuile-menthe)',
    accent: 'var(--color-icone-vert)',
  },
  {
    dimension: 'projet',
    texte: 'Offre, première cliente, prix, mise en route',
    fond: 'var(--color-tuile-peche)',
    accent: 'var(--color-icone-orange)',
  },
  {
    dimension: 'entourage',
    texte: 'Soutien, charge portée, femmes qui font pareil',
    fond: 'var(--color-tuile-rose)',
    accent: 'var(--color-icone-rose)',
  },
]

/** Des faits vrais sur le produit, à la place des chiffres de traction qu'on n'a pas. */
const FAITS = [
  { valeur: '8 min', libelle: 'Le temps du bilan' },
  { valeur: '3', libelle: 'Actions par semaine, au maximum' },
  { valeur: '0', libelle: 'Compte à créer' },
]

const ETAPES = [
  {
    titre: 'Tu fais le point',
    texte: 'Vingt-deux questions sur cinq domaines. Directes, jamais infantilisantes.',
  },
  {
    titre: 'Tu lis ta situation',
    texte: 'Pas une note sur dix, pas un profil de personnalité : ce qui te retient, en clair.',
  },
  {
    titre: 'Tu reçois ton plan',
    texte: 'Trente jours, trois actions par semaine, une seule prioritaire. Concrètes et locales.',
  },
  {
    titre: 'Tu tiens, à ton rythme',
    texte: 'Trois minutes par semaine. Le plan se réécrit selon ce que tu as vraiment fait.',
  },
]

export default function Accueil() {
  const apercu = RECITS.slice(0, 3)

  return (
    <main>
      {/* — En-tête — */}
      <header className="colonne-large flex items-center justify-between gap-4 py-5">
        <Logo taille={44} />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navigation">
          <a href="#comment" className="text-[0.98rem] font-medium text-encre">
            Comment ça marche
          </a>
          <Link href="/recits" className="text-[0.98rem] font-medium text-encre">
            Récits
          </Link>
        </nav>
        <LienBouton href="/bilan" className="shrink-0">
          Faire le point
        </LienBouton>
      </header>

      {/* — Héros — */}
      <section className="relative overflow-hidden bg-rose-pale/60">
        <div className="colonne-large grid items-center gap-10 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-16">
          <div>
            <h1 className="text-[clamp(2.3rem,7vw,3.5rem)]">
              Tu peux changer ta vie{' '}
              <span className="text-magenta">sans changer toute ta vie.</span>
            </h1>

            <p className="mt-6 max-w-[46ch] text-[1.1rem] leading-relaxed text-encre-douce">
              RenaiSens t’aide à voir clair sur où tu en es, puis te donne un plan de trente jours
              que tu peux vraiment tenir — trois actions par semaine, jamais plus, même les semaines
              où rien ne va.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <LienBouton href="/bilan">Commencer mon bilan</LienBouton>
              <LienBouton href="#comment" variante="contour">
                Comment ça marche
              </LienBouton>
            </div>

            {/* Des faits, pas des chiffres de traction. */}
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              {FAITS.map((f) => (
                <div key={f.libelle}>
                  <dt className="chiffres font-display text-[1.7rem] font-extrabold leading-none text-prune">
                    {f.valeur}
                  </dt>
                  <dd className="mt-1.5 max-w-[18ch] text-[0.9rem] text-encre-douce">{f.libelle}</dd>
                </div>
              ))}
            </dl>

            <p className="manuscrit mt-9 text-[1.5rem] text-magenta">
              « Tu n’as pas besoin d’être prête.
              <br />
              Tu as besoin de commencer. »
            </p>
          </div>

          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/accueil-femme.webp"
              alt="Une jeune femme au foulard de wax sourit, regard vers l’objectif."
              className="w-full rounded-[1.4rem] object-cover"
              width={1000}
              height={1500}
              fetchPriority="high"
            />

            {/* Les cinq domaines, en carte flottante. */}
            <Carte className="absolute -bottom-6 left-4 right-4 p-4 md:-right-6 md:left-auto md:w-[17rem]">
              <ul className="flex flex-col gap-2.5">
                {DIMENSIONS.map((d, i) => (
                  <li key={d} className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="block h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: DOMAINES[i]!.accent }}
                    />
                    <span className="text-[0.94rem] font-medium text-encre">{NOM_DIMENSION[d]}</span>
                  </li>
                ))}
              </ul>
            </Carte>
          </div>
        </div>
      </section>

      {/* — Les cinq domaines — */}
      <section className="colonne-large pt-24 md:pt-20">
        <h2 className="text-[1.75rem] md:text-[2rem]">Ce que le bilan regarde</h2>
        <p className="mt-3 max-w-[60ch] text-[1rem] text-encre-douce">
          Cinq domaines, parce qu’une vie ne se répare pas par morceaux séparés. Le plan touche les
          cinq, et met le plus de poids là où ça coince.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINES.map((d) => (
            <li key={d.dimension}>
              <div className="carte-douce h-full p-6" style={{ background: d.fond }}>
                <span
                  aria-hidden="true"
                  className="block h-9 w-9 rounded-[0.6rem]"
                  style={{ background: d.accent }}
                />
                <h3 className="mt-4 text-[1.2rem]">{NOM_DIMENSION[d.dimension]}</h3>
                <p className="mt-2 text-[0.96rem] text-encre-douce">{d.texte}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* — Comment ça marche — */}
      <section id="comment" className="colonne-large scroll-mt-8 pt-20">
        <h2 className="text-[1.75rem] md:text-[2rem]">Comment ça marche</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ETAPES.map((e) => (
            <li key={e.titre}>
              <Carte className="h-full p-6">
                <h3 className="text-[1.15rem]">{e.titre}</h3>
                <p className="mt-2.5 text-[0.96rem] text-encre-douce">{e.texte}</p>
              </Carte>
            </li>
          ))}
        </ol>
      </section>

      {/* — La première question, posée tout de suite — */}
      <section className="colonne-large pt-20">
        <div className="mx-auto max-w-[36rem]">
          <DebutBilan />
        </div>
      </section>

      {/* — Ambiance. Aucune de ces femmes n'est une utilisatrice, et la légende le dit. — */}
      <section className="colonne-large pt-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {['parcours-01', 'parcours-02', 'parcours-03'].map((nom) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={nom}
              src={`/images/${nom}.webp`}
              alt=""
              aria-hidden="true"
              className="h-56 w-full rounded-[1.1rem] object-cover"
              loading="lazy"
            />
          ))}
        </div>
        <p className="mt-3 text-[0.86rem] text-encre-douce">
          Photographies d’ambiance, sous licence libre. Aucune de ces femmes n’utilise RenaiSens et
          aucune n’a témoigné.
        </p>
      </section>

      {/* — Les récits — */}
      <section className="colonne-large pt-20">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[1.75rem] md:text-[2rem]">Des parcours qui ressemblent au tien</h2>
            <p className="mt-2 max-w-[62ch] text-[0.96rem] text-encre-douce">
              {AVERTISSEMENT_RECITS}
            </p>
          </div>
          <Link
            href="/recits"
            className="inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-magenta"
          >
            Les {RECITS.length} parcours
            <Fleche />
          </Link>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {apercu.map((r) => (
            <li key={r.slug}>
              <Link href={`/recits/${r.slug}`} className="block h-full">
                <Carte className="h-full p-6">
                  <h3 className="text-[1.15rem]">
                    {r.prenom}, {r.age} ans
                  </h3>
                  <p className="mt-1 text-[0.88rem] font-medium text-magenta">{r.ville}</p>
                  <p className="mt-3 text-[0.96rem] text-encre-douce">{r.accroche}</p>
                </Carte>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* — Vie privée — */}
      <section className="colonne-large pt-20">
        <div className="carte-douce p-7 md:p-10" style={{ background: 'var(--color-tuile-menthe)' }}>
          <h2 className="text-[1.5rem]">Ce que tu écris reste chez toi</h2>
          <p className="mt-3 max-w-[70ch] text-[1rem] text-encre-douce">
            Tes réponses sur ton argent, ton travail et ta famille sont enregistrées sur ton
            téléphone, et nulle part ailleurs. Pas de compte, pas de mot de passe, aucun serveur. Tu
            peux tout exporter, ou tout effacer, en deux touches.
          </p>
        </div>
      </section>

      {/* — L'appel à l'action — */}
      <section className="mt-24 sur-fond-sombre" style={{ background: 'var(--color-prune)' }}>
        <div className="colonne-large flex flex-col items-start justify-between gap-7 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="text-[1.8rem] text-white md:text-[2.1rem]">
              Huit minutes, et tu sais par où commencer.
            </h2>
            <p className="mt-3 max-w-[52ch] text-[1.02rem] text-white/85">
              Gratuit, sans compte, et tu peux t’arrêter puis reprendre quand tu veux.
            </p>
          </div>
          <LienBouton href="/bilan" variante="clair" className="shrink-0">
            Commencer mon bilan
          </LienBouton>
        </div>
      </section>

      {/* — Pied de page — */}
      <footer className="colonne-large py-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Logo taille={40} />
          <nav className="flex flex-wrap gap-6 text-[0.94rem] text-encre-douce" aria-label="Pied de page">
            <Link href="/recits">Récits</Link>
            <Link href="/reglages">Confidentialité</Link>
            <Link href="/bilan">Faire le point</Link>
          </nav>
        </div>
        <p className="mt-8 max-w-[70ch] text-[0.88rem] text-encre-douce">
          RenaiSens est gratuit et le reste. Écrit pour des femmes francophones en transition, en
          Afrique de l’Ouest et dans la diaspora. Ton plan et ton rituel sont calculés sur ton
          téléphone, sans connexion.
        </p>
      </footer>
    </main>
  )
}

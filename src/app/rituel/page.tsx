'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BandeDecoupee, Couche, PetiteFleur } from '@/components/marque/Papier'
import { CompteCouches, RosacePhenix } from '@/components/marque/RosacePhenix'
import { Bouton, LienBouton } from '@/components/ui/base'
import { action } from '@/content/actions'
import { QUESTION_VISION } from '@/content/questions'
import { reflexionPour } from '@/content/reflexions'
import { semaineDuPlan } from '@/lib/engine/plan'
import { semaineCourante, useEtat } from '@/lib/etat'
import type { PlanChange } from '@/types'

/**
 * Le rituel hebdomadaire — la boucle de rétention, et le cœur du produit.
 *
 * Trois minutes, trois temps, plafonné par construction : au plus trois cases, une question courte,
 * un diff à lire. Pas de champ de journal libre — un journal libre ne tient jamais en trois minutes.
 *
 * Aucun appel réseau : tout tourne en local, y compris la réécriture du plan.
 *
 * Le troisième temps colle une couche de plus sur sa rosace. C'est la récompense, et elle est
 * matérielle : un objet qui grandit, jamais une barre qui se remplit.
 */

type Etape = 'coches' | 'question' | 'resultat'

export default function Rituel() {
  const router = useRouter()
  const { pret, etat, completerRituel } = useEtat()

  const [etape, setEtape] = useState<Etape>('coches')
  const [coches, setCoches] = useState<string[] | null>(null)
  const [reponse, setReponse] = useState('')
  const [changements, setChangements] = useState<PlanChange[]>([])
  const [semaineFaite, setSemaineFaite] = useState(0)

  useEffect(() => {
    if (pret && !etat) router.replace('/')
  }, [pret, etat, router])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [etape])

  if (!pret || !etat) {
    return (
      <main className="colonne py-20">
        <p className="text-encre-douce">Un instant…</p>
      </main>
    )
  }

  const semaine = semaineCourante(etat)
  const actions = semaineDuPlan(etat.plan, semaine)?.actions ?? []
  const selection =
    coches ?? actions.filter((a) => etat.progress.faites.includes(a.actionId)).map((a) => a.actionId)
  const reflexion = reflexionPour(semaine, etat.profile.tensions[0] ?? 'soi')

  // Forme fonctionnelle : jamais de calcul à partir de la valeur capturée par la fermeture.
  const basculer = (id: string) =>
    setCoches((precedent) => {
      const base = precedent ?? selection
      return base.includes(id) ? base.filter((x) => x !== id) : [...base, id]
    })

  const terminer = () => {
    const faites = actions.filter((a) => selection.includes(a.actionId)).map((a) => a.actionId)
    const nonFaites = actions.filter((a) => !selection.includes(a.actionId)).map((a) => a.actionId)
    const c = completerRituel({
      semaine,
      faites,
      nonFaites,
      reflexion: { questionId: reflexion.id, reponse: reponse.trim() },
    })
    setSemaineFaite(semaine)
    setChangements(c)
    setEtape('resultat')
  }

  // ————————————————————————— 3. Ce qui change —————————————————————————
  if (etape === 'resultat') {
    const quatrieme = semaineFaite >= 4
    const frein = etat.answers['q_frein']
    const vision = etat.answers[QUESTION_VISION]
    const couches = etat.progress.semaines.length

    return (
      <main className="pb-6">
        <Couche teinte="indigo" coupe={false} className="pb-12 pt-6">
          <div className="colonne revelation flex flex-col gap-7">
            <div className="recouvre -mt-16 flex justify-center">
              <RosacePhenix couches={couches} taille={190} />
            </div>
            <div className="text-papier-clair">
              <CompteCouches couches={couches} />
            </div>
          </div>
        </Couche>

        <div className="colonne mt-12">
          <h1 className="decoupe uppercase text-[2.1rem]">Ce qui change</h1>

          {changements.length === 0 ? (
            <p className="mt-5 text-[1.05rem] text-encre">
              Rien à réécrire cette semaine. Ton plan tient tel quel.
            </p>
          ) : (
            <ul className="mt-7 flex flex-col gap-3">
              {changements.map((c, i) => (
                <li key={`${c.actionId}-${i}`}>
                  <Couche teinte={c.type === 'montee' ? 'souci' : 'papier-clair'} className="p-5">
                    <p className="text-[1.02rem] leading-relaxed text-encre">{c.texte}</p>
                  </Couche>
                </li>
              ))}
            </ul>
          )}
        </div>

        {quatrieme ? (
          <>
            <BandeDecoupee teinte="corail" className="mt-16" />
            <div className="colonne mt-10">
              <h2 className="decoupe uppercase text-[1.9rem]">Un mois plus tôt, tu écrivais ça</h2>
              <p className="mt-3 text-[0.96rem] text-encre-douce">
                Mot pour mot, sans rien changer. C’est ton avant et ton après, dans ta langue.
              </p>

              {typeof frein === 'string' && frein.trim() ? (
                <figure className="mt-8">
                  <figcaption className="font-display text-[0.85rem] font-bold uppercase text-encre-douce">
                    Ce qui t’arrêtait, le premier jour
                  </figcaption>
                  <blockquote className="decoupe mt-2 text-[1.35rem] leading-[1.15] text-indigo">
                    {frein}
                  </blockquote>
                </figure>
              ) : null}

              {typeof vision === 'string' && vision.trim() ? (
                <figure className="mt-7">
                  <figcaption className="font-display text-[0.85rem] font-bold uppercase text-encre-douce">
                    Ce que tu voulais voir changer
                  </figcaption>
                  <blockquote className="decoupe mt-2 text-[1.35rem] leading-[1.15] text-indigo">
                    {vision}
                  </blockquote>
                </figure>
              ) : null}

              {reponse.trim() ? (
                <figure className="mt-10">
                  <figcaption className="font-display text-[0.85rem] font-bold uppercase text-encre-douce">
                    Ce que tu viens d’écrire, aujourd’hui
                  </figcaption>
                  <blockquote className="decoupe mt-2 text-[1.35rem] leading-[1.15] text-indigo">
                    {reponse.trim()}
                  </blockquote>
                </figure>
              ) : null}

              <p className="mt-10 text-[1rem] leading-relaxed text-encre">
                On ne va pas te dire si c’est bien. Relis les deux, et décide toi-même.
              </p>
            </div>
          </>
        ) : null}

        <div className="colonne mt-12 flex flex-col gap-3">
          <LienBouton href="/aujourdhui" className="w-full">
            Revenir à ma semaine
          </LienBouton>
          <LienBouton href="/plan" variante="discret">
            Voir le plan réécrit
          </LienBouton>
        </div>
      </main>
    )
  }

  // ————————————————————————— 2. Une question —————————————————————————
  if (etape === 'question') {
    return (
      <main className="colonne pb-36 pt-9">
        <h1 className="decoupe uppercase text-[1.9rem]">{reflexion.texte}</h1>
        {reflexion.aide ? <p className="mt-3 text-[1rem] text-encre-douce">{reflexion.aide}</p> : null}
        <p className="chiffres mt-4 font-display text-[0.85rem] font-bold uppercase text-encre-douce">
          Rituel de la semaine {semaine} · 2 sur 3
        </p>

        <textarea
          rows={4}
          maxLength={280}
          value={reponse}
          onChange={(e) => setReponse(e.target.value)}
          placeholder="Deux lignes suffisent."
          aria-label={reflexion.texte}
          className="couche coupe mt-7 w-full resize-y p-4 text-[1.05rem] leading-relaxed text-encre placeholder:text-encre-douce"
          style={{ ['--teinte' as never]: 'var(--color-papier-clair)' }}
        />
        <p className="chiffres mt-1.5 text-right text-[0.8rem] text-encre-douce">{reponse.length} / 280</p>

        <div className="fixed inset-x-0 bottom-0 z-20">
          <BandeDecoupee teinte="papier-clair" />
          <div className="couche" style={{ ['--teinte' as never]: 'var(--color-papier-clair)' }}>
            <div className="colonne flex items-center gap-3 py-3">
              <button
                type="button"
                onClick={() => setEtape('coches')}
                className="min-h-12 px-2 font-display text-[0.9rem] font-bold uppercase text-encre-douce underline"
              >
                Revenir
              </button>
              <Bouton className="flex-1" onClick={terminer}>
                Voir ce qui change
              </Bouton>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // ————————————————————————— 1. Ce que tu as fait —————————————————————————
  return (
    <main className="colonne pb-36 pt-9">
      <p className="chiffres font-display text-[0.85rem] font-bold uppercase text-encre-douce">
        Rituel de la semaine {semaine} · 1 sur 3
      </p>
      <h1 className="decoupe uppercase mt-5 text-[1.9rem]">Qu’est-ce que tu as fait cette semaine ?</h1>
      <p className="mt-3 text-[1rem] leading-relaxed text-encre-douce">
        Ce que tu n’as pas fait n’est pas un échec, et ne sera pas répété tel quel. Coche juste ce
        qui est vrai.
      </p>
      <p className="chiffres mt-4 font-display text-[0.85rem] font-bold uppercase text-encre-douce">
        Rituel de la semaine {semaine} · 1 sur 3
      </p>

      {actions.length === 0 ? (
        <Couche teinte="papier-clair" className="mt-7 p-5">
          <p className="text-[1rem] text-encre-douce">
            Il n’y avait rien de prévu cette semaine. Tu peux passer à la question.
          </p>
        </Couche>
      ) : (
        <ul className="mt-7 flex flex-col gap-3">
          {actions.map((a) => {
            const def = action(a.actionId)
            const coche = selection.includes(a.actionId)
            return (
              <li key={a.actionId}>
                <button
                  type="button"
                  onClick={() => basculer(a.actionId)}
                  aria-pressed={coche}
                  className="couche coupe flex w-full items-start gap-3.5 p-5 text-left"
                  style={{
                    ['--teinte' as never]: coche
                      ? 'var(--color-feuille)'
                      : 'var(--color-papier-clair)',
                  }}
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">
                    {coche ? (
                      <PetiteFleur taille={26} petale="souci" coeur="papier-clair" />
                    ) : (
                      <span className="block h-4 w-4 border-2 border-encre/40" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[1.05rem] leading-snug ${coche ? 'text-papier-clair' : 'text-encre'}`}
                    >
                      {a.reduite ? def.versionReduite : def.titre}
                    </span>
                    <span
                      className={`mt-1.5 block font-display text-[0.82rem] font-bold uppercase ${
                        coche ? 'text-souci' : 'text-encre-douce'
                      }`}
                    >
                      {coche ? 'Fait' : 'Pas cette semaine'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20">
        <BandeDecoupee teinte="papier-clair" />
        <div className="couche" style={{ ['--teinte' as never]: 'var(--color-papier-clair)' }}>
          <div className="colonne flex items-center gap-3 py-3">
            <LienBouton href="/aujourdhui" variante="discret">
              Plus tard
            </LienBouton>
            <Bouton className="flex-1" onClick={() => setEtape('question')}>
              Passer à la question
            </Bouton>
          </div>
        </div>
      </div>
    </main>
  )
}

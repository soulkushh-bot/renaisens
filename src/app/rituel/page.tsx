'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CarteTeinte } from '@/components/marque/CarteTeinte'
import { Bande, Bouton, LienBouton } from '@/components/ui/base'
import { action } from '@/content/actions'
import { QUESTION_VISION } from '@/content/questions'
import { reflexionPour } from '@/content/reflexions'
import { semaineDuPlan } from '@/lib/engine/plan'
import { semaineCourante, useEtat } from '@/lib/etat'
import type { PlanChange } from '@/types'

/**
 * Le rituel hebdomadaire — la boucle de rétention, et le cœur du produit.
 *
 * Trois minutes, trois temps, et un plafond par construction : au plus trois cases, une question
 * courte, un diff à lire. Pas de champ de journal libre — un journal libre ne tient jamais en trois
 * minutes, et une promesse de trois minutes qu'on ne tient pas ne se répète pas une deuxième fois.
 *
 * Aucun appel réseau : tout tourne en local, y compris la réécriture du plan. Le segment pilote est
 * sur un réseau instable ; un rituel qui échoue faute de 3G est un rituel qu'on ne refait pas.
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
      <main className="colonne py-16">
        <p className="text-encre/60">Un instant…</p>
      </main>
    )
  }

  const semaine = semaineCourante(etat)
  const actions = semaineDuPlan(etat.plan, semaine)?.actions ?? []
  const selection = coches ?? actions.filter((a) => etat.progress.faites.includes(a.actionId)).map((a) => a.actionId)
  const reflexion = reflexionPour(semaine, etat.profile.tensions[0] ?? 'soi')

  // Même raison que dans le bilan : jamais de calcul à partir de la valeur capturée par la fermeture.
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

    return (
      <main className="colonne pb-16 pt-8">
        <h1 className="text-[1.6rem]">Ce qui change</h1>

        {changements.length === 0 ? (
          <p className="mt-4 text-[1rem] text-encre/80">
            Rien à réécrire cette semaine. Ton plan tient tel quel.
          </p>
        ) : (
          <ul className="mt-5 flex flex-col gap-3">
            {changements.map((c, i) => (
              <li
                key={`${c.actionId}-${i}`}
                className={`border p-4 ${
                  c.type === 'montee' ? 'border-laiton' : 'border-encre/25'
                }`}
              >
                <p className="text-[0.98rem] text-encre/85">{c.texte}</p>
              </li>
            ))}
          </ul>
        )}

        {quatrieme ? (
          <>
            <Bande className="mt-12" />
            <section className="mt-8">
              <h2 className="text-[1.35rem]">Un mois plus tôt, tu écrivais ça</h2>
              <p className="mt-2 text-[0.9rem] text-encre/65">
                Mot pour mot, sans rien changer. C’est ton avant et ton après, dans ta langue.
              </p>

              {typeof frein === 'string' && frein.trim() ? (
                <figure className="mt-6 border-l-2 border-pale pl-4">
                  <figcaption className="text-[0.85rem] text-encre/55">
                    Ce qui t’arrêtait, le premier jour
                  </figcaption>
                  <blockquote className="mt-1 font-display text-[1.15rem] leading-snug">
                    {frein}
                  </blockquote>
                </figure>
              ) : null}

              {typeof vision === 'string' && vision.trim() ? (
                <figure className="mt-5 border-l-2 border-pale pl-4">
                  <figcaption className="text-[0.85rem] text-encre/55">
                    Ce que tu voulais voir changer
                  </figcaption>
                  <blockquote className="mt-1 font-display text-[1.15rem] leading-snug">
                    {vision}
                  </blockquote>
                </figure>
              ) : null}

              {reponse.trim() ? (
                <figure className="mt-8 border-l-2 border-laiton pl-4">
                  <figcaption className="text-[0.85rem] text-encre/55">
                    Ce que tu viens d’écrire, aujourd’hui
                  </figcaption>
                  <blockquote className="mt-1 font-display text-[1.15rem] leading-snug">
                    {reponse.trim()}
                  </blockquote>
                </figure>
              ) : null}

              <p className="mt-8 text-[0.95rem] text-encre/75">
                On ne va pas te dire si c’est bien. Relis les deux, et décide toi-même.
              </p>
            </section>
          </>
        ) : null}

        <div className="mt-10">
          <CarteTeinte
            titre={etat.profile.titre}
            semainesTenues={etat.progress.semaines.length}
          />
        </div>

        <div className="mt-8 flex flex-col gap-2">
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
      <main className="colonne pb-32 pt-8">
        <p className="text-[0.85rem] text-encre/55">Rituel de la semaine {semaine} · 2 sur 3</p>
        <h1 className="mt-4 text-[1.5rem]">{reflexion.texte}</h1>
        {reflexion.aide ? (
          <p className="mt-2 text-[0.92rem] text-encre/65">{reflexion.aide}</p>
        ) : null}

        <textarea
          rows={4}
          maxLength={280}
          value={reponse}
          onChange={(e) => setReponse(e.target.value)}
          placeholder="Deux lignes suffisent."
          aria-label={reflexion.texte}
          className="mt-5 w-full resize-y rounded-[2px] border border-encre/30 bg-transparent p-3 text-[1rem] leading-relaxed placeholder:text-encre/35 focus:border-encre"
        />
        <p className="mt-1 text-right text-[0.78rem] text-encre/50">{reponse.length} / 280</p>

        <div className="fixed inset-x-0 bottom-0 border-t border-encre/20 bg-coton">
          <div className="colonne flex items-center gap-3 py-3">
            <button
              type="button"
              onClick={() => setEtape('coches')}
              className="min-h-12 px-2 text-[0.92rem] text-encre/65 underline underline-offset-4"
            >
              Revenir
            </button>
            <Bouton className="flex-1" onClick={terminer}>
              Voir ce qui change
            </Bouton>
          </div>
        </div>
      </main>
    )
  }

  // ————————————————————————— 1. Ce que tu as fait —————————————————————————
  return (
    <main className="colonne pb-32 pt-8">
      <p className="text-[0.85rem] text-encre/55">Rituel de la semaine {semaine} · 1 sur 3</p>
      <h1 className="mt-4 text-[1.5rem]">Qu’est-ce que tu as fait cette semaine ?</h1>
      <p className="mt-2 text-[0.94rem] text-encre/70">
        Ce que tu n’as pas fait n’est pas un échec, et ne sera pas répété tel quel. Coche juste ce
        qui est vrai.
      </p>

      {actions.length === 0 ? (
        <p className="mt-6 border border-encre/25 p-4 text-[0.95rem] text-encre/70">
          Il n’y avait rien de prévu cette semaine. Tu peux passer à la question.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {actions.map((a) => {
            const def = action(a.actionId)
            const coche = selection.includes(a.actionId)
            return (
              <li key={a.actionId}>
                <button
                  type="button"
                  onClick={() => basculer(a.actionId)}
                  aria-pressed={coche}
                  className={`flex w-full items-start gap-3 border p-4 text-left transition-colors ${
                    coche ? 'border-cuve' : 'border-encre/25'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border ${
                      coche ? 'border-cuve bg-cuve text-coton' : 'border-encre/45'
                    }`}
                  >
                    {coche ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <polygon points="1,7 3,5 6,8 11,2 13,4 6,12" />
                      </svg>
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1rem] leading-snug">
                      {a.reduite ? def.versionReduite : def.titre}
                    </span>
                    <span className="mt-1 block text-[0.82rem] text-encre/55">
                      {coche ? 'Fait' : 'Pas cette semaine'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="fixed inset-x-0 bottom-0 border-t border-encre/20 bg-coton">
        <div className="colonne flex items-center gap-3 py-3">
          <LienBouton href="/aujourdhui" variante="discret">
            Plus tard
          </LienBouton>
          <Bouton className="flex-1" onClick={() => setEtape('question')}>
            Passer à la question
          </Bouton>
        </div>
      </div>
    </main>
  )
}

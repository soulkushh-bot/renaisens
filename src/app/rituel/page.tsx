'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CompteSemaines, Phenix } from '@/components/marque/Phenix'
import { Bouton, Carte, LienBouton } from '@/components/ui/base'
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
 * Le troisième temps rend une couleur de plus au phénix. C'est la récompense, et elle est visible :
 * un oiseau qui reprend vie, jamais une barre qui se remplit.
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
    const semaines = etat.progress.semaines.length

    return (
      <main className="pb-10">
        <section className="py-10" style={{ background: 'var(--color-rose-pale)' }}>
          <div className="colonne revelation flex flex-col items-center text-center">
            <Phenix taille={168} couches={semaines} />
            <div className="mt-6">
              <CompteSemaines couches={semaines} />
            </div>
          </div>
        </section>

        <div className="colonne mt-12">
          <h1 className="text-[2rem]">Ce qui change</h1>

          {changements.length === 0 ? (
            <p className="mt-5 text-[1.05rem] text-encre-douce">
              Rien à réécrire cette semaine. Ton plan tient tel quel.
            </p>
          ) : (
            <ul className="mt-7 flex flex-col gap-3">
              {changements.map((c, i) => (
                <li key={`${c.actionId}-${i}`}>
                  <Carte
                    className="p-5"
                    fond={c.type === 'montee' ? 'var(--color-tuile-menthe)' : undefined}
                  >
                    <p className="text-[1.02rem] text-encre">{c.texte}</p>
                  </Carte>
                </li>
              ))}
            </ul>
          )}
        </div>

        {quatrieme ? (
          <div className="colonne mt-16">
            <h2 className="text-[1.8rem]">Un mois plus tôt, tu écrivais ça</h2>
            <p className="mt-3 text-[0.98rem] text-encre-douce">
              Mot pour mot, sans rien changer. C’est ton avant et ton après, dans ta langue.
            </p>

            {typeof frein === 'string' && frein.trim() ? (
              <figure className="mt-8">
                <figcaption className="text-[0.88rem] font-semibold text-encre-douce">
                  Ce qui t’arrêtait, le premier jour
                </figcaption>
                <blockquote className="manuscrit mt-2 text-[1.7rem] text-foret">{frein}</blockquote>
              </figure>
            ) : null}

            {typeof vision === 'string' && vision.trim() ? (
              <figure className="mt-8">
                <figcaption className="text-[0.88rem] font-semibold text-encre-douce">
                  Ce que tu voulais voir changer
                </figcaption>
                <blockquote className="manuscrit mt-2 text-[1.7rem] text-foret">{vision}</blockquote>
              </figure>
            ) : null}

            {reponse.trim() ? (
              <figure className="mt-10">
                <figcaption className="text-[0.88rem] font-semibold text-encre-douce">
                  Ce que tu viens d’écrire, aujourd’hui
                </figcaption>
                <blockquote className="manuscrit mt-2 text-[1.7rem] text-magenta">
                  {reponse.trim()}
                </blockquote>
              </figure>
            ) : null}

            <p className="mt-10 text-[1rem] text-encre-douce">
              On ne va pas te dire si c’est bien. Relis les deux, et décide toi-même.
            </p>
          </div>
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
        <h1 className="text-[1.9rem]">{reflexion.texte}</h1>
        {reflexion.aide ? (
          <p className="mt-3 text-[1rem] text-encre-douce">{reflexion.aide}</p>
        ) : null}
        <p className="chiffres mt-4 text-[0.88rem] font-semibold text-encre-douce">
          Rituel de la semaine {semaine} · 2 sur 3
        </p>

        <textarea
          rows={4}
          maxLength={280}
          value={reponse}
          onChange={(e) => setReponse(e.target.value)}
          placeholder="Deux lignes suffisent."
          aria-label={reflexion.texte}
          className="mt-7 w-full resize-y rounded-[0.8rem] border-2 bg-white p-4 text-[1.05rem] leading-relaxed text-encre placeholder:text-encre-douce/60"
          style={{ borderColor: '#eadfd8' }}
        />
        <p className="chiffres mt-1.5 text-right text-[0.82rem] text-encre-douce">
          {reponse.length} / 280
        </p>

        <div
          className="fixed inset-x-0 bottom-0 z-20 border-t bg-white"
          style={{ borderColor: '#efe4dd' }}
        >
          <div className="colonne flex items-center gap-3 py-3">
            <button
              type="button"
              onClick={() => setEtape('coches')}
              className="min-h-12 px-2 text-[0.94rem] font-semibold text-encre-douce underline"
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
    <main className="colonne pb-36 pt-9">
      <h1 className="text-[1.9rem]">Qu’est-ce que tu as fait cette semaine ?</h1>
      <p className="mt-3 text-[1rem] text-encre-douce">
        Ce que tu n’as pas fait n’est pas un échec, et ne sera pas répété tel quel. Coche juste ce
        qui est vrai.
      </p>
      <p className="chiffres mt-4 text-[0.88rem] font-semibold text-encre-douce">
        Rituel de la semaine {semaine} · 1 sur 3
      </p>

      {actions.length === 0 ? (
        <Carte className="mt-7 p-5">
          <p className="text-[1rem] text-encre-douce">
            Il n’y avait rien de prévu cette semaine. Tu peux passer à la question.
          </p>
        </Carte>
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
                  className="flex w-full items-start gap-3.5 rounded-[1.15rem] border-2 p-5 text-left transition-colors"
                  style={{
                    borderColor: coche ? 'var(--color-icone-vert)' : '#eadfd8',
                    background: coche ? 'var(--color-tuile-menthe)' : '#ffffff',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: coche ? 'var(--color-icone-vert)' : '#cfc4bd',
                      background: coche ? 'var(--color-icone-vert)' : '#ffffff',
                    }}
                  >
                    {coche ? (
                      <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
                        <path
                          d="M4 9.5 7.5 13 14 5"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.05rem] leading-snug text-encre">
                      {a.reduite ? def.versionReduite : def.titre}
                    </span>
                    <span className="mt-1.5 block text-[0.86rem] font-semibold text-encre-douce">
                      {coche ? 'Fait' : 'Pas cette semaine'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div
        className="fixed inset-x-0 bottom-0 z-20 border-t bg-white"
        style={{ borderColor: '#efe4dd' }}
      >
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

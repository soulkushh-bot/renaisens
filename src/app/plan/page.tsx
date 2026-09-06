'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BlocPlus } from '@/components/app/BlocPlus'
import { CarteAction } from '@/components/app/CarteAction'
import { Carte, LienBouton } from '@/components/ui/base'
import { action } from '@/content/actions'
import { semaineCourante, useEtat } from '@/lib/etat'

/**
 * Le plan : trente jours détaillés, quatre-vingt-dix jours esquissés, un an en une phrase.
 *
 * La semaine en cours porte une étiquette écrite, pas seulement une couleur.
 */
export default function PagePlan() {
  const router = useRouter()
  const { pret, etat, basculerAction } = useEtat()

  useEffect(() => {
    if (pret && !etat) router.replace('/')
  }, [pret, etat, router])

  if (!pret || !etat) {
    return (
      <main className="colonne py-20">
        <p className="text-encre-douce">Un instant…</p>
      </main>
    )
  }

  const { plan, progress } = etat
  const courante = semaineCourante(etat)

  return (
    <main className="pb-8">
      <div className="colonne pt-9">
        <h1 className="text-[2.2rem]">Ton plan de trente jours</h1>
        <p className="mt-4 text-[1.05rem] text-encre-douce">
          Trois actions par semaine au maximum, une seule prioritaire. Ce n’est pas peu : c’est ce
          qui tient quand la semaine se passe mal.
        </p>

        <div className="mt-10 flex flex-col gap-11">
          {plan.semaines.map((s) => {
            const active = s.index === courante
            const passee = s.index < courante
            return (
              <section key={s.index}>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="chiffres text-[1.5rem]">Semaine {s.index}</h2>
                  {active ? (
                    <span
                      className="rounded-full px-3 py-1 text-[0.76rem] font-bold uppercase text-white"
                      style={{ background: 'var(--color-prune)' }}
                    >
                      en cours
                    </span>
                  ) : null}
                  {passee ? (
                    <span className="text-[0.8rem] font-semibold text-encre-douce">passée</span>
                  ) : null}
                </div>
                <p className="mb-4 mt-2 text-[1rem] text-encre-douce">{s.intention}</p>

                {s.actions.length === 0 ? (
                  <Carte className="p-5">
                    <p className="text-[0.98rem] text-encre-douce">
                      Rien de prévu pour l’instant. Cette semaine se remplira au prochain rituel,
                      avec ce que tu n’auras pas eu le temps de faire.
                    </p>
                  </Carte>
                ) : (
                  <div className="flex flex-col gap-3">
                    {s.actions.map((a) => (
                      <CarteAction
                        key={a.actionId}
                        planifiee={a}
                        faite={progress.faites.includes(a.actionId)}
                        onBasculer={active ? () => basculerAction(a.actionId) : undefined}
                        detaillee={active}
                      />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>

      <section className="mt-16 py-12" style={{ background: 'var(--color-tuile-lavande)' }}>
        <div className="colonne">
          <h2 className="text-[1.8rem]">Après les trente jours</h2>
          <p className="mt-3 text-[0.98rem] text-encre-douce">
            Esquissé, pas figé. Ces jalons se réécriront à partir de ce que tu auras réellement fait.
          </p>
          <ul className="mt-8 flex flex-col gap-7">
            {plan.jalons90.map((j) => (
              <li key={j.jour}>
                <p className="chiffres font-display text-[1.15rem] font-bold text-prune">
                  Jour {j.jour} — {j.titre}
                </p>
                {j.actionIds.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {j.actionIds.map((id) => (
                      <li key={id} className="flex gap-3 text-[1rem] text-encre">
                        <span
                          aria-hidden="true"
                          className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: 'var(--color-magenta)' }}
                        />
                        <span>{action(id).titre}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[1rem] text-encre-douce">{j.detail}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="colonne mt-14">
        <h2 className="text-[1.8rem]">Dans un an</h2>
        <p className="manuscrit mt-4 text-[1.9rem] text-magenta">{plan.horizon}</p>
        <p className="mt-4 text-[0.92rem] text-encre-douce">
          Ta phrase, écrite le premier jour. On ne l’a pas reformulée.
        </p>
      </div>

      {plan.historique.length > 0 ? (
        <div className="colonne mt-16">
          <h2 className="text-[1.8rem]">Ce que ton plan a changé</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {[...plan.historique].reverse().map((c, i) => (
              <li key={`${c.revision}-${c.actionId}-${i}`}>
                <Carte className="p-5">
                  <p className="text-[0.99rem] text-encre">{c.texte}</p>
                  <p className="chiffres mt-2 text-[0.82rem] text-encre-douce">
                    Révision {c.revision}
                  </p>
                </Carte>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="colonne mt-14">
        <LienBouton href="/rituel" variante="contour" className="w-full">
          Faire le rituel de la semaine {courante}
        </LienBouton>
      </div>

      <div className="colonne mt-12">
        <BlocPlus />
      </div>
    </main>
  )
}

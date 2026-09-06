'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BlocPlus } from '@/components/app/BlocPlus'
import { CarteAction } from '@/components/app/CarteAction'
import { action } from '@/content/actions'
import { Bande, LienBouton } from '@/components/ui/base'
import { semaineCourante, useEtat } from '@/lib/etat'

/**
 * Le plan : trente jours détaillés, quatre-vingt-dix jours esquissés, un an en une phrase.
 *
 * L'historique des réécritures est affiché en bas, en clair. C'est ce qui prouve que le plan est
 * vivant : elle peut voir que ce qu'elle a coché — ou pas coché — a changé quelque chose.
 */
export default function PagePlan() {
  const router = useRouter()
  const { pret, etat, basculerAction } = useEtat()

  useEffect(() => {
    if (pret && !etat) router.replace('/')
  }, [pret, etat, router])

  if (!pret || !etat) {
    return (
      <main className="colonne py-16">
        <p className="text-encre/60">Un instant…</p>
      </main>
    )
  }

  const { plan, progress } = etat
  const courante = semaineCourante(etat)

  return (
    <main className="colonne pb-16 pt-8">
      <h1 className="text-[1.7rem]">Ton plan de trente jours</h1>
      <p className="mt-2 text-[0.95rem] text-encre/70">
        Trois actions par semaine au maximum, une seule prioritaire. Ce n’est pas peu : c’est ce qui
        tient quand la semaine se passe mal.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {plan.semaines.map((s) => {
          const active = s.index === courante
          const passee = s.index < courante
          return (
            <section key={s.index}>
              <header className="mb-3 flex items-baseline justify-between gap-3">
                <h2 className="text-[1.2rem]">
                  Semaine {s.index}
                  {active ? <span className="ml-2 text-[0.82rem] text-laiton">en cours</span> : null}
                </h2>
                {passee ? <span className="text-[0.8rem] text-encre/50">passée</span> : null}
              </header>
              <p className="mb-3 text-[0.95rem] text-encre/75">{s.intention}</p>

              {s.actions.length === 0 ? (
                <p className="border border-encre/20 p-4 text-[0.92rem] text-encre/60">
                  Rien de prévu pour l’instant. Cette semaine se remplira au prochain rituel, avec ce
                  que tu n’auras pas eu le temps de faire.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
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

      <Bande className="mt-12" />

      <section className="mt-8">
        <h2 className="text-[1.3rem]">Après les trente jours</h2>
        <p className="mt-2 text-[0.9rem] text-encre/65">
          Esquissé, pas figé. Ces jalons se réécriront à partir de ce que tu auras réellement fait.
        </p>
        <ul className="mt-5 flex flex-col gap-4">
          {plan.jalons90.map((j) => (
            <li key={j.jour} className="border-l-2 border-air pl-4">
              <p className="font-display text-[1.05rem]">
                Jour {j.jour} — {j.titre}
              </p>
              {j.actionIds.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-1.5">
                  {j.actionIds.map((id) => (
                    <li key={id} className="flex gap-2.5 text-[0.94rem] text-encre/75">
                      <span aria-hidden="true" className="mt-2 block h-1.5 w-1.5 shrink-0 bg-air" />
                      <span>{action(id).titre}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-[0.94rem] text-encre/75">{j.detail}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-[1.3rem]">Dans un an</h2>
        <p className="mt-3 border-l-2 border-laiton pl-4 font-display text-[1.2rem] leading-snug">
          {plan.horizon}
        </p>
        <p className="mt-3 text-[0.85rem] text-encre/55">
          Ta phrase, écrite le premier jour. On ne l’a pas reformulée.
        </p>
      </section>

      {plan.historique.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-[1.3rem]">Ce que ton plan a changé</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {[...plan.historique].reverse().map((c, i) => (
              <li key={`${c.revision}-${c.actionId}-${i}`} className="border border-encre/20 p-3">
                <p className="text-[0.94rem] text-encre/85">{c.texte}</p>
                <p className="mt-1 text-[0.78rem] text-encre/50">Révision {c.revision}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-12">
        <LienBouton href="/rituel" variante="second" className="w-full">
          Faire le rituel de la semaine {courante}
        </LienBouton>
      </div>

      <div className="mt-10">
        <BlocPlus />
      </div>
    </main>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BlocPlus } from '@/components/app/BlocPlus'
import { CarteAction } from '@/components/app/CarteAction'
import { BandeDecoupee, Couche, FeuilleDecoupee } from '@/components/marque/Papier'
import { LienBouton } from '@/components/ui/base'
import { action } from '@/content/actions'
import { semaineCourante, useEtat } from '@/lib/etat'

/**
 * Le plan : trente jours détaillés, quatre-vingt-dix jours esquissés, un an en une phrase.
 *
 * La semaine en cours est découpée dans un papier différent — la couleur n'est pas seule à le dire,
 * il y a aussi le mot « en cours » et la position dans la pile.
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
        <p className="text-encre/60">Un instant…</p>
      </main>
    )
  }

  const { plan, progress } = etat
  const courante = semaineCourante(etat)

  return (
    <main className="pb-6">
      <div className="colonne pt-9">
        <h1 className="decoupe uppercase text-[2.3rem]">Ton plan de trente jours</h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-encre/80">
          Trois actions par semaine au maximum, une seule prioritaire. Ce n’est pas peu : c’est ce
          qui tient quand la semaine se passe mal.
        </p>

        <div className="mt-10 flex flex-col gap-11">
          {plan.semaines.map((s) => {
            const active = s.index === courante
            const passee = s.index < courante
            return (
              <section key={s.index}>
                <div className="flex items-baseline gap-3">
                  <h2 className="decoupe uppercase chiffres text-[1.5rem]">Semaine {s.index}</h2>
                  {active ? (
                    <span
                      className="couche coupe px-2.5 py-1 font-display text-[0.75rem] font-bold uppercase text-encre"
                      style={{ ['--teinte' as never]: 'var(--color-souci)' }}
                    >
                      en cours
                    </span>
                  ) : null}
                  {passee ? (
                    <span className="font-display text-[0.75rem] font-bold uppercase text-encre/45">
                      passée
                    </span>
                  ) : null}
                </div>
                <p className="mb-4 mt-2 text-[1rem] text-encre/75">{s.intention}</p>

                {s.actions.length === 0 ? (
                  <Couche teinte="papier-clair" className="p-5">
                    <p className="text-[0.96rem] text-encre/70">
                      Rien de prévu pour l’instant. Cette semaine se remplira au prochain rituel,
                      avec ce que tu n’auras pas eu le temps de faire.
                    </p>
                  </Couche>
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

      <BandeDecoupee teinte="feuille" className="mt-16" />

      <Couche teinte="feuille" coupe={false} className="pb-14 pt-10">
        <div className="colonne">
          <h2 className="decoupe uppercase text-[1.9rem] text-papier-clair">Après les trente jours</h2>
          <p className="mt-3 text-[0.96rem] text-papier-clair/80">
            Esquissé, pas figé. Ces jalons se réécriront à partir de ce que tu auras réellement fait.
          </p>
          <ul className="mt-8 flex flex-col gap-7">
            {plan.jalons90.map((j) => (
              <li key={j.jour}>
                <p className="decoupe chiffres text-[1.15rem] text-souci">
                  Jour {j.jour} — {j.titre}
                </p>
                {j.actionIds.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {j.actionIds.map((id) => (
                      <li key={id} className="flex gap-3 text-[1rem] text-papier-clair/95">
                        <FeuilleDecoupee taille={16} teinte="souci" className="mt-1 shrink-0" />
                        <span>{action(id).titre}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[1rem] text-papier-clair/90">{j.detail}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Couche>

      <div className="colonne mt-14">
        <h2 className="decoupe uppercase text-[1.9rem]">Dans un an</h2>
        <p className="decoupe mt-4 text-[1.5rem] leading-[1.15] text-indigo">{plan.horizon}</p>
        <p className="mt-4 text-[0.9rem] text-encre/65">
          Ta phrase, écrite le premier jour. On ne l’a pas reformulée.
        </p>
      </div>

      {plan.historique.length > 0 ? (
        <div className="colonne mt-16">
          <h2 className="decoupe uppercase text-[1.9rem]">Ce que ton plan a changé</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {[...plan.historique].reverse().map((c, i) => (
              <li key={`${c.revision}-${c.actionId}-${i}`}>
                <Couche teinte="papier-clair" className="p-4">
                  <p className="text-[0.99rem] leading-relaxed text-encre/85">{c.texte}</p>
                  <p className="chiffres mt-2 text-[0.8rem] text-encre/50">Révision {c.revision}</p>
                </Couche>
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

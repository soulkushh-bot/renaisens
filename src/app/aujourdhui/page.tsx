'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CarteAction } from '@/components/app/CarteAction'
import { CompteSemaines, Phenix } from '@/components/marque/Phenix'
import { LienBouton } from '@/components/ui/base'
import { semaineDuPlan } from '@/lib/engine/plan'
import { semaineCourante, useEtat } from '@/lib/etat'

/**
 * Le point de retour quotidien — mode Operate.
 *
 * Une seule chose au-dessus de la ligne : l'action prioritaire de la semaine. Le reste est en
 * dessous, plus petit.
 *
 * Quand tout est fait, l'écran ne propose RIEN. Ne rien avoir à faire est un état légitime, pas un
 * vide à remplir avec un badge ou une suggestion.
 *
 * À partir de 1024 px l'écran se compose en deux : la semaine à gauche, le phénix et l'entrée du
 * rituel à droite, collés en haut. Sous ce seuil, la bande rose reste en pleine largeur au bas de
 * la page — c'est la même page, pas une variante de bureau plaquée par-dessus.
 */
export default function Aujourdhui() {
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

  const courante = semaineCourante(etat)
  const semaine = semaineDuPlan(etat.plan, courante)
  const actions = semaine?.actions ?? []
  const restantes = actions.filter((a) => !etat.progress.faites.includes(a.actionId))
  const prioritaire = restantes.find((a) => a.prioritaire) ?? restantes[0]
  const autres = restantes.filter((a) => a.actionId !== prioritaire?.actionId)
  const faites = actions.filter((a) => etat.progress.faites.includes(a.actionId))
  const suivante = semaineDuPlan(etat.plan, courante + 1)

  return (
    <main className="pb-8 lg:mx-auto lg:grid lg:max-w-[74rem] lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10 lg:px-9 lg:pt-10">
      <div className="colonne-app pt-9 lg:max-w-none lg:px-0 lg:pt-0">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="chiffres text-[2.1rem]">Semaine {courante}</h1>
          <Link href="/plan" className="text-[0.95rem] font-semibold text-magenta">
            Tout le plan
          </Link>
        </div>
        {semaine ? (
          <p className="mt-3 text-[1.08rem] text-encre-douce">{semaine.intention}</p>
        ) : null}

        <div className="mt-8">
          {prioritaire ? (
            <CarteAction
              planifiee={prioritaire}
              faite={false}
              onBasculer={() => basculerAction(prioritaire.actionId)}
            />
          ) : (
            <div className="carte-douce p-7" style={{ background: 'var(--color-tuile-menthe)' }}>
              <h2 className="text-[1.5rem]">Tu n’as rien à faire aujourd’hui.</h2>
              <p className="mt-3 text-[1.02rem] text-encre">
                Tout ce qui était prévu pour cette semaine est fait. Ne rien avoir à faire fait
                partie du plan — ce n’est pas un vide à remplir.
              </p>
              {suivante ? (
                <p className="mt-5 text-[0.98rem] text-encre-douce">
                  La semaine prochaine : {suivante.intention.replace(/^Cette semaine, /, '')}
                </p>
              ) : null}
            </div>
          )}
        </div>

        {autres.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-[1.2rem]">Le reste de la semaine</h2>
            <div className="mt-4 flex flex-col gap-3">
              {autres.map((a) => (
                <CarteAction
                  key={a.actionId}
                  planifiee={a}
                  faite={false}
                  detaillee={false}
                  onBasculer={() => basculerAction(a.actionId)}
                />
              ))}
            </div>
          </section>
        ) : null}

        {faites.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-[1.2rem]">Déjà fait cette semaine</h2>
            <div className="mt-4 flex flex-col gap-3">
              {faites.map((a) => (
                <CarteAction
                  key={a.actionId}
                  planifiee={a}
                  faite
                  detaillee={false}
                  onBasculer={() => basculerAction(a.actionId)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <section
        className="mt-14 py-10 lg:sticky lg:top-8 lg:mt-0 lg:rounded-[1.4rem] lg:py-8"
        style={{ background: 'var(--color-rose-pale)' }}
      >
        <div className="colonne lg:max-w-none lg:px-7">
          <div className="flex items-center gap-5">
            <Phenix taille={104} couches={etat.progress.semaines.length} className="shrink-0" />
            <div>
              <p className="font-display text-[1.25rem] font-bold leading-snug text-foret">
                {etat.profile.titre}
              </p>
              <div className="mt-3">
                <CompteSemaines couches={etat.progress.semaines.length} />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <LienBouton href="/rituel" className="w-full">
              Faire le rituel de la semaine {courante}
            </LienBouton>
            <p className="mt-4 text-center text-[0.92rem] text-encre-douce">
              Trois minutes. Une fois par semaine, quand tu peux.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

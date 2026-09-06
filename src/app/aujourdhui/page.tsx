'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { CarteAction } from '@/components/app/CarteAction'
import { CarteTeinte } from '@/components/marque/CarteTeinte'
import { Bande, LienBouton } from '@/components/ui/base'
import { semaineDuPlan } from '@/lib/engine/plan'
import { semaineCourante, useEtat } from '@/lib/etat'

/**
 * Le point de retour quotidien.
 *
 * Une seule chose au-dessus de la ligne : l'action prioritaire de la semaine. Le reste est en
 * dessous, plus petit.
 *
 * Quand tout est fait, l'écran ne propose RIEN. Ne rien avoir à faire est un état légitime, pas un
 * vide à remplir avec un badge ou une suggestion. C'est ce qui distingue ce produit d'une app qui
 * cherche à te garder à l'écran.
 */
export default function Aujourdhui() {
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

  const courante = semaineCourante(etat)
  const semaine = semaineDuPlan(etat.plan, courante)
  const actions = semaine?.actions ?? []
  const restantes = actions.filter((a) => !etat.progress.faites.includes(a.actionId))
  const prioritaire = restantes.find((a) => a.prioritaire) ?? restantes[0]
  const autres = restantes.filter((a) => a.actionId !== prioritaire?.actionId)
  const faites = actions.filter((a) => etat.progress.faites.includes(a.actionId))
  const suivante = semaineDuPlan(etat.plan, courante + 1)

  return (
    <main className="colonne pb-16 pt-8">
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-[1.6rem]">Semaine {courante}</h1>
        <Link href="/plan" className="text-[0.88rem] underline underline-offset-4">
          Tout le plan
        </Link>
      </div>
      {semaine ? <p className="mt-2 text-[1rem] text-encre/75">{semaine.intention}</p> : null}

      {prioritaire ? (
        <section className="mt-7">
          <CarteAction
            planifiee={prioritaire}
            faite={false}
            onBasculer={() => basculerAction(prioritaire.actionId)}
          />
        </section>
      ) : (
        <section className="mt-7 border border-encre/25 p-5">
          <h2 className="text-[1.2rem]">Tu n’as rien à faire aujourd’hui.</h2>
          <p className="mt-2 text-[0.98rem] text-encre/80">
            Tout ce qui était prévu pour cette semaine est fait. Ne rien avoir à faire fait partie du
            plan — ce n’est pas un vide à remplir.
          </p>
          {suivante ? (
            <p className="mt-4 border-l-2 border-air pl-4 text-[0.94rem] text-encre/75">
              La semaine prochaine : {suivante.intention.replace(/^Cette semaine, /, '')}
            </p>
          ) : null}
        </section>
      )}

      {autres.length > 0 ? (
        <>
          <Bande className="mt-10" />
          <section className="mt-6">
            <h2 className="text-[1.05rem] text-encre/70">Le reste de la semaine</h2>
            <div className="mt-3 flex flex-col gap-2">
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
        </>
      ) : null}

      {faites.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-[1.05rem] text-encre/70">Déjà fait cette semaine</h2>
          <div className="mt-3 flex flex-col gap-2">
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

      <div className="mt-10">
        <CarteTeinte
          titre={etat.profile.titre}
          semainesTenues={etat.progress.semaines.length}
        />
      </div>

      <div className="mt-8">
        <LienBouton href="/rituel" variante="second" className="w-full">
          Faire le rituel de la semaine {courante}
        </LienBouton>
        <p className="mt-3 text-center text-[0.85rem] text-encre/60">
          Trois minutes. Une fois par semaine, quand tu peux.
        </p>
      </div>
    </main>
  )
}

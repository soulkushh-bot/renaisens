'use client'

import { action } from '@/content/actions'
import type { PlannedAction } from '@/types'

/**
 * Une action du plan.
 *
 * Quand `reduite` est vrai, c'est la version réduite qui s'affiche — pas la version d'origine barrée.
 * Elle ne doit pas relire chaque semaine ce qu'elle n'a pas réussi à faire ; elle doit lire ce
 * qu'elle peut faire cette semaine-ci.
 *
 * Le « non fait » n'a pas de rouge, pas d'icône d'alerte, pas de compteur. Le produit doit être plus
 * indulgent qu'une app de fitness, sinon elle ne revient pas en semaine 2.
 */
export function CarteAction({
  planifiee,
  faite,
  onBasculer,
  detaillee = true,
}: {
  planifiee: PlannedAction
  faite: boolean
  onBasculer?: () => void
  detaillee?: boolean
}) {
  const a = action(planifiee.actionId)
  const titre = planifiee.reduite ? a.versionReduite : a.titre

  return (
    <article
      className={`border border-encre/25 bg-coton ${
        planifiee.prioritaire ? 'border-l-[3px] border-l-laiton' : ''
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {onBasculer ? (
          <button
            type="button"
            onClick={onBasculer}
            aria-pressed={faite}
            aria-label={faite ? `Décocher : ${titre}` : `Marquer comme fait : ${titre}`}
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border transition-colors ${
              faite ? 'border-cuve bg-cuve text-coton' : 'border-encre/45 hover:border-encre'
            }`}
          >
            {faite ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <polygon points="1,7 3,5 6,8 11,2 13,4 6,12" />
              </svg>
            ) : null}
          </button>
        ) : (
          <span
            aria-hidden="true"
            className="mt-1.5 block h-2.5 w-2.5 shrink-0 border border-encre/40"
          />
        )}

        <div className="min-w-0 flex-1">
          {planifiee.prioritaire ? (
            <p className="mb-1 text-[0.78rem] text-laiton">L’action prioritaire de la semaine</p>
          ) : null}

          <p className={`text-[1rem] leading-snug ${faite ? 'text-encre/45 line-through' : ''}`}>
            {titre}
          </p>

          {detaillee ? (
            <p className="mt-2 text-[0.9rem] text-encre/70">{a.pourquoi}</p>
          ) : null}

          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] text-encre/55">
            <span>{a.effortMinutes} min</span>
            {a.ceSoir ? <span className="text-air">Faisable ce soir</span> : null}
            {planifiee.reduite ? <span>Version allégée</span> : null}
          </p>
        </div>
      </div>
    </article>
  )
}

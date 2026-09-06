'use client'

import { action } from '@/content/actions'
import type { PlannedAction } from '@/types'

/**
 * Une action du plan.
 *
 * L'action prioritaire porte une étiquette pleine ET un fond rose pâle : deux signaux, jamais la
 * couleur seule. Pas de filet coloré sur le bord gauche — c'est le tic d'interface qu'on refuse.
 *
 * Quand `reduite` est vrai, c'est la version réduite qui s'affiche, jamais la version d'origine
 * barrée : elle ne doit pas relire chaque semaine ce qu'elle n'a pas réussi à faire.
 *
 * Le « pas fait » n'a ni rouge, ni alerte, ni compteur.
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
      className="carte p-5"
      style={planifiee.prioritaire ? { background: 'var(--color-rose-pale)' } : undefined}
    >
      {planifiee.prioritaire ? (
        <p
          className="mb-3 inline-block rounded-full px-3 py-1 text-[0.78rem] font-bold uppercase tracking-[0.02em] text-white"
          style={{ background: 'var(--color-prune)' }}
        >
          Ton action prioritaire
        </p>
      ) : null}

      <div className="flex items-start gap-3.5">
        {onBasculer ? (
          <button
            type="button"
            onClick={onBasculer}
            aria-pressed={faite}
            aria-label={faite ? `Décocher : ${titre}` : `Marquer comme fait : ${titre}`}
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
            style={{
              borderColor: faite ? 'var(--color-icone-vert)' : '#cfc4bd',
              background: faite ? 'var(--color-icone-vert)' : '#ffffff',
            }}
          >
            {faite ? (
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
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
          </button>
        ) : (
          <span
            aria-hidden="true"
            className="mt-1.5 block h-4 w-4 shrink-0 rounded-full border-2"
            style={{ borderColor: '#cfc4bd' }}
          />
        )}

        <div className="min-w-0 flex-1">
          <p
            className={`text-[1.06rem] leading-snug ${
              faite ? 'text-encre-douce line-through' : 'text-encre'
            }`}
          >
            {titre}
          </p>

          {detaillee ? <p className="mt-2.5 text-[0.95rem] text-encre-douce">{a.pourquoi}</p> : null}

          <p className="chiffres mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.86rem] text-encre-douce">
            <span>{a.effortMinutes} min</span>
            {a.ceSoir ? (
              <span className="font-semibold text-magenta">Faisable ce soir</span>
            ) : null}
            {planifiee.reduite ? <span>Version allégée</span> : null}
          </p>
        </div>
      </div>
    </article>
  )
}

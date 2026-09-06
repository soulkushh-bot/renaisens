'use client'

import { PetiteFleur } from '@/components/marque/Papier'
import { action } from '@/content/actions'
import type { PlannedAction } from '@/types'

/**
 * Une action du plan, découpée dans son papier.
 *
 * L'action prioritaire n'est pas signalée par un filet de couleur sur son bord gauche — c'est le
 * tic d'interface qu'on refuse ici. Elle est découpée dans un AUTRE PAPIER : la feuille entière
 * change de couleur. On la repère avant de l'avoir lue.
 *
 * Quand `reduite` est vrai, c'est la version réduite qui s'affiche — jamais la version d'origine
 * barrée. Elle ne doit pas relire chaque semaine ce qu'elle n'a pas réussi à faire.
 *
 * Le « pas fait » n'a ni rouge, ni alerte, ni compteur. Le produit doit être plus indulgent qu'une
 * app de fitness, sinon elle ne revient pas en semaine 2.
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
  const teinte = planifiee.prioritaire ? 'var(--color-souci)' : 'var(--color-papier-clair)'

  return (
    <article
      className="couche coupe p-5"
      style={{ ['--teinte' as never]: teinte }}
    >
      {planifiee.prioritaire ? (
        <p className="mb-2.5 flex items-center gap-2 font-display text-[0.86rem] font-bold uppercase tracking-[-0.01em] text-encre">
          <PetiteFleur taille={16} petale="corail" coeur="papier-clair" />
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
            className="couche coupe mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center transition-colors"
            style={{
              ['--teinte' as never]: faite ? 'var(--color-feuille)' : 'var(--color-papier)',
            }}
          >
            {faite ? (
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  d="M2 9 L7 14 L16 3"
                  fill="none"
                  stroke="var(--color-papier-clair)"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </button>
        ) : (
          <span
            aria-hidden="true"
            className="mt-1.5 block h-3.5 w-3.5 shrink-0 border-2 border-encre/35"
          />
        )}

        <div className="min-w-0 flex-1">
          <p
            className={`text-[1.08rem] leading-snug ${faite ? 'text-encre/45 line-through' : 'text-encre'}`}
          >
            {titre}
          </p>

          {detaillee ? <p className="mt-2.5 text-[0.95rem] text-encre/75">{a.pourquoi}</p> : null}

          <p className="chiffres mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.85rem] text-encre/65">
            <span>{a.effortMinutes} min</span>
            {a.ceSoir ? (
              <span className="flex items-center gap-1.5">
                <span aria-hidden="true" className="block h-2 w-2 bg-corail" />
                Faisable ce soir
              </span>
            ) : null}
            {planifiee.reduite ? <span>Version allégée</span> : null}
          </p>
        </div>
      </div>
    </article>
  )
}

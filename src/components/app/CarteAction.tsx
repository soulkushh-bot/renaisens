'use client'

import { action } from '@/content/actions'
import type { PlannedAction } from '@/types'

/**
 * Une action du plan, découpée dans son papier.
 *
 * L'action prioritaire est signalée de deux façons, jamais par un filet de couleur sur son bord
 * gauche — c'est le tic d'interface qu'on refuse. Elle est découpée dans un AUTRE PAPIER, et elle
 * porte un onglet de papier collé qui DÉBORDE de la carte par le haut. L'onglet n'est pas un
 * intertitre posé au-dessus du contenu : c'est un morceau de papier qui recouvre le bord, comme sur
 * un dossier qu'on a marqué.
 *
 * Quand `reduite` est vrai, c'est la version réduite qui s'affiche — jamais la version d'origine
 * barrée. Elle ne doit pas relire chaque semaine ce qu'elle n'a pas réussi à faire.
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
  const teinte = planifiee.prioritaire ? 'var(--color-souci)' : 'var(--color-papier-clair)'

  return (
    <div className={planifiee.prioritaire ? 'pt-4' : undefined}>
      {planifiee.prioritaire ? (
        <p
          className="couche coupe-petit recouvre ml-4 inline-block px-3 py-1.5 font-display text-[0.8rem] font-bold uppercase tracking-[-0.01em] text-papier-clair"
          style={{ ['--teinte' as never]: 'var(--color-corail)' }}
        >
          Ton action prioritaire
        </p>
      ) : null}

      <article
        className={`couche coupe p-5 ${planifiee.prioritaire ? '-mt-3' : ''}`}
        style={{ ['--teinte' as never]: teinte }}
      >
        <div className={`flex items-start gap-3.5 ${planifiee.prioritaire ? 'pt-2' : ''}`}>
          {onBasculer ? (
            <button
              type="button"
              onClick={onBasculer}
              aria-pressed={faite}
              aria-label={faite ? `Décocher : ${titre}` : `Marquer comme fait : ${titre}`}
              className="coupe-petit relative mt-0.5 block h-9 w-9 shrink-0"
              style={{
                background: faite ? 'var(--color-feuille)' : 'var(--color-kraft)',
              }}
            >
              {faite ? (
                <svg viewBox="0 0 36 36" className="absolute inset-0" aria-hidden="true">
                  <path
                    d="M8 18.5 L15 25.5 L28 10"
                    fill="none"
                    stroke="var(--color-papier-clair)"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </button>
          ) : (
            <span
              aria-hidden="true"
              className="coupe-petit mt-1 block h-5 w-5 shrink-0"
              style={{ background: 'var(--color-kraft)' }}
            />
          )}

          <div className="min-w-0 flex-1">
            <p
              className={`text-[1.08rem] leading-snug ${faite ? 'text-encre-douce line-through' : 'text-encre'}`}
            >
              {titre}
            </p>

            {detaillee ? <p className="mt-2.5 text-[0.95rem] text-encre-douce">{a.pourquoi}</p> : null}

            <p className="chiffres mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.85rem] text-encre-douce">
              <span>{a.effortMinutes} min</span>
              {a.ceSoir ? (
                <span className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="coupe-petit block h-2.5 w-2.5"
                    style={{ background: 'var(--color-corail)' }}
                  />
                  Faisable ce soir
                </span>
              ) : null}
              {planifiee.reduite ? <span>Version allégée</span> : null}
            </p>
          </div>
        </div>
      </article>
    </div>
  )
}

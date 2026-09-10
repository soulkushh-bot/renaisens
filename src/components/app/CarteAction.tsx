'use client'

import { action } from '@/content/actions'
import type { PlannedAction } from '@/types'

/**
 * Une action du plan.
 *
 * LA COCHE EST L'ÉLÉMENT PREMIER DE SA LIGNE. C'est le seul geste dont dépend le chiffre de succès
 * du produit — le pourcentage de femmes qui font le rituel de la semaine 2. Elle fait 48 px, son
 * bord au repos est un prune désaturé à 3,85:1 sur blanc, et elle est posée avant le texte. Une
 * case de 36 px cerclée de gris à 2:1 était l'objet le plus pâle de sa ligne : exactement l'inverse.
 *
 * L'ACTION PRIORITAIRE ne porte pas d'étiquette en capitales au-dessus de son titre. Elle se
 * signale par trois choses qui ne sont pas des couleurs seules : le fond rose pâle, un titre plus
 * grand en display, et une phrase qui le dit en toutes lettres.
 *
 * La coche en lecture seule — les semaines passées — montre l'état RÉEL. Un titre barré à côté
 * d'un anneau vide dit deux choses opposées, et c'est l'anneau qu'on croit.
 *
 * Quand `reduite` est vrai, c'est la version réduite qui s'affiche, jamais la version d'origine
 * barrée : elle ne doit pas relire chaque semaine ce qu'elle n'a pas réussi à faire.
 *
 * Le « pas fait » n'a ni rouge, ni alerte, ni compteur.
 */

const COCHE = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2'

function Coche({ faite }: { faite: boolean }) {
  return faite ? (
    <svg width="22" height="22" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M4 9.5 7.5 13 14 5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : null
}

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
  const prioritaire = planifiee.prioritaire === true

  return (
    <article
      className="carte p-5"
      style={prioritaire ? { background: 'var(--color-rose-pale)' } : undefined}
    >
      <div className="flex items-start gap-4">
        {onBasculer ? (
          <button
            type="button"
            onClick={onBasculer}
            aria-pressed={faite}
            aria-label={faite ? `Décocher : ${titre}` : `Marquer comme fait : ${titre}`}
            className={`${COCHE} transition-colors`}
            style={{
              borderColor: faite ? 'var(--color-icone-vert)' : 'var(--color-coche-repos)',
              background: faite ? 'var(--color-icone-vert)' : '#ffffff',
            }}
          >
            <Coche faite={faite} />
          </button>
        ) : (
          /* Semaine passée : plus rien à cocher, mais l'état se lit quand même. */
          <span
            className={COCHE}
            style={{
              borderColor: faite ? 'var(--color-icone-vert)' : '#d8ccc5',
              background: faite ? 'var(--color-icone-vert)' : 'transparent',
            }}
          >
            <Coche faite={faite} />
            <span className="sr-only">{faite ? 'Fait' : 'Pas fait'}</span>
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p
            className={
              prioritaire
                ? `font-display text-[1.24rem] font-bold leading-snug ${
                    faite ? 'text-encre-douce line-through' : 'text-foret'
                  }`
                : `text-[1.06rem] leading-snug ${
                    faite ? 'text-encre-douce line-through' : 'text-encre'
                  }`
            }
          >
            {titre}
          </p>

          {prioritaire && !faite ? (
            <p className="mt-1.5 text-[0.92rem] font-semibold text-foret">
              À faire en premier cette semaine.
            </p>
          ) : null}

          {detaillee ? <p className="mt-2.5 text-[0.95rem] text-encre-douce">{a.pourquoi}</p> : null}

          {/*
            Aucune couleur saturée ici : rien de cette ligne ne se clique. Le prune et le magenta
            sont réservés à ce sur quoi elle peut agir, sinon ils ne veulent plus rien dire.
          */}
          <p className="chiffres mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.86rem] text-encre-douce">
            <span>{a.effortMinutes} min</span>
            {a.ceSoir ? <span className="font-semibold text-encre">Faisable ce soir</span> : null}
            {planifiee.reduite ? <span>Version allégée</span> : null}
          </p>
        </div>
      </div>
    </article>
  )
}

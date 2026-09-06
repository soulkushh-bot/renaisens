'use client'

import { useId } from 'react'
import type { QuestionChoix, QuestionEchelle, QuestionTemps, QuestionTexte } from '@/types'

/*
  Les champs de l'onboarding, en papier découpé.

  Un contrôle standard posé dans un monde engagé est un manquement — et c'est celui qui coûte le plus
  cher ici, parce que la case à cocher est l'affordance principale du produit : c'est ce qu'elle
  touche chaque semaine.

  — Case cochée : un carré de papier plein, COLLÉ PAR-DESSUS la feuille, et qui la déborde.
  — Case vide : une découpe dans la feuille — un trou, en papier kraft, pas un filet gris.
  — Champ de saisie : un rectangle coupé aux ciseaux, pas un rectangle à rayon uniforme.

  Pensés pour un pouce : cibles d'au moins 48 px, jamais de menu déroulant, jamais de curseur à
  faire glisser.
*/

/** Le trou découpé dans la feuille, ou le carré de couleur collé dessus. */
function Case({ coche }: { coche: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="coupe-petit relative block h-7 w-7 shrink-0"
      style={{ background: coche ? 'var(--color-corail)' : 'var(--color-kraft)' }}
    >
      {coche ? (
        <svg viewBox="0 0 28 28" className="absolute inset-0" aria-hidden="true">
          <path
            d="M6 14.5 L11.5 20 L22 7.5"
            fill="none"
            stroke="var(--color-papier-clair)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  )
}

export function Echelle({
  question,
  valeur,
  onChange,
}: {
  question: QuestionEchelle
  valeur: number | undefined
  onChange: (v: number) => void
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="decoupe mb-4 text-[1.25rem] leading-snug text-indigo">
        {question.texte}
      </legend>
      <div className="flex gap-2" role="radiogroup">
        {[1, 2, 3, 4, 5].map((n) => {
          const actif = valeur === n
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={actif}
              aria-label={`${n} sur 5`}
              onClick={() => onChange(n)}
              className={`couche coupe-petit chiffres h-14 flex-1 text-[1.1rem] font-bold transition-colors ${
                actif ? 'decoupe text-papier-clair' : 'text-encre-douce'
              }`}
              style={{
                ['--teinte' as never]: actif ? 'var(--color-indigo)' : 'var(--color-kraft)',
              }}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-2.5 flex justify-between text-[0.88rem] text-encre-douce">
        <span>{question.bas}</span>
        <span>{question.haut}</span>
      </div>
    </fieldset>
  )
}

export function ChoixUnique({
  question,
  valeur,
  onChange,
}: {
  question: QuestionChoix | QuestionTemps
  valeur: string | undefined
  onChange: (v: string) => void
}) {
  const aide = 'aide' in question ? question.aide : undefined
  return (
    <fieldset className="border-0 p-0">
      <legend className="decoupe mb-2 text-[1.25rem] leading-snug text-indigo">
        {question.texte}
      </legend>
      {aide ? <p className="mb-4 text-[0.95rem] text-encre-douce">{aide}</p> : null}
      <div className="mt-3 flex flex-col gap-2" role="radiogroup">
        {question.options.map((o) => {
          const actif = valeur === o.valeur
          return (
            <button
              key={o.valeur}
              type="button"
              role="radio"
              aria-checked={actif}
              onClick={() => onChange(o.valeur)}
              className={`couche coupe flex min-h-[3.4rem] items-center gap-3.5 px-4 py-3 text-left text-[1.02rem] transition-colors ${
                actif ? 'text-papier-clair' : 'text-encre'
              }`}
              style={{
                ['--teinte' as never]: actif ? 'var(--color-feuille)' : 'var(--color-papier-clair)',
              }}
            >
              <Case coche={actif} />
              <span>{o.libelle}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function ChampTexte({
  question,
  valeur,
  onChange,
}: {
  question: QuestionTexte
  valeur: string | undefined
  onChange: (v: string) => void
}) {
  const id = useId()
  const texte = valeur ?? ''
  return (
    <div>
      <label htmlFor={id} className="decoupe mb-2 block text-[1.25rem] leading-snug text-indigo">
        {question.texte}
      </label>
      {question.aide ? <p className="mb-3 text-[0.95rem] text-encre-douce">{question.aide}</p> : null}
      {/* La feuille kraft dépasse sous le champ : le papier a une épaisseur. */}
      <div className="couche coupe p-[3px]" style={{ ['--teinte' as never]: 'var(--color-kraft)' }}>
        <textarea
          id={id}
          rows={3}
          maxLength={question.max}
          value={texte}
          placeholder={question.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="couche coupe w-full resize-y p-4 text-[1.05rem] leading-relaxed text-encre placeholder:text-encre-douce/70"
          style={{ ['--teinte' as never]: 'var(--color-papier-clair)' }}
        />
      </div>
      <p className="chiffres mt-1.5 text-right text-[0.82rem] text-encre-douce">
        {texte.length} / {question.max}
      </p>
    </div>
  )
}

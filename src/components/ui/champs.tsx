'use client'

import { useId } from 'react'
import type { QuestionChoix, QuestionEchelle, QuestionTemps, QuestionTexte } from '@/types'

/*
  Les champs de l'onboarding. Pensés pour un pouce, sur un téléphone tenu à une main :
  cibles de 48 px minimum, jamais de menu déroulant, jamais de curseur à faire glisser.
*/

export function Echelle({
  question,
  valeur,
  onChange,
}: {
  question: QuestionEchelle
  valeur: number | undefined
  onChange: (v: number) => void
}) {
  const id = useId()
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-3 text-[1.05rem] font-medium">{question.texte}</legend>
      <div className="flex gap-1.5" role="radiogroup" aria-labelledby={id}>
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
              className={`h-12 flex-1 rounded-[2px] border text-[0.95rem] transition-colors ${
                actif
                  ? 'border-cuve bg-cuve text-coton'
                  : 'border-encre/30 bg-transparent text-encre/70 hover:border-encre'
              }`}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[0.8rem] text-encre/60">
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
      <legend className="mb-1 text-[1.05rem] font-medium">{question.texte}</legend>
      {aide ? <p className="mb-3 text-[0.86rem] text-encre/65">{aide}</p> : null}
      <div className="mt-2 flex flex-col gap-1.5" role="radiogroup">
        {question.options.map((o) => {
          const actif = valeur === o.valeur
          return (
            <button
              key={o.valeur}
              type="button"
              role="radio"
              aria-checked={actif}
              onClick={() => onChange(o.valeur)}
              className={`flex min-h-12 items-center gap-3 rounded-[2px] border px-3 py-2.5 text-left text-[0.95rem] transition-colors ${
                actif ? 'border-cuve bg-cuve/8' : 'border-encre/25 hover:border-encre/60'
              }`}
            >
              <span
                aria-hidden="true"
                className={`block h-3.5 w-3.5 shrink-0 border ${
                  actif ? 'border-cuve bg-cuve' : 'border-encre/40'
                }`}
              />
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
      <label htmlFor={id} className="mb-1 block text-[1.05rem] font-medium">
        {question.texte}
      </label>
      {question.aide ? <p className="mb-2 text-[0.86rem] text-encre/65">{question.aide}</p> : null}
      <textarea
        id={id}
        rows={3}
        maxLength={question.max}
        value={texte}
        placeholder={question.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-[2px] border border-encre/30 bg-transparent p-3 text-[1rem] leading-relaxed placeholder:text-encre/35 focus:border-encre"
      />
      <p className="mt-1 text-right text-[0.78rem] text-encre/50">
        {texte.length} / {question.max}
      </p>
    </div>
  )
}

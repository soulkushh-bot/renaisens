'use client'

import { useId } from 'react'
import { PetiteFleur } from '@/components/marque/Papier'
import type { QuestionChoix, QuestionEchelle, QuestionTemps, QuestionTexte } from '@/types'

/*
  Les champs de l'onboarding, en papier découpé.

  Pensés pour un pouce, sur un téléphone tenu à une main : cibles d'au moins 48 px, jamais de menu
  déroulant, jamais de curseur à faire glisser.

  L'état sélectionné n'est jamais porté par la couleur seule : la case cochée reçoit une fleur
  découpée, et le papier de la ligne change de teinte. Une utilisatrice qui ne distingue pas le
  corail du souci voit quand même laquelle elle a choisie.
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
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-4 font-display text-[1.2rem] font-semibold leading-snug text-indigo">
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
              className={`couche coupe chiffres h-14 flex-1 font-display text-[1.05rem] font-bold transition-colors ${
                actif ? 'text-papier-clair' : 'text-indigo/70 hover:text-indigo'
              }`}
              style={{
                ['--teinte' as never]: actif
                  ? 'var(--color-indigo)'
                  : 'var(--color-papier-clair)',
              }}
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-2.5 flex justify-between text-[0.85rem] text-encre/65">
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
      <legend className="mb-2 font-display text-[1.2rem] font-semibold leading-snug text-indigo">
        {question.texte}
      </legend>
      {aide ? <p className="mb-4 text-[0.92rem] text-encre/70">{aide}</p> : null}
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
              className={`couche coupe flex min-h-[3.25rem] items-center gap-3 px-4 py-3 text-left text-[1rem] transition-colors ${
                actif ? 'text-papier-clair' : 'text-encre'
              }`}
              style={{
                ['--teinte' as never]: actif
                  ? 'var(--color-feuille)'
                  : 'var(--color-papier-clair)',
              }}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                {actif ? (
                  <PetiteFleur taille={20} petale="souci" coeur="papier-clair" />
                ) : (
                  <span className="block h-3.5 w-3.5 border-2 border-encre/40" />
                )}
              </span>
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
      <label
        htmlFor={id}
        className="mb-2 block font-display text-[1.2rem] font-semibold leading-snug text-indigo"
      >
        {question.texte}
      </label>
      {question.aide ? <p className="mb-3 text-[0.92rem] text-encre/70">{question.aide}</p> : null}
      <textarea
        id={id}
        rows={3}
        maxLength={question.max}
        value={texte}
        placeholder={question.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="couche coupe w-full resize-y p-4 text-[1.05rem] leading-relaxed text-encre placeholder:text-encre/40"
        style={{ ['--teinte' as never]: 'var(--color-papier-clair)' }}
      />
      <p className="chiffres mt-1.5 text-right text-[0.8rem] text-encre/55">
        {texte.length} / {question.max}
      </p>
    </div>
  )
}

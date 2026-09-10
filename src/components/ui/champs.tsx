'use client'

import { useId } from 'react'
import type { QuestionChoix, QuestionEchelle, QuestionTemps, QuestionTexte } from '@/types'

/*
  Les champs de l'onboarding.

  La case à cocher est l'affordance principale du produit : c'est ce qu'elle touche chaque semaine.
  Elle doit donc être l'élément le plus visible de sa ligne, jamais le plus pâle. Son bord au repos
  est un prune désaturé à 3,85:1 sur blanc, jamais un gris à 2:1 : au repos aussi, une case doit se
  voir.

  L'état sélectionné n'est jamais porté par la couleur seule : la ligne choisie change de fond ET
  reçoit une pastille pleine avec sa coche.

  Pensés pour un pouce : cibles d'au moins 48 px, jamais de menu déroulant, jamais de curseur à
  faire glisser.
*/

function Pastille({ coche }: { coche: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
      style={{
        borderColor: coche ? 'var(--color-prune)' : 'var(--color-coche-repos)',
        background: coche ? 'var(--color-prune)' : '#ffffff',
      }}
    >
      {coche ? (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M3.5 8.5 6.5 11.5 12.5 4.5"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
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
      <legend className="mb-4 font-display text-[1.2rem] font-semibold leading-snug text-foret">
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
              className="chiffres h-14 flex-1 rounded-[0.7rem] border-2 text-[1.05rem] font-bold transition-colors"
              style={{
                borderColor: actif ? 'var(--color-prune)' : '#e4d9d2',
                background: actif ? 'var(--color-prune)' : '#ffffff',
                color: actif ? '#ffffff' : 'var(--color-encre-douce)',
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
      <legend className="mb-2 font-display text-[1.2rem] font-semibold leading-snug text-foret">
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
              className="flex min-h-[3.4rem] items-center gap-3.5 rounded-[0.8rem] border-2 px-4 py-3 text-left text-[1.02rem] transition-colors"
              style={{
                borderColor: actif ? 'var(--color-prune)' : '#eadfd8',
                background: actif ? 'var(--color-rose-pale)' : '#ffffff',
                color: 'var(--color-encre)',
              }}
            >
              <Pastille coche={actif} />
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
        className="mb-2 block font-display text-[1.2rem] font-semibold leading-snug text-foret"
      >
        {question.texte}
      </label>
      {question.aide ? <p className="mb-3 text-[0.95rem] text-encre-douce">{question.aide}</p> : null}
      <textarea
        id={id}
        rows={3}
        maxLength={question.max}
        value={texte}
        placeholder={question.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-[0.8rem] border-2 bg-white p-4 text-[1.05rem] leading-relaxed text-encre placeholder:text-encre-douce/60"
        style={{ borderColor: '#eadfd8' }}
      />
      <p className="chiffres mt-1.5 text-right text-[0.82rem] text-encre-douce">
        {texte.length} / {question.max}
      </p>
    </div>
  )
}

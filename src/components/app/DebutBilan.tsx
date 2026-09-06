'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bouton, LienBouton } from '@/components/ui/base'
import { QUESTION_VISION, question } from '@/content/questions'
import { mesurer } from '@/lib/analytics'
import { useEtat } from '@/lib/etat'

/**
 * La première question du bilan est posée sur la page d'accueil.
 *
 * Elle répond avant d'avoir décidé de commencer — c'est la différence entre un formulaire qu'on
 * ouvre et un formulaire qu'on finit. Sa phrase est reprise telle quelle au dernier écran du bilan,
 * puis elle la relit en semaine 4.
 *
 * Rendu initial identique côté serveur et côté client (le formulaire) : c'est seulement après
 * lecture du stockage qu'apparaît, le cas échéant, la reprise de parcours.
 */
export function DebutBilan() {
  const router = useRouter()
  const { pret, etat, brouillon, ecrireBrouillon } = useEtat()
  const q = question(QUESTION_VISION)
  const [texte, setTexte] = useState('')

  if (pret && etat) {
    return (
      <div className="border border-encre bg-cuve p-5 text-coton sur-fond-sombre">
        <p className="text-[0.9rem] opacity-85">Tu as déjà fait le point.</p>
        <p className="mt-1 font-display text-[1.3rem] leading-tight">{etat.profile.titre}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <LienBouton href="/aujourdhui" variante="contourClair">
            Reprendre où j’en suis
          </LienBouton>
          <LienBouton href="/plan" variante="contourClair">
            Revoir mon plan
          </LienBouton>
        </div>
      </div>
    )
  }

  const commencer = () => {
    const propre = texte.trim()
    ecrireBrouillon(propre ? { ...brouillon, [QUESTION_VISION]: propre } : brouillon)
    mesurer('onboarding_started')
    router.push('/bilan')
  }

  return (
    <div className="border border-encre bg-cuve p-5 text-coton sur-fond-sombre">
      <label htmlFor="vision" className="block font-display text-[1.25rem] leading-tight">
        {q.type === 'texte' ? q.texte : ''}
      </label>
      <p className="mt-2 text-[0.88rem] text-coton/75">
        Écris-le comme tu le dirais à une amie. Tu pourras le corriger, et tu le reliras dans un mois.
      </p>
      <textarea
        id="vision"
        rows={3}
        maxLength={280}
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Dans un an, je veux…"
        className="mt-3 w-full resize-y rounded-[2px] border border-coton/40 bg-transparent p-3 text-[1rem] text-coton placeholder:text-coton/40 focus:border-coton"
      />
      <Bouton onClick={commencer} variante="clair" className="mt-3 w-full">
        Faire le point
      </Bouton>
      <p className="mt-3 text-[0.8rem] text-coton/65">
        Huit minutes, vingt-deux questions. Tu peux t’arrêter et reprendre.
      </p>
    </div>
  )
}

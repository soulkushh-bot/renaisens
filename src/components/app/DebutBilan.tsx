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
 * Rendu initial identique côté serveur et côté client : la reprise de parcours n'apparaît qu'après
 * lecture du stockage.
 */
export function DebutBilan() {
  const router = useRouter()
  const { pret, etat, brouillon, ecrireBrouillon } = useEtat()
  const q = question(QUESTION_VISION)
  const [texte, setTexte] = useState('')

  if (pret && etat) {
    return (
      <div className="carte p-7" style={{ background: 'var(--color-rose-pale)' }}>
        <p className="text-[0.95rem] text-encre-douce">Tu as déjà fait le point.</p>
        <p className="mt-2 font-display text-[1.4rem] font-bold leading-snug text-foret">
          {etat.profile.titre}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <LienBouton href="/aujourdhui">Reprendre où j’en suis</LienBouton>
          <LienBouton href="/plan" variante="contour">
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
    <div className="carte p-7">
      <label
        htmlFor="vision"
        className="block font-display text-[1.35rem] font-bold leading-snug text-foret"
      >
        {q.type === 'texte' ? q.texte : ''}
      </label>
      <p className="mt-3 text-[0.98rem] text-encre-douce">
        Écris-le comme tu le dirais à une amie. Tu pourras le corriger, et tu le reliras dans un mois.
      </p>
      <textarea
        id="vision"
        rows={3}
        maxLength={280}
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Dans un an, je veux…"
        className="mt-4 w-full resize-y rounded-[0.8rem] border-2 bg-white p-4 text-[1.05rem] text-encre placeholder:text-encre-douce/60"
        style={{ borderColor: '#eadfd8' }}
      />
      <Bouton onClick={commencer} className="mt-4 w-full">
        Faire le point
      </Bouton>
      <p className="chiffres mt-4 text-[0.9rem] text-encre-douce">
        Huit minutes, vingt-deux questions. Tu peux t’arrêter et reprendre.
      </p>
    </div>
  )
}

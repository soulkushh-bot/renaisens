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
      <div
        className="couche coupe sur-fond-sombre p-6"
        style={{ ['--teinte' as never]: 'var(--color-indigo)' }}
      >
        <p className="text-[0.95rem] text-papier-clair/80">Tu as déjà fait le point.</p>
        <p className="decoupe mt-2 text-[1.5rem] text-papier-clair">{etat.profile.titre}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <LienBouton href="/aujourdhui" variante="action">
            Reprendre où j’en suis
          </LienBouton>
          <LienBouton href="/plan" variante="clair">
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
    <div
      className="couche coupe sur-fond-sombre p-6"
      style={{ ['--teinte' as never]: 'var(--color-indigo)' }}
    >
      <label htmlFor="vision" className="decoupe block text-[1.35rem] text-papier-clair">
        {q.type === 'texte' ? q.texte : ''}
      </label>
      <p className="mt-3 text-[0.95rem] text-papier-clair/75">
        Écris-le comme tu le dirais à une amie. Tu pourras le corriger, et tu le reliras dans un mois.
      </p>
      <textarea
        id="vision"
        rows={3}
        maxLength={280}
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Dans un an, je veux…"
        className="couche coupe mt-4 w-full resize-y p-4 text-[1.05rem] text-encre placeholder:text-encre/40"
        style={{ ['--teinte' as never]: 'var(--color-papier-clair)' }}
      />
      <Bouton onClick={commencer} variante="action" className="mt-4 w-full">
        Faire le point
      </Bouton>
      <p className="chiffres mt-4 text-[0.86rem] text-papier-clair/70">
        Huit minutes, vingt-deux questions. Tu peux t’arrêter et reprendre.
      </p>
    </div>
  )
}

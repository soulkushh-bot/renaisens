'use client'

import { useState } from 'react'
import { Bouton } from '@/components/ui/base'

/**
 * Le seul point de monétisation testé en v1 : une adresse e-mail, à la fin du plan.
 *
 * Rien n'est payant. Le produit complet est gratuit, et il le restera pour ce segment tant que la
 * rétention en semaine 2 n'est pas prouvée. Ce bloc ne promet aucune fonctionnalité datée, et ne
 * fabrique aucun chiffre de traction pour donner envie.
 */
export function BlocPlus() {
  const [email, setEmail] = useState('')
  const [etat, setEtat] = useState<'attente' | 'envoi' | 'ok' | 'erreur'>('attente')

  const envoyer = async (e: React.FormEvent) => {
    e.preventDefault()
    setEtat('envoi')
    try {
      const r = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setEtat(r.ok ? 'ok' : 'erreur')
    } catch {
      setEtat('erreur')
    }
  }

  if (etat === 'ok') {
    return (
      <section className="border border-encre/25 p-4">
        <h2 className="text-[1.1rem]">C’est noté</h2>
        <p className="mt-2 text-[0.94rem] text-encre/80">
          On t’écrira quand RenaiSens+ existera vraiment. Pas avant, et pas pour autre chose.
        </p>
      </section>
    )
  }

  return (
    <section className="border border-encre/25 p-4">
      <h2 className="text-[1.1rem]">RenaiSens+</h2>
      <p className="mt-2 text-[0.94rem] text-encre/80">
        Un accompagnement plus poussé après les trente jours : des plans plus longs, et des échanges
        avec des femmes qui traversent la même chose. Ça n’existe pas encore. Si tu veux être
        prévenue quand ce sera prêt, laisse ton adresse.
      </p>

      <form onSubmit={envoyer} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@adresse.com"
          aria-label="Ton adresse e-mail"
          className="min-h-12 flex-1 rounded-[2px] border border-encre/30 bg-transparent px-3 text-[1rem] placeholder:text-encre/35 focus:border-encre"
        />
        <Bouton type="submit" disabled={etat === 'envoi'}>
          {etat === 'envoi' ? 'Un instant…' : 'Me prévenir'}
        </Bouton>
      </form>

      {etat === 'erreur' ? (
        <p className="mt-2 text-[0.85rem] text-encre/70">
          Ça n’est pas passé. Tu es peut-être hors ligne — le reste de l’app fonctionne quand même.
        </p>
      ) : null}

      <p className="mt-3 text-[0.8rem] text-encre/55">
        Ton adresse ne sert qu’à ça. Le reste de tes réponses ne quitte pas ton téléphone.
      </p>
    </section>
  )
}

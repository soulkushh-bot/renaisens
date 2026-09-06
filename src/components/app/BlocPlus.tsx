'use client'

import { useState } from 'react'
import { Bouton } from '@/components/ui/base'

/**
 * Le seul point de monétisation testé en v1 : une adresse e-mail, à la fin du plan.
 *
 * Rien n'est payant. Le produit complet est gratuit, et il le restera tant que la rétention en
 * semaine 2 n'est pas prouvée. Ce bloc ne promet aucune fonctionnalité datée et ne fabrique aucun
 * chiffre de traction.
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
      <div className="carte p-7" style={{ background: 'var(--color-tuile-menthe)' }}>
        <h2 className="text-[1.35rem]">C’est noté</h2>
        <p className="mt-3 text-[1rem] text-encre-douce">
          On t’écrira quand RenaiSens+ existera vraiment. Pas avant, et pas pour autre chose.
        </p>
      </div>
    )
  }

  return (
    <div className="carte p-7">
      <h2 className="text-[1.35rem]">RenaiSens+</h2>
      <p className="mt-3 text-[1rem] leading-relaxed text-encre">
        Un accompagnement plus poussé après les trente jours : des plans plus longs, et des échanges
        avec des femmes qui traversent la même chose. Ça n’existe pas encore. Si tu veux être
        prévenue quand ce sera prêt, laisse ton adresse.
      </p>

      <form onSubmit={envoyer} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@adresse.com"
          aria-label="Ton adresse e-mail"
          className="couche coupe min-h-[3rem] flex-1 px-4 text-[1.02rem] text-encre placeholder:text-encre-douce"
          style={{ ['--teinte' as never]: 'var(--color-papier)' }}
        />
        <Bouton type="submit" disabled={etat === 'envoi'}>
          {etat === 'envoi' ? 'Un instant…' : 'Me prévenir'}
        </Bouton>
      </form>

      {etat === 'erreur' ? (
        <p className="mt-3 text-[0.92rem] font-medium text-magenta">
          Ça n’est pas passé. Tu es peut-être hors ligne — le reste de l’app fonctionne quand même.
        </p>
      ) : null}

      <p className="mt-4 text-[0.86rem] leading-relaxed text-encre-douce">
        Ton adresse ne sert qu’à ça. Le reste de tes réponses ne quitte pas ton téléphone.
      </p>
    </div>
  )
}

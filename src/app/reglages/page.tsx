'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bande, Bouton, LienBouton } from '@/components/ui/base'
import { useEtat } from '@/lib/etat'

/**
 * Confidentialité, export, suppression.
 *
 * L'export et la suppression ne sont pas des cases à cocher de conformité : ce sont les deux
 * preuves que la promesse « ça reste chez toi » est vraie. Elles sont donc à un seul appui, pas
 * enterrées sous trois écrans.
 */
export default function Reglages() {
  const router = useRouter()
  const { pret, etat, toutEffacer } = useEtat()
  const [confirme, setConfirme] = useState(false)

  const exporter = () => {
    if (!etat) return
    const blob = new Blob([JSON.stringify(etat, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'renaisens.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const effacer = () => {
    toutEffacer()
    router.push('/')
  }

  return (
    <main className="colonne pb-16 pt-8">
      <h1 className="text-[1.7rem]">Réglages</h1>

      <section className="mt-7">
        <h2 className="text-[1.2rem]">Où sont tes réponses</h2>
        <div className="mt-3 flex flex-col gap-3 text-[0.98rem] text-encre/85">
          <p>
            Tout ce que tu as écrit — tes réponses, ton profil, ton plan, tes rituels — est
            enregistré dans le navigateur de cet appareil. Rien n’est envoyé sur un serveur.
          </p>
          <p>
            Il n’y a pas de compte, donc rien à pirater, et personne chez RENaiSENS ne peut lire ce
            que tu as répondu sur ton argent ou sur tes proches.
          </p>
          <p>
            La contrepartie est honnête : si tu changes de téléphone ou si tu effaces les données du
            site, tout disparaît. Exporte ton fichier avant, si tu y tiens.
          </p>
        </div>
      </section>

      <Bande className="mt-10" />

      <section className="mt-8">
        <h2 className="text-[1.2rem]">Emporter tes données</h2>
        <p className="mt-2 text-[0.96rem] text-encre/80">
          Un fichier lisible, avec tout ce que tu as écrit. Il t’appartient.
        </p>
        <Bouton
          variante="second"
          className="mt-4 w-full"
          onClick={exporter}
          disabled={!pret || !etat}
        >
          Télécharger mes données
        </Bouton>
      </section>

      <section className="mt-10">
        <h2 className="text-[1.2rem]">Tout effacer</h2>
        <p className="mt-2 text-[0.96rem] text-encre/80">
          Ton bilan, ton profil, ton plan et tes rituels sont supprimés de cet appareil. Ce n’est pas
          annulable, et nous n’en avons aucune copie à te renvoyer.
        </p>

        {!confirme ? (
          <Bouton
            variante="second"
            className="mt-4 w-full"
            onClick={() => setConfirme(true)}
            disabled={!pret || !etat}
          >
            Tout effacer
          </Bouton>
        ) : (
          <div className="mt-4 border border-encre p-4">
            <p className="text-[0.96rem]">
              Confirme : tout supprimer de cet appareil, sans possibilité de revenir en arrière ?
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Bouton onClick={effacer}>Oui, tout supprimer</Bouton>
              <Bouton variante="discret" onClick={() => setConfirme(false)}>
                Non, garder mes données
              </Bouton>
            </div>
          </div>
        )}
      </section>

      <Bande className="mt-12" />

      <section className="mt-8">
        <h2 className="text-[1.2rem]">Recommencer le bilan</h2>
        <p className="mt-2 text-[0.96rem] text-encre/80">
          Si ta situation a changé, tu peux refaire le point. Ton plan actuel sera remplacé.
        </p>
        <LienBouton href="/bilan" variante="discret" className="mt-3">
          Refaire le bilan
        </LienBouton>
      </section>

      <p className="mt-12 text-[0.82rem] text-encre/55">
        RENaiSENS est gratuit. Aucune fonctionnalité n’est réservée à un abonnement.
      </p>
    </main>
  )
}

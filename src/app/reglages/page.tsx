"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bouton, Carte, LienBouton } from '@/components/ui/base'
import { useEtat } from '@/lib/etat'

/**
 * Confidentialité, export, suppression.
 *
 * L'export et la suppression ne sont pas des cases à cocher de conformité : ce sont les deux
 * preuves que la promesse « ça reste chez toi » est vraie. Elles sont donc à un seul appui.
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
    <main className="colonne pb-10 pt-9">
      <h1 className="text-[2.2rem]">Réglages</h1>

      <section className="mt-9">
        <h2 className="text-[1.5rem]">Où sont tes réponses</h2>
        <div className="mt-4 flex flex-col gap-4 text-[1.03rem] text-encre-douce">
          <p>
            Tout ce que tu as écrit — tes réponses, ton profil, ton plan, tes rituels — est
            enregistré dans le navigateur de cet appareil. Rien n’est envoyé sur un serveur.
          </p>
          <p>
            Il n’y a pas de compte, donc rien à pirater, et personne chez RenaiSens ne peut lire ce
            que tu as répondu sur ton argent ou sur tes proches.
          </p>
          <p>
            La contrepartie est honnête : si tu changes de téléphone ou si tu effaces les données du
            site, tout disparaît. Exporte ton fichier avant, si tu y tiens.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[1.5rem]">Emporter tes données</h2>
        <p className="mt-3 text-[1.02rem] text-encre-douce">
          Un fichier lisible, avec tout ce que tu as écrit. Il t’appartient.
        </p>
        <Bouton variante="contour" className="mt-5 w-full" onClick={exporter} disabled={!pret || !etat}>
          Télécharger mes données
        </Bouton>
      </section>

      <section className="mt-12">
        <h2 className="text-[1.5rem]">Tout effacer</h2>
        <p className="mt-3 text-[1.02rem] text-encre-douce">
          Ton bilan, ton profil, ton plan et tes rituels sont supprimés de cet appareil. Ce n’est pas
          annulable, et nous n’en avons aucune copie à te renvoyer.
        </p>

        {!confirme ? (
          <Bouton
            variante="contour"
            className="mt-5 w-full"
            onClick={() => setConfirme(true)}
            disabled={!pret || !etat}
          >
            Tout effacer
          </Bouton>
        ) : (
          <Carte className="mt-5 p-6" fond="var(--color-tuile-rose)">
            <p className="text-[1.02rem] text-encre">
              Confirme : tout supprimer de cet appareil, sans possibilité de revenir en arrière ?
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Bouton onClick={effacer}>Oui, tout supprimer</Bouton>
              <Bouton variante="contour" onClick={() => setConfirme(false)}>
                Non, garder mes données
              </Bouton>
            </div>
          </Carte>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-[1.5rem]">Recommencer le bilan</h2>
        <p className="mt-3 text-[1.02rem] text-encre-douce">
          Si ta situation a changé, tu peux refaire le point. Ton plan actuel sera remplacé.
        </p>
        <LienBouton href="/bilan" variante="discret" className="mt-3">
          Refaire le bilan
        </LienBouton>
      </section>

      <p className="mt-14 text-[0.9rem] text-encre-douce">
        RenaiSens est gratuit. Aucune fonctionnalité n’est réservée à un abonnement.
      </p>
    </main>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { BandeDecoupee, Couche } from '@/components/marque/Papier'
import { Bouton, LienBouton } from '@/components/ui/base'
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
    <main className="pb-6">
      <div className="colonne pt-9">
        <h1 className="decoupe font-display uppercase text-[2.3rem]">Réglages</h1>

        <section className="mt-9">
          <h2 className="decoupe font-display uppercase text-[1.5rem]">Où sont tes réponses</h2>
          <div className="mt-4 flex flex-col gap-4 text-[1.03rem] leading-relaxed text-encre/85">
            <p>
              Tout ce que tu as écrit — tes réponses, ton profil, ton plan, tes rituels — est
              enregistré dans le navigateur de cet appareil. Rien n’est envoyé sur un serveur.
            </p>
            <p>
              Il n’y a pas de compte, donc rien à pirater, et personne chez RenaiSens ne peut lire ce
              que tu as répondu sur ton argent ou sur tes proches.
            </p>
            <p>
              La contrepartie est honnête : si tu changes de téléphone ou si tu effaces les données
              du site, tout disparaît. Exporte ton fichier avant, si tu y tiens.
            </p>
          </div>
        </section>
      </div>

      <BandeDecoupee teinte="feuille" className="mt-12" />

      <div className="colonne mt-9">
        <section>
          <h2 className="decoupe font-display uppercase text-[1.5rem]">Emporter tes données</h2>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-encre/85">
            Un fichier lisible, avec tout ce que tu as écrit. Il t’appartient.
          </p>
          <Bouton variante="contour" className="mt-5 w-full" onClick={exporter} disabled={!pret || !etat}>
            Télécharger mes données
          </Bouton>
        </section>

        <section className="mt-12">
          <h2 className="decoupe font-display uppercase text-[1.5rem]">Tout effacer</h2>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-encre/85">
            Ton bilan, ton profil, ton plan et tes rituels sont supprimés de cet appareil. Ce n’est
            pas annulable, et nous n’en avons aucune copie à te renvoyer.
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
            <Couche teinte="corail" className="mt-5 p-5">
              <p className="text-[1.02rem] leading-relaxed text-papier-clair">
                Confirme : tout supprimer de cet appareil, sans possibilité de revenir en arrière ?
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Bouton variante="clair" onClick={effacer}>
                  Oui, tout supprimer
                </Bouton>
                <Bouton
                  variante="clair"
                  className="ring-2 ring-inset ring-papier-clair"
                  style={{ ['--teinte' as never]: 'transparent', color: 'var(--color-papier-clair)' }}
                  onClick={() => setConfirme(false)}
                >
                  Non, garder mes données
                </Bouton>
              </div>
            </Couche>
          )}
        </section>

        <section className="mt-12">
          <h2 className="decoupe font-display uppercase text-[1.5rem]">Recommencer le bilan</h2>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-encre/85">
            Si ta situation a changé, tu peux refaire le point. Ton plan actuel sera remplacé.
          </p>
          <LienBouton href="/bilan" variante="discret" className="mt-3">
            Refaire le bilan
          </LienBouton>
        </section>

        <p className="mt-14 text-[0.88rem] leading-relaxed text-encre/60">
          RenaiSens est gratuit. Aucune fonctionnalité n’est réservée à un abonnement.
        </p>
      </div>
    </main>
  )
}

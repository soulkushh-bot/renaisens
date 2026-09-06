'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BandeDecoupee, Couche } from '@/components/marque/Papier'
import { RosacePhenix } from '@/components/marque/RosacePhenix'
import { Bouton } from '@/components/ui/base'
import { ChampTexte, ChoixUnique, Echelle } from '@/components/ui/champs'
import { ECRANS, question } from '@/content/questions'
import { useEtat } from '@/lib/etat'
import type { AnswerValue } from '@/types'

/**
 * Le bilan : six écrans de trois à quatre questions.
 *
 * L'écran de confidentialité passe AVANT la première question, en français simple — ce n'est pas un
 * texte juridique, c'est la raison pour laquelle elle va répondre honnêtement sur son argent et sur
 * sa famille.
 *
 * La progression n'est pas une barre qui se remplit : ce sont six morceaux de papier qui se
 * collent. Le chiffre est écrit à côté, donc la couleur n'est jamais seule à le dire.
 */

const ETAPE_CONFIDENTIALITE = -1

/** Le bouton dit ce qu'il ouvre. Jamais « Continuer ». */
const LIBELLES = [
  'Parler de mon travail',
  'Parler d’argent',
  'Parler de mon projet',
  'Parler de mon entourage',
  'Écrire mes mots',
  'Voir mon profil',
]

export default function Bilan() {
  const router = useRouter()
  const { pret, brouillon, ecrireBrouillon, terminerBilan } = useEtat()
  const [etape, setEtape] = useState<number>(ETAPE_CONFIDENTIALITE)
  const [reponses, setReponses] = useState<Record<string, AnswerValue>>({})
  const [charge, setCharge] = useState(false)

  useEffect(() => {
    if (pret && !charge) {
      setReponses(brouillon)
      setCharge(true)
    }
  }, [pret, brouillon, charge])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [etape])

  /**
   * Forme fonctionnelle obligatoire : deux réponses tapées dans le même tick de rendu partagent la
   * même fermeture, et la première serait écrasée. Ça n'arrive pas à un rythme humain sur une
   * machine rapide — ça arrive sur un Android d'entrée de gamme dont le thread principal traîne.
   */
  const repondre = (id: string, valeur: AnswerValue) => {
    setReponses((precedent) => {
      const suivant = { ...precedent, [id]: valeur }
      ecrireBrouillon(suivant)
      return suivant
    })
  }

  if (etape === ETAPE_CONFIDENTIALITE) {
    return (
      <main className="colonne flex min-h-dvh flex-col justify-center py-14">
        <RosacePhenix couches={0} taille={96} />
        <h1 className="decoupe font-display uppercase mt-8 text-[2.3rem]">Avant de commencer</h1>
        <div className="mt-6 flex flex-col gap-4 text-[1.05rem] leading-relaxed text-encre/85">
          <p>
            Tu vas répondre à des questions sur ton argent, ton travail et tes proches. C’est
            nécessaire pour que ton plan serve à quelque chose.
          </p>
          <p>
            Tout est enregistré <strong className="text-indigo">sur ton téléphone</strong>, dans ton
            navigateur. Rien n’est envoyé sur un serveur, il n’y a pas de compte à créer et personne
            d’autre ne peut le lire.
          </p>
          <p>
            Si tu effaces les données du site, ou si tu appuies sur « Tout effacer » dans les
            réglages, tout disparaît. Nous n’en gardons aucune copie, parce que nous n’en avons
            jamais eu.
          </p>
        </div>
        <Bouton className="mt-10 w-full" onClick={() => setEtape(0)}>
          J’ai compris, on commence
        </Bouton>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-4 font-display text-[0.9rem] font-bold uppercase text-encre/60 underline"
        >
          Revenir à l’accueil
        </button>
      </main>
    )
  }

  const ecran = ECRANS[etape]!
  const questions = ecran.questions.map(question)
  const manquantes = questions.filter((q) => q.type !== 'texte' && reponses[q.id] === undefined)
  const dernier = etape === ECRANS.length - 1

  const avancer = () => {
    if (manquantes.length > 0) return
    if (!dernier) {
      setEtape(etape + 1)
      return
    }
    terminerBilan(reponses)
    router.push('/profil')
  }

  return (
    <main className="colonne pb-40 pt-8">
      {/* Six morceaux de papier qui se collent, pas une barre qui se remplit. */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {ECRANS.map((e, i) => (
          <span
            key={e.id}
            className="couche coupe h-3 flex-1"
            style={{
              ['--teinte' as never]:
                i < etape
                  ? 'var(--color-feuille)'
                  : i === etape
                    ? 'var(--color-corail)'
                    : 'var(--color-papier-clair)',
            }}
          />
        ))}
      </div>
      <p className="chiffres mt-3 font-display text-[0.85rem] font-bold uppercase text-encre/60">
        Écran {etape + 1} sur {ECRANS.length}
      </p>

      <h1 className="decoupe font-display uppercase mt-7 text-[1.9rem]">{ecran.intention}</h1>

      <div className="mt-10 flex flex-col gap-11">
        {questions.map((q) => {
          const v = reponses[q.id]
          if (q.type === 'echelle') {
            return (
              <Echelle
                key={q.id}
                question={q}
                valeur={typeof v === 'number' ? v : undefined}
                onChange={(n) => repondre(q.id, n)}
              />
            )
          }
          if (q.type === 'choix' || q.type === 'temps') {
            return (
              <ChoixUnique
                key={q.id}
                question={q}
                valeur={typeof v === 'string' ? v : undefined}
                onChange={(s) => repondre(q.id, s)}
              />
            )
          }
          return (
            <ChampTexte
              key={q.id}
              question={q}
              valeur={typeof v === 'string' ? v : undefined}
              onChange={(s) => repondre(q.id, s)}
            />
          )
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20">
        <BandeDecoupee teinte="papier-clair" />
        <Couche teinte="papier-clair" coupe={false}>
          <div className="colonne flex items-center gap-3 py-3">
            <button
              type="button"
              onClick={() => setEtape(etape - 1)}
              className="min-h-12 px-2 font-display text-[0.9rem] font-bold uppercase text-encre/65 underline"
            >
              Revenir
            </button>
            <Bouton className="flex-1" onClick={avancer} disabled={manquantes.length > 0}>
              {LIBELLES[etape] ?? 'Voir mon profil'}
            </Bouton>
          </div>
          {manquantes.length > 0 ? (
            <p className="colonne pb-3 text-[0.85rem] text-encre/65">
              Il reste {manquantes.length} question{manquantes.length > 1 ? 's' : ''} sur cet écran.
            </p>
          ) : null}
        </Couche>
      </div>
    </main>
  )
}

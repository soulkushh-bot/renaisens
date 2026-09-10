"use client"

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Phenix } from '@/components/marque/Phenix'
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
 * La progression est une suite de segments avec son compte écrit à côté : la couleur n'est jamais
 * seule à dire où elle en est.
 *
 * À partir de 1024 px, l'intention de l'écran et la progression passent dans une colonne de gauche
 * qui reste sous les yeux pendant qu'elle répond, et la barre d'actions cesse de flotter : sur un
 * grand écran, tout tient sans qu'on ait à coller un bandeau en bas de la fenêtre.
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
        <Phenix taille={96} />
        <h1 className="mt-8 text-[2.2rem]">Avant de commencer</h1>
        <div className="mt-6 flex flex-col gap-4 text-[1.05rem] leading-relaxed text-encre-douce">
          <p>
            Tu vas répondre à des questions sur ton argent, ton travail et tes proches. C’est
            nécessaire pour que ton plan serve à quelque chose.
          </p>
          <p>
            Tout est enregistré <strong className="text-foret">sur ton téléphone</strong>, dans ton
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
          className="mt-4 text-[0.94rem] font-semibold text-encre-douce underline"
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
    <main className="colonne pb-40 pt-8 lg:mx-auto lg:grid lg:max-w-[68rem] lg:grid-cols-[19rem_1fr] lg:items-start lg:gap-14 lg:px-10 lg:pb-16 lg:pt-12">
      <div className="lg:sticky lg:top-10">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-1.5" aria-hidden="true">
            {ECRANS.map((e, i) => (
              <span
                key={e.id}
                className="h-2 flex-1 rounded-full"
                style={{ background: i <= etape ? 'var(--color-prune)' : '#e8ded7' }}
              />
            ))}
          </div>
          <p className="chiffres shrink-0 text-[0.85rem] font-semibold text-encre-douce">
            {etape + 1} / {ECRANS.length}
          </p>
        </div>

        <h1 className="mt-8 text-[1.9rem]">{ecran.intention}</h1>
        {/* Sur grand écran seulement : la colonne de gauche a la place de redire pourquoi elle
            peut répondre honnêtement. Sur téléphone, ce serait du bruit au-dessus des questions. */}
        <p className="mt-6 hidden text-[0.94rem] leading-relaxed text-encre-douce lg:block">
          Tes réponses restent sur ton téléphone. Tu peux t’arrêter à n’importe quelle question et
          reprendre plus tard : rien n’est perdu.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-11 lg:mt-0">
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

        <div
          className="fixed inset-x-0 bottom-0 z-20 border-t bg-white lg:static lg:mt-4 lg:border-0 lg:bg-transparent"
          style={{ borderColor: '#efe4dd' }}
        >
          <div className="colonne flex items-center gap-3 py-3 lg:max-w-none lg:px-0">
            <button
              type="button"
              onClick={() => setEtape(etape - 1)}
              className="min-h-12 px-2 text-[0.94rem] font-semibold text-encre-douce underline"
            >
              Revenir
            </button>
            <Bouton className="flex-1 lg:flex-none lg:px-12" onClick={avancer} disabled={manquantes.length > 0}>
              {LIBELLES[etape] ?? 'Voir mon profil'}
            </Bouton>
          </div>
          {manquantes.length > 0 ? (
            <p className="colonne pb-3 text-[0.88rem] text-encre-douce lg:max-w-none lg:px-0">
              Il reste {manquantes.length} question{manquantes.length > 1 ? 's' : ''} sur cet écran.
            </p>
          ) : null}
        </div>
      </div>
    </main>
  )
}

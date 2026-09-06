import Link from 'next/link'
import { Phenix } from '@/components/marque/Phenix'
import { LienBouton } from '@/components/ui/base'

export default function Introuvable() {
  return (
    <main className="colonne flex min-h-dvh flex-col justify-center py-16">
      <Phenix taille={96} />
      <h1 className="mt-8 text-[2.1rem]">Cette page n’existe pas.</h1>
      <p className="mt-4 text-[1.06rem] text-encre-douce">
        Rien de grave. Tes données sont intactes, elles sont sur ton téléphone.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <LienBouton href="/aujourdhui">Revenir à ma semaine</LienBouton>
        <LienBouton href="/" variante="contour">
          Aller à l’accueil
        </LienBouton>
      </div>
    </main>
  )
}

import Link from 'next/link'
import { RosacePhenix } from '@/components/marque/RosacePhenix'

export default function Introuvable() {
  return (
    <main className="colonne flex min-h-dvh flex-col justify-center py-16">
      <RosacePhenix couches={1} taille={104} />
      <h1 className="decoupe uppercase mt-8 text-[2.2rem]">Cette page n’existe pas.</h1>
      <p className="mt-4 text-[1.06rem] leading-relaxed text-encre/80">
        Rien de grave. Tes données sont intactes, elles sont sur ton téléphone.
      </p>
      <div className="mt-7 flex flex-wrap gap-5">
        <Link
          href="/aujourdhui"
          className="font-display text-[1rem] font-bold uppercase text-indigo underline"
        >
          Revenir à ma semaine
        </Link>
        <Link
          href="/"
          className="font-display text-[1rem] font-bold uppercase text-indigo underline"
        >
          Aller à l’accueil
        </Link>
      </div>
    </main>
  )
}

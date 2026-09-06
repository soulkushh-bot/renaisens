import Link from 'next/link'
import { PhoenixStamp } from '@/components/marque/PhoenixStamp'

export default function Introuvable() {
  return (
    <main className="colonne flex min-h-dvh flex-col justify-center py-16">
      <PhoenixStamp taille={48} className="text-pale" />
      <h1 className="mt-6 text-[1.7rem]">Cette page n&rsquo;existe pas.</h1>
      <p className="mt-3 text-[1rem] text-encre/75">
        Rien de grave. Tes donn&eacute;es sont intactes, elles sont sur ton t&eacute;l&eacute;phone.
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/aujourdhui" className="underline underline-offset-4">
          Revenir &agrave; ma semaine
        </Link>
        <Link href="/" className="underline underline-offset-4">
          Aller &agrave; l&rsquo;accueil
        </Link>
      </div>
    </main>
  )
}

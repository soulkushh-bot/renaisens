import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter_Tight } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NavBasse } from '@/components/app/NavBasse'
import { ServiceWorker } from '@/components/app/ServiceWorker'
import { FournisseurEtat } from '@/lib/etat'
import './globals.css'

/*
  Deux familles, pas trois.

  Bricolage Grotesque en display, poussée jusqu'à 800 et posée en capitales : à ce poids, ses
  terminaisons irrégulières lisent comme des lettres découpées aux ciseaux, ce que le monde demande.
  L'ancienne version l'utilisait trop petite pour qu'on voie son caractère.

  Inter Tight en texte courant : les écrans du quotidien sont du mode Operate, et une face de labeur
  lisible sur un écran bon marché y vaut mieux qu'une face à point de vue.

  `latin-ext` est chargé en plus de `latin` : le produit est entièrement en français, et une
  interface qui casse sur un « œ » n'a pas l'air soignée.
*/
const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--police-display',
  display: 'swap',
  weight: ['600', '700', '800'],
})

const texte = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--police-texte',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'RenaiSens — Trente jours, une chose à la fois',
  description:
    'Fais le point, puis repars avec un plan de trente jours que tu peux vraiment tenir. Trois actions par semaine au maximum. Tes réponses restent sur ton téléphone.',
  applicationName: 'RenaiSens',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'RenaiSens', statusBarStyle: 'default' },
  openGraph: {
    title: 'RenaiSens',
    description:
      'Un point de départ honnête, puis un plan de trente jours qui se réécrit selon ce que tu fais vraiment.',
    locale: 'fr_FR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1B2E58',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${display.variable} ${texte.variable} flex min-h-dvh flex-col`}>
        <FournisseurEtat>
          <div className="flex-1">{children}</div>
          <NavBasse />
          <ServiceWorker />
        </FournisseurEtat>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

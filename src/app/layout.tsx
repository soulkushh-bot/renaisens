import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Inter_Tight } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NavBasse } from '@/components/app/NavBasse'
import { ServiceWorker } from '@/components/app/ServiceWorker'
import { FournisseurEtat } from '@/lib/etat'
import './globals.css'

/*
  Deux familles, pas trois, et aucune police par défaut de projet SaaS.
  `latin-ext` est chargé en plus de `latin` : le produit est entièrement en français, et une
  interface qui casse sur un « œ » ou un « ï » n'a pas l'air soignée.
*/
const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--police-display',
  display: 'swap',
  weight: ['500', '600', '700'],
})

const texte = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--police-texte',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'RENaiSENS — Devenir une nouvelle version de soi',
  description:
    'Fais le point, décide qui tu veux devenir, et repars avec un plan de trente jours que tu peux vraiment tenir. Tes réponses restent sur ton téléphone.',
  applicationName: 'RENaiSENS',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'RENaiSENS', statusBarStyle: 'default' },
  openGraph: {
    title: 'RENaiSENS',
    description:
      'Un point de départ honnête, puis un plan de trente jours qui se réécrit selon ce que tu fais vraiment.',
    locale: 'fr_FR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#131C3D',
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

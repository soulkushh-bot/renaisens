import type { Metadata, Viewport } from 'next'
import { Caveat, Figtree } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NavBasse } from '@/components/app/NavBasse'
import { ServiceWorker } from '@/components/app/ServiceWorker'
import { FournisseurEtat } from '@/lib/etat'
import './globals.css'

/*
  Figtree porte le display et le texte courant : une humaniste chaude, lisible sur un écran bon
  marché, qui tient les titres en gras sans devenir criarde.

  Caveat porte les accents manuscrits — une citation, une liste d'intentions. Jamais un libellé de
  bouton ni une information dont la lecture doit être sûre : une écriture cursive se lit moins bien,
  et ce qui doit être compris du premier coup n'a pas à être joli.

  `latin-ext` est chargé en plus de `latin` : le produit est entièrement en français, et une
  interface qui casse sur un « œ » n'a pas l'air soignée.
*/
const display = Figtree({
  subsets: ['latin', 'latin-ext'],
  variable: '--police-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const manuscrite = Caveat({
  subsets: ['latin', 'latin-ext'],
  variable: '--police-manuscrite',
  display: 'swap',
  weight: ['500', '600'],
})

export const metadata: Metadata = {
  title: 'RenaiSens — Tu peux changer ta vie sans changer toute ta vie',
  description:
    'Fais le point en huit minutes, puis repars avec un plan de trente jours que tu peux vraiment tenir : trois actions par semaine, jamais plus. Tes réponses restent sur ton téléphone.',
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
  themeColor: '#8C2059',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        className={`${display.variable} ${manuscrite.variable} flex min-h-dvh flex-col`}
        style={{ ['--police-texte' as never]: 'var(--police-display)' }}
      >
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

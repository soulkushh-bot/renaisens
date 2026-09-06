import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RENaiSENS — Devenir une nouvelle version de soi',
    short_name: 'RENaiSENS',
    description:
      'Fais le point, decide qui tu veux devenir, et repars avec un plan de trente jours que tu peux vraiment tenir.',
    lang: 'fr',
    start_url: '/aujourdhui',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F2EDE1',
    theme_color: '#131C3D',
    icons: [
      {
        src: '/icons/phoenix.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}

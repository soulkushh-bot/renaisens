import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RenaiSens — Trente jours, une chose a la fois',
    short_name: 'RenaiSens',
    description:
      'Fais le point, Fais le point, puis repars avec un plan de trente jours que tu peux vraiment tenir.',
    lang: 'fr',
    start_url: '/aujourdhui',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FDF7F2',
    theme_color: '#8C2059',
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

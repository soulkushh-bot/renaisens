import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Le seul paquet lourd du projet. Tree-shaké agressivement pour tenir le budget JS.
    optimizePackageImports: ['motion'],
  },
  async headers() {
    return [
      {
        // Le service worker ne doit jamais être servi depuis un cache HTTP périmé,
        // sinon une mise à jour du plan reste bloquée sur les vieux appareils.
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ]
  },
}

export default nextConfig

/*
  Service worker ecrit a la main.

  Objectif produit, pas objectif technique : le plan et le rituel doivent marcher dans le bus, dans
  un ascenseur, et sur une 3G qui laché. Un rituel hebdomadaire qui echoue faute de reseau est un
  rituel qu'on ne refait pas, et le rituel de la semaine 2 est la metrique du produit.

  Strategie :
  — navigations : reseau d'abord, cache en repli, puis la page d'accueil en dernier recours ;
  — assets /_next/static : cache d'abord (ils sont immuables, leur nom contient un hash) ;
  — le reste : reseau, sans mise en cache.
*/

const VERSION = 'renaisens-v1'
const COQUILLE = ['/', '/aujourdhui', '/plan', '/rituel', '/recits', '/reglages']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => Promise.allSettled(COQUILLE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cles) => Promise.all(cles.filter((c) => c !== VERSION).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const requete = event.request
  if (requete.method !== 'GET') return

  const url = new URL(requete.url)
  if (url.origin !== self.location.origin) return

  if (requete.mode === 'navigate') {
    event.respondWith(
      fetch(requete)
        .then((reponse) => {
          const copie = reponse.clone()
          caches.open(VERSION).then((cache) => cache.put(requete, copie))
          return reponse
        })
        .catch(() =>
          caches
            .match(requete)
            .then((cache) => cache || caches.match('/'))
            .then((cache) => cache || Response.error()),
        ),
    )
    return
  }

  if (url.pathname.startsWith('/_next/static')) {
    event.respondWith(
      caches.match(requete).then(
        (cache) =>
          cache ||
          fetch(requete).then((reponse) => {
            const copie = reponse.clone()
            caches.open(VERSION).then((c) => c.put(requete, copie))
            return reponse
          }),
      ),
    )
  }
})

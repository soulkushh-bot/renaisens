/**
 * Captures d'écran pour la revue de finition.
 *
 * Pilote Edge (Chromium) déjà installé via puppeteer-core : aucun navigateur n'est téléchargé.
 *
 * Les captures sont l'évidence de la revue. Une capture qui montre un état que le produit n'a pas
 * atteint, ou du contenu masqué par une barre flottante, fait perdre toute la ronde — et pire, elle
 * fait juger le produit sur une image fausse.
 *
 *   node scripts/captures.mjs [url]
 */
import { mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'https://renaisens.vercel.app'
const SORTIE = '.impeccable/review'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

const MOBILE = { width: 390, height: 844, deviceScaleFactor: 2 }
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 }

const attendre = (ms) => new Promise((r) => setTimeout(r, ms))
const ouvrir = (page, chemin) =>
  page.goto(`${BASE}${chemin}`, { waitUntil: 'domcontentloaded', timeout: 60000 })

/**
 * Prépare la page pour une capture pleine hauteur honnête.
 *
 * 1. On attend les polices et les animations d'entrée.
 * 2. On déroule la page : les images en `loading="lazy"` ne se chargent jamais si elles n'entrent
 *    pas dans le viewport, et ressortent vides.
 * 3. On fige TOUT ce qui est `fixed` ou `sticky`. Une barre flottante se colle au milieu du document
 *    quand le viewport est étiré pour la capture, et recouvre du contenu. Cibler la seule barre de
 *    navigation ne suffisait pas : le bilan et le rituel ont leur propre barre d'actions, et c'est
 *    exactement celle-là qui masquait une question dans une capture précédente.
 */
async function stabiliser(page) {
  await page.evaluate(() => document.fonts.ready)

  await page.evaluate(async () => {
    const pas = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += pas) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })

  await page.evaluate(() =>
    Promise.all(
      [...document.images]
        .filter((i) => !i.complete)
        .map(
          (i) =>
            new Promise((r) => {
              i.addEventListener('load', r, { once: true })
              i.addEventListener('error', r, { once: true })
            }),
        ),
    ),
  )

  await page.evaluate(() => {
    for (const el of document.querySelectorAll('*')) {
      const p = getComputedStyle(el).position
      if (p === 'fixed' || p === 'sticky') el.style.setProperty('position', 'static', 'important')
    }
  })

  await attendre(1400)
}

async function capturer(page, nom) {
  await stabiliser(page)
  await page.screenshot({ path: `${SORTIE}/${nom}.png`, fullPage: true })
  console.log(`  ✓ ${nom}.png`)
}

/** Joue le bilan complet dans l'interface réelle, comme le ferait une utilisatrice. */
async function faireLeBilan(page) {
  const CHOIX = [
    [1, 3, 1, 1],
    [1, 0, 4, 3],
    [3, 0, 1, 4],
    [2, 2, 4],
    [3, 4, 1, 1],
  ]
  // Le premier champ est la vision, déjà saisie sur l'accueil. On la répète : le brouillon se charge
  // de façon asynchrone, et un champ encore vide se faisait écraser par une chaîne vide.
  const LIBRES = [
    'Je veux avoir quitté mon poste et vivre de mon activité, sans avoir peur de la fin du mois.',
    'Ce qui m’arrête, c’est la peur de perdre un salaire que tout le monde m’envie.',
    'Le travail et les trajets.',
  ]

  await page.evaluate(
    async (CHOIX, LIBRES) => {
      const A = (ms = 420) => new Promise((r) => setTimeout(r, ms))
      const P = (p) =>
        [...document.querySelectorAll('button,a')].find((e) => e.textContent.trim().startsWith(p))
      const setTA = (el, v) => {
        const s = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
        s.call(el, v)
        el.dispatchEvent(new Event('input', { bubbles: true }))
      }

      setTA(document.querySelector('textarea'), LIBRES[0])
      await A(250)
      P('Faire le point').click()
      await A(900)
      P('J’ai compris').click()
      await A(900)

      for (let e = 0; e < 6; e++) {
        const fs = [...document.querySelectorAll('fieldset')]
        for (let i = 0; i < fs.length; i++) {
          const r = [...fs[i].querySelectorAll('[role="radio"]')]
          if (!r.length) continue
          r[Math.min((CHOIX[e] ?? [])[i] ?? 2, r.length - 1)].click()
          await A(60)
        }
        const z = [...document.querySelectorAll('textarea')]
        for (let i = 0; i < z.length; i++)
          if (!z[i].value) {
            setTA(z[i], LIBRES[i] ?? '')
            await A(60)
          }
        await A(220)
        const barres = [...document.querySelectorAll('div')].filter((d) =>
          typeof d.className === 'string' ? d.className.includes('fixed') : false,
        )
        const boutons = barres.length
          ? [...barres[barres.length - 1].querySelectorAll('button')]
          : [...document.querySelectorAll('button')]
        boutons[boutons.length - 1].click()
        await A(900)
      }
    },
    CHOIX,
    LIBRES,
  )
  await page.waitForFunction(() => location.pathname === '/profil', { timeout: 25000 })
}

/**
 * Joue un rituel entier. C'est ce qui fait regagner une couleur au phénix.
 * Sans ça, toutes les captures montraient l'état zéro et le dispositif de progression n'était
 * visible nulle part — c'est-à-dire invérifiable.
 */
async function faireUnRituel(page, toutCocher) {
  await ouvrir(page, '/rituel')
  await attendre(1300)
  await page.evaluate(async (toutCocher) => {
    const A = (ms = 400) => new Promise((r) => setTimeout(r, ms))
    const P = (p) =>
      [...document.querySelectorAll('button,a')].find((e) => e.textContent.trim().startsWith(p))

    for (const c of [...document.querySelectorAll('button[aria-pressed]')]) {
      const coche = c.getAttribute('aria-pressed') === 'true'
      if (toutCocher !== coche) {
        c.click()
        await A(140)
      }
    }
    await A(250)
    P('Passer à la question')?.click()
    await A(900)
    const s = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
    const ta = document.querySelector('textarea')
    if (ta) {
      s.call(ta, 'J’ai fait ce que je pouvais, et c’est déjà plus que le mois dernier.')
      ta.dispatchEvent(new Event('input', { bubbles: true }))
    }
    await A(250)
    P('Voir ce qui change')?.click()
    await A(1300)
  }, toutCocher)
}

const navigateur = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  // Profil neuf à chaque exécution : un profil réutilisé garde un verrou après un plantage, et
  // on ne touche pas au profil personnel de l'utilisateur.
  userDataDir: join(tmpdir(), `renaisens-captures-${Date.now()}`),
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-first-run'],
})
try {
  await mkdir(SORTIE, { recursive: true })
  const page = await navigateur.newPage()
  console.log(`Captures depuis ${BASE}`)

  // — L'accueil, à l'état vierge —
  await page.setViewport(MOBILE)
  await ouvrir(page, '/')
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
  await capturer(page, 'mobile')

  await page.setViewport(DESKTOP)
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
  await capturer(page, 'desktop')

  // — Le bilan, une question répondue —
  const preparerBilan = async () => {
    await ouvrir(page, '/bilan')
    await attendre(800)
    await page.evaluate(async () => {
      const b = [...document.querySelectorAll('button')].find((e) =>
        e.textContent.trim().startsWith('J’ai compris'),
      )
      if (b) b.click()
      await new Promise((r) => setTimeout(r, 900))
      const fs = [...document.querySelectorAll('fieldset')]
      const r = fs[0] ? [...fs[0].querySelectorAll('[role="radio"]')] : []
      if (r[3]) r[3].click()
    })
  }
  await page.setViewport(MOBILE)
  await preparerBilan()
  await capturer(page, 'mobile-bilan')
  await page.setViewport(DESKTOP)
  await preparerBilan()
  await capturer(page, 'desktop-bilan')

  // — Le parcours complet, puis DEUX rituels : le phénix doit avoir regagné deux parts —
  await page.setViewport(MOBILE)
  await ouvrir(page, '/')
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
  await faireLeBilan(page)

  await faireUnRituel(page, true)
  await faireUnRituel(page, false)

  for (const [chemin, nom] of [
    ['/profil', 'profil'],
    ['/aujourdhui', 'aujourdhui'],
    ['/plan', 'plan'],
    ['/rituel', 'rituel'],
  ]) {
    await page.setViewport(MOBILE)
    await ouvrir(page, chemin)
    await capturer(page, `mobile-${nom}`)
    await page.setViewport(DESKTOP)
    await ouvrir(page, chemin)
    await capturer(page, `desktop-${nom}`)
  }

  // — Deux rituels de plus : le phénix entier, pour que la progression soit jugeable de bout en bout —
  await page.setViewport(MOBILE)
  await faireUnRituel(page, true)
  await faireUnRituel(page, true)

  /*
    On est encore sur l'écran de clôture, et c'est le seul écran animé du produit : la part de
    couleur qu'elle vient de gagner vient d'arriver sur le phénix. Une image ne montre pas le
    mouvement, mais elle montre ce que le mouvement a produit — sans elle, l'unique moment
    orchestré n'existe que dans le code.
  */
  await capturer(page, 'mobile-rituel-cloture')

  await ouvrir(page, '/aujourdhui')
  await capturer(page, 'mobile-aujourdhui-semaine4')
  await ouvrir(page, '/profil')
  await capturer(page, 'mobile-profil-semaine4')

  console.log('Terminé.')
} finally {
  await navigateur.close()
}

/**
 * Captures d'écran pour la revue de finition.
 *
 * Pilote Edge (Chromium) déjà installé via puppeteer-core : aucun navigateur n'est téléchargé.
 * Cible le site déployé, pas un serveur local — c'est ce que voient les utilisatrices.
 *
 * Les captures sont l'évidence de la revue : elles doivent montrer l'état RÉEL, animations
 * d'entrée terminées. Une animation en cours se lit comme un élément manquant et se ferait
 * corriger en régression.
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

/**
 * Laisse les animations d'entrée se terminer et les polices se poser.
 * On n'attend PAS `networkidle` : les balises de mesure gardent des connexions ouvertes et il ne
 * se stabilise jamais. On attend ce qui compte vraiment pour une capture : les polices et le
 * dernier délai d'animation.
 */
async function stabiliser(page) {
  await page.evaluate(() => document.fonts.ready)
  /*
    La barre basse est `position: sticky`. En capture pleine hauteur, le viewport est étiré et elle
    se retrouve collée au milieu du document, où elle masque du contenu. Ce n'est pas un défaut de
    la page — c'est un artefact de capture, et une capture qui montre du contenu masqué fait perdre
    toute la ronde de revue. On la fige en flux le temps de la photo.
  */
  await page.addStyleTag({
    content: 'nav[aria-label="Navigation principale"]{position:static !important}',
  })

  /*
    Les images en `loading="lazy"` ne se chargent pas si elles ne sont jamais entrées dans le
    viewport. En capture pleine hauteur, elles ressortent vides — et une image vide dans une capture
    se lit comme une image manquante dans la page. On déroule donc la page avant de photographier.
  */
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
      [...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => {
        i.addEventListener('load', r, { once: true })
        i.addEventListener('error', r, { once: true })
      })),
    ),
  )
  await attendre(1500)
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
  // Le premier champ est la vision, déjà saisie sur l'accueil. On la répète ici plutôt que de
  // laisser `null` : le brouillon se charge de façon asynchrone, et un champ encore vide au moment
  // du remplissage se faisait écraser par une chaîne vide — la capture montrait alors le repli
  // « à écrire », pas le vrai profil.
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

      setTA(
        document.querySelector('textarea'),
        'Je veux avoir quitté mon poste et vivre de mon activité, sans avoir peur de la fin du mois.',
      )
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
        ;[...document.querySelector('.fixed').querySelectorAll('button')].pop().click()
        await A(900)
      }
    },
    CHOIX,
    LIBRES,
  )
  await page.waitForFunction(() => location.pathname === '/profil', { timeout: 20000 })
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

  // — Landing, mobile puis desktop, à l'état vierge —
  await page.setViewport(MOBILE)
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
  await capturer(page, 'mobile')

  await page.setViewport(DESKTOP)
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
  await capturer(page, 'desktop')

  // — Le bilan, en cours de réponse —
  await page.setViewport(MOBILE)
  await page.goto(`${BASE}/bilan`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.evaluate(async () => {
    const b = [...document.querySelectorAll('button')].find((e) =>
      e.textContent.trim().startsWith('J’ai compris'),
    )
    if (b) b.click()
    await new Promise((r) => setTimeout(r, 700))
    const fs = [...document.querySelectorAll('fieldset')]
    const r = fs[0] ? [...fs[0].querySelectorAll('[role="radio"]')] : []
    if (r[3]) r[3].click()
  })
  await capturer(page, 'mobile-bilan')

  // — Le parcours complet, pour peupler les écrans applicatifs —
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
  await faireLeBilan(page)
  await capturer(page, 'mobile-profil')

  // Une action cochée, deux non faites : c'est ce qui permet de juger « le non-fait sans rouge ».
  await page.goto(`${BASE}/aujourdhui`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.evaluate(async () => {
    const c = document.querySelector('button[aria-pressed="false"]')
    if (c) c.click()
    await new Promise((r) => setTimeout(r, 500))
  })
  await capturer(page, 'mobile-aujourdhui')

  await page.setViewport(DESKTOP)
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 })
  await capturer(page, 'desktop-aujourdhui')

  await page.setViewport(MOBILE)
  await page.goto(`${BASE}/plan`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await capturer(page, 'mobile-plan')

  await page.goto(`${BASE}/rituel`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.evaluate(async () => {
    const c = document.querySelector('button[aria-pressed="false"]')
    if (c) c.click()
    await new Promise((r) => setTimeout(r, 500))
  })
  await capturer(page, 'mobile-rituel')

  console.log('Terminé.')
} finally {
  await navigateur.close()
}

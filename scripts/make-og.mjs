/**
 * Regenerates `public/og-card.jpg` (1200x630) from the BUILT css.
 *
 * WHY THIS EXISTS IN THE REPO:
 *   - the card must use the real self-hosted woff2 faces; System.Drawing / GDI+
 *     cannot load them, so the display word would silently render in a fallback
 *   - the card is composed from the same CSS as the site, so it cannot drift
 *   - the hero will change, and a stale social card is worse than none
 *
 * HOW IT WORKS: the generator page is written into dist/ so relative asset paths
 * resolve against the real build, screenshotted, then deleted. Nothing extra ships.
 *
 * USAGE:  npm run build && npm run preview &   # then, in another shell:
 *         npm run og -- http://localhost:4173
 *
 * Playwright is resolved from local node_modules first, then the global CLI.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const dist = join(root, 'dist')
const publicDir = join(root, 'public')
const template = join(here, 'og-card.template.html')

const origin = process.argv[2] ?? 'http://localhost:4173'

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/ is missing — run `npm run build` first.')
  process.exit(1)
}

async function loadChromium() {
  const candidates = [
    'playwright-core',
    'C:/Users/GURU/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core/index.js',
  ]
  for (const candidate of candidates) {
    try {
      const { pathToFileURL } = await import('node:url')
      const specifier = candidate.startsWith('.') || candidate.includes('/')
        ? pathToFileURL(candidate).href
        : candidate
      const mod = await import(specifier)
      const chromium = mod.chromium ?? mod.default?.chromium
      if (chromium) return chromium
    } catch {
      // try the next candidate
    }
  }
  throw new Error('playwright-core not found in local node_modules or the global CLI')
}

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const cssName = readdirSync(join(dist, 'assets')).find((f) => f.endsWith('.css'))
if (!cssName) {
  console.error('no built css found in dist/assets')
  process.exit(1)
}

mkdirSync(publicDir, { recursive: true })
const html = readFileSync(template, 'utf8').replace('CSS_HERE', cssName.replace(/\.css$/, ''))
const genPage = join(dist, '__og.html')
writeFileSync(genPage, html, 'utf8')

const chromium = await loadChromium()
const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-gpu'] })

try {
  const ctx = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(`${origin}/__og.html`, { waitUntil: 'networkidle' })
  // fonts.ready only settles loads already in flight; force the request first.
  await page.evaluate(() =>
    Promise.all([
      document.fonts.load('200px Anton'),
      document.fonts.load('50px "Playfair Display"'),
      document.fonts.load('15px "Manrope Variable"'),
    ]).catch(() => {}),
  )
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(400)

  const probe = await page.evaluate(() => {
    const range = document.createRange()
    const mega = document.querySelector('.og-mega')
    range.selectNodeContents(mega)
    const b = range.getBoundingClientRect()
    const img = document.querySelector('.og-visual img')
    return {
      megaWidth: Math.round(b.width),
      viewport: window.innerWidth,
      portraitLoaded: img.complete && img.naturalWidth > 0,
      portraitIsPlaceholder: img.naturalWidth === 1000,
      anton: document.fonts.check('200px Anton'),
      nameBottom: Math.round(document.querySelector('.og-name').getBoundingClientRect().bottom),
      footTop: Math.round(document.querySelector('.og-foot').getBoundingClientRect().top),
    }
  })

  // Each assertion below exists because something silently broke without it.
  if (!probe.portraitLoaded) throw new Error('portrait.png did not load into the card')
  if (!probe.anton) throw new Error('Anton did not load — the display word would render in a fallback')
  if (probe.megaWidth < probe.viewport) {
    throw new Error(`display word is ${probe.megaWidth}px in ${probe.viewport}px — not full bleed`)
  }
  if (probe.nameBottom > probe.footTop - 8) {
    throw new Error(`card content collides: name bottom ${probe.nameBottom} vs foot top ${probe.footTop}`)
  }

  const out = join(publicDir, 'og-card.jpg')
  await page.screenshot({ path: out, type: 'jpeg', quality: 92 })

  console.log(`og-card.jpg written (${cssName})`)
  console.log(`  display word ${probe.megaWidth}px in ${probe.viewport}px viewport`)
  console.log(`  page errors: ${errors.length ? errors.join('; ') : 'none'}`)
  if (probe.portraitIsPlaceholder) {
    console.log('  NOTE: card still shows the PLACEHOLDER silhouette — rerun after adding assets/hero.png')
  }
} finally {
  await browser.close()
  rmSync(genPage, { force: true })
}
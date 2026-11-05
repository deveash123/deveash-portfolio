/**
 * Produces `public/portrait.png` — the hero portrait with its background removed.
 *
 * WHY A REAL ALPHA CUTOUT AND NOT `mix-blend-mode: multiply`:
 * multiply would knock the white out for free, but it also blends the SUBJECT
 * toward the cream ground, which drains the skin tones and tints the black
 * jacket. The reference needs the portrait to stay a true cutout sitting on top
 * of the clay disc, so the alpha has to be genuine.
 *
 * The keying runs in a real browser via canvas, because:
 *   - GDI+/System.Drawing cannot decode the PNG reliably here
 *   - a canvas pass gets proper sRGB alpha and anti-aliased edges for free
 *
 * HOW IT WORKS: the source is a subject on a flat white studio background. Any
 * pixel whose luminance is high enough becomes transparent, with a soft ramp
 * between the two thresholds so hair edges do not turn into cut-out confetti.
 *
 * If `assets/hero.png` is missing, a neutral silhouette is drawn instead so the
 * layout is always complete and verifiable. Run `npm run portrait`.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const publicDir = join(root, 'public')
const sourcePath = join(root, 'assets', 'hero.png')
const outPath = join(publicDir, 'portrait.png')

mkdirSync(publicDir, { recursive: true })

/** Build the generator page that does the pixel work. */
function buildPage(dataUri) {
  return `<!doctype html><html><body><script>
const img = new Image();
img.onload = () => {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, c.height);
  const p = d.data;

  // Luminosity ramp: fully opaque at <= LUMA_KEEP, fully clear at >= LUMA_DROP.
  const LUMA_KEEP = 222, LUMA_DROP = 248;
  let keyed = 0;
  for (let i = 0; i < p.length; i += 4) {
    if (p[i + 3] === 0) continue;
    const l = 0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2];
    if (l <= LUMA_KEEP) continue;
    const t = l >= LUMA_DROP ? 0 : 1 - (l - LUMA_KEEP) / (LUMA_DROP - LUMA_KEEP);
    p[i + 3] = Math.round(p[i + 3] * t);
    if (t === 0) keyed++;
  }
  ctx.putImageData(d, 0, 0);
  window.__result = { data: c.toDataURL('image/png'), keyed, w: c.width, h: c.height };
};
img.onerror = () => { window.__result = { error: 'image failed to decode' }; };
img.src = ${JSON.stringify(dataUri)};
</script></body></html>`
}

/** Neutral placeholder, drawn rather than photographed, so nothing is faked. */
function buildPlaceholderPage() {
  return `<!doctype html><html><body><script>
const c = document.createElement('canvas');
c.width = 1000; c.height = 1200;
const x = c.getContext('2d');
x.clearRect(0, 0, 1000, 1200);
x.fillStyle = '#14120f';
// shoulders
x.beginPath();
x.moveTo(150, 1200);
x.bezierCurveTo(180, 900, 360, 790, 500, 790);
x.bezierCurveTo(640, 790, 820, 900, 850, 1200);
x.closePath(); x.fill();
// head
x.beginPath();
x.ellipse(500, 560, 205, 250, 0, 0, Math.PI * 2);
x.fill();
// collar
x.fillStyle = '#f2eee6';
x.beginPath();
x.moveTo(400, 830); x.lineTo(500, 940); x.lineTo(600, 830);
x.lineTo(560, 800); x.lineTo(500, 880); x.lineTo(440, 800);
x.closePath(); x.fill();
window.__result = { data: c.toDataURL('image/png'), keyed: -1, w: 1000, h: 1200 };
</script></body></html>`
}

async function render(html) {
  // Playwright + Chrome drive the canvas pixel pass. Neither is a dependency of
  // this project, so a machine without them must still be able to BUILD — so
  // this returns null instead of throwing, and the caller degrades.
  let chromium
  for (const specifier of [
    'playwright-core',
    // last resort: a global install of the Playwright CLI
    'C:/Users/GURU/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core/index.js',
  ]) {
    try {
      // ESM import needs a file:// URL; a bare Windows path is read as a
      // package specifier and fails, even though require() accepts it.
      const { pathToFileURL } = await import('node:url')
      const target = specifier.includes('/') ? pathToFileURL(specifier).href : specifier
      const mod = await import(target)
      // playwright-core is CommonJS; named exports may be hoisted or parked on
      // `default` depending on the loader. Accept both.
      chromium = mod.chromium ?? mod.default?.chromium
      if (chromium) break
    } catch {
      // try the next candidate
    }
  }
  if (!chromium) return { unavailable: 'playwright-core could not be loaded' }

  // Chrome location also differs per machine; without it there is still nothing
  // this script can do, so return rather than throw.
  const CHROME =
    process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  if (!existsSync(CHROME)) return { unavailable: `no Chrome at ${CHROME} (set CHROME_PATH)` }

  let browser
  try {
    browser = await chromium.launch({
      executablePath: CHROME,
      args: ['--no-sandbox', '--disable-gpu'],
    })
    const page = await browser.newPage()
    await page.setContent(html)
    const result = await page.evaluate(() => window.__result)
    if (!result || result.error) throw new Error(result?.error ?? 'canvas pass returned nothing')
    return result
  } catch (error) {
    return { unavailable: error.message }
  } finally {
    await browser?.close()
  }
}

/** 1x1 transparent PNG — stands in so the hero's <img> never renders broken. */
const BLANK_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
)

function warnUnavailable(reason) {
  if (!existsSync(outPath)) writeFileSync(outPath, BLANK_PNG)
  console.warn(
    `\n  !! portrait.png could NOT be regenerated: ${reason}\n` +
      '     A blank stand-in was written so the build still succeeds.\n' +
      '     Install Playwright (or set CHROME_PATH) and re-run `npm run portrait`\n' +
      '     once assets/hero.png exists. The hero will look empty until then.\n',
  )
}

const hasSource = existsSync(sourcePath)

if (hasSource) {
  const mime = /\.png$/i.test(sourcePath) ? 'image/png' : 'image/jpeg'
  const dataUri = `data:${mime};base64,${readFileSync(sourcePath).toString('base64')}`
  const result = await render(buildPage(dataUri))
  if (result.unavailable) {
    warnUnavailable(result.unavailable)
  } else {
    writeFileSync(outPath, Buffer.from(result.data.split(',')[1], 'base64'))
    console.log(
      `portrait.png <- assets/hero.png  ${result.w}x${result.h}, ${result.keyed.toLocaleString()} px cleared`,
    )
  }
} else {
  const result = await render(buildPlaceholderPage())
  if (result.unavailable) {
    warnUnavailable(result.unavailable)
  } else {
    writeFileSync(outPath, Buffer.from(result.data.split(',')[1], 'base64'))
    console.log(
      'portrait.png <- PLACEHOLDER SILHOUETTE (assets/hero.png not found).\n' +
        '  Save your photo as assets/hero.png and run `npm run portrait` to swap it in.',
    )
  }
}

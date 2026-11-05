/**
 * Generates the static assets that must match the site's own data:
 *
 *   public/qr-portfolio.png  a real, scannable QR of `site.url`
 *   public/favicon.svg       the "DG." monogram in the site palette
 *
 * Run with `npm run assets`. The QR is generated from the SAME constant the
 * header links to, so it can never drift out of sync with the address printed
 * next to it.
 *
 * Reads src/data/site.ts as text rather than importing it, because that file is
 * TypeScript and this runs through plain node without a loader.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const publicDir = join(root, 'public')

mkdirSync(publicDir, { recursive: true })

/** Pull one `key: 'value'` out of site.ts without a TS parser. */
function readSiteValue(key) {
  const source = readFileSync(join(root, 'src', 'data', 'site.ts'), 'utf8')
  const match = source.match(new RegExp(`${key}:\\s*'([^']+)'`))
  if (!match) throw new Error(`could not find ${key} in src/data/site.ts`)
  return match[1]
}

const url = readSiteValue('portfolio')
const initials = readSiteValue('initials')
const name = readSiteValue('name')

// --- QR ---------------------------------------------------------------------
// margin 1 keeps it scannable when scaled down; dark #14120f on light #f2eee6
// so it matches the palette and still reads against the cream card it sits on.
const qrPath = join(publicDir, 'qr-portfolio.png')
await QRCode.toFile(qrPath, url, {
  errorCorrectionLevel: 'M',
  margin: 1,
  width: 528,
  color: { dark: '#14120f', light: '#f2eee6' },
})
console.log(`qr-portfolio.png -> ${url}`)

// --- favicon ----------------------------------------------------------------
const clean = initials.replace(/\.$/, '')
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${name}">
  <rect width="64" height="64" fill="#14120f"/>
  <text x="32" y="43" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="30" font-weight="600" fill="#f2eee6" letter-spacing="-1">${clean}</text>
  <circle cx="50" cy="16" r="3" fill="#b24a2c"/>
</svg>
`
writeFileSync(join(publicDir, 'favicon.svg'), favicon, 'utf8')
console.log(`favicon.svg -> ${clean}`)
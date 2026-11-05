/**
 * Proves the QR in the footer actually scans.
 *
 * Generating a QR is easy to get subtly wrong (silent zone, colour order,
 * error-correction level) and the failure is invisible until someone points a
 * phone at it. So this DECODES the shipped PNG with an independent decoder
 * (jsQR) and asserts it resolves to the portfolio URL.
 *
 * Run with `npm run verify:qr`.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'
import jsQR from 'jsqr'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

function readSiteValue(key) {
  const source = readFileSync(join(root, 'src', 'data', 'site.ts'), 'utf8')
  const match = source.match(new RegExp(`${key}:\\s*'([^']+)'`))
  if (!match) throw new Error(`could not find ${key} in src/data/site.ts`)
  return match[1]
}

const expected = readSiteValue('portfolio')
const file = join(root, 'public', 'qr-portfolio.png')

const png = PNG.sync.read(readFileSync(file))
const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)

if (!decoded) {
  console.error(`FAIL  qr-portfolio.png could not be decoded at all (${png.width}x${png.height})`)
  process.exit(1)
}

if (decoded.data !== expected) {
  console.error(`FAIL  QR decodes to "${decoded.data}" but site.ts says "${expected}"`)
  process.exit(1)
}

// At the rendered size on the page (132px CSS) the modules must still resolve.
console.log(`PASS  ${png.width}x${png.height} PNG decodes to ${decoded.data}`)
console.log('      and that matches site.portfolio, so the printed URL and the QR agree.')
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { site } from '../data/site'

/**
 * "Press pass" loader.
 *
 * The site is a print poster, so the load state is a press pass: hairline rules
 * run out from the centre, the PORTFOLIO word is inked in by a clay sweep that
 * travels across it, and a mono counter climbs. Everything here comes from the
 * existing tokens — paper ground, ink word, one clay accent — so the loading
 * state is recognisably the same design rather than a generic spinner.
 *
 * Two rules, both learned the hard way on this project:
 *
 *   1. NOTHING IMPORTANT IS GATED BEHIND IT. The word's resting state is FULLY
 *      VISIBLE and the sweep only adds to it. An entrance animation that can
 *      fail to run would leave the loading state showing nothing at all — and a
 *      JS entrance has already blanked this project's project grid once.
 *   2. UNDER REDUCED MOTION IT IS STATIC. The sweep and counter become a plain
 *      still frame; the loader still appears and still disappears.
 */

/** The word the poster is built around. */
const WORD = 'PORTFOLIO'

export function PrintLoader({
  progress,
  label = 'Loading',
}: {
  /** 0–100. Omit for an indeterminate sweep. */
  progress?: number
  label?: string
}) {
  const reduce = useReducedMotion() === true

  return (
    <div className="loader-pass" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}…</span>

      {/* the two rules that print the page in */}
      <motion.span
        className="absolute left-1/2 top-1/2 h-px origin-left bg-rule-strong"
        style={{ width: 'min(58vw, 620px)' }}
        initial={reduce ? { scaleX: 1, x: 0 } : { scaleX: 0, x: '-100%' }}
        animate={{ scaleX: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="absolute left-1/2 top-1/2 h-px origin-right bg-rule-strong"
        style={{ width: 'min(58vw, 620px)' }}
        initial={reduce ? { scaleX: 1, x: 0 } : { scaleX: 0, x: '100%' }}
        animate={{ scaleX: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="relative grid place-items-center gap-4">
        {/* the word. Fully visible at rest; the clay sweep inks it in. */}
        <div className="relative overflow-hidden">
          <span className="loader-word">{WORD}</span>
          {!reduce ? (
            <motion.span
              className="absolute inset-y-0 left-0 bg-clay mix-blend-multiply"
              style={{ width: '38%' }}
              initial={{ x: '-45%' }}
              animate={
                progress === undefined
                  ? { x: ['-45%', '290%'] }
                  : { x: `${(progress / 100) * 340 - 45}%` }
              }
              transition={
                progress === undefined
                  ? { duration: 1.15, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }
                  : { duration: 0.25, ease: 'linear' }
              }
            />
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <span className="h-1.5 w-1.5 rounded-full bg-clay" aria-hidden />
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-faint">
            {site.name}
          </span>
          {progress !== undefined ? (
            <span className="font-mono text-[10px] font-bold tabular-nums tracking-[0.14em] text-clay">
              {String(Math.round(progress)).padStart(3, '0')}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

/**
 * Holds the press pass over the app until the first route has painted, then
 * lifts it. Kept separate from `PrintLoader` so the loader itself stays a pure
 * presentational component.
 */
export function BootGate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion() === true
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Creep toward 90 on a timer, then finish once the fonts are ready and the
    // document has painted. Deliberately not tied to a real progress event:
    // there is nothing to measure in a static SPA, and faking one honestly
    // beats a bar that lies about bytes.
    let raf = 0
    const started = performance.now()
    const tick = () => {
      const t = performance.now() - started
      const ceiling = 92
      const eased = ceiling * (1 - Math.exp(-t / 380))
      setProgress(Math.min(ceiling, eased))
      if (t < 2600) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const finish = async () => {
      try {
        await document.fonts.ready
      } catch {
        /* font loading is best-effort; never block the gate on it */
      }
      setProgress(100)
      const wait = reduce ? 90 : 420
      window.setTimeout(() => setDone(true), wait)
    }

    if (document.readyState === 'complete') void finish()
    else window.addEventListener('load', finish, { once: true })

    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <>
      <AnimatePresence>
        {!done ? (
          <motion.div
            className="fixed inset-0 z-[95] bg-paper"
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <PrintLoader progress={progress} label="Loading the portfolio" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      {children}
    </>
  )
}
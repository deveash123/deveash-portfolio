import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * The site cursor: a **printer's crop mark** with a solid registration point.
 *
 * Previous attempts: a filled clay disc (read as a stock blob) and then a thin
 * hollow ring (measured at 26px / 0.55 opacity, which is genuinely invisible on
 * the cream ground — the owner reported it as "not visible", correctly).
 *
 * This version is legible on BOTH grounds the pointer crosses — the cream page
 * and the black jacket in the hero — by pairing a near-black ring with a paper
 * halo behind it, and giving the centre a SOLID clay point rather than a hairline.
 * The ring is drawn as four arcs with gaps, which is what makes it read as a
 * crop/registration mark instead of a plain circle, and gives the rotation on
 * hover something visible to rotate.
 *
 *   rest  — crop-mark ring + solid clay point
 *   hover — ring grows, arcs rotate a quarter turn, label arrives as an ink tag
 *   click — a hairline ring expands once and fades
 *
 * Performance contract (this follows the pointer at display refresh rate):
 *   1. SIZE IS A TRANSFORM, NOT A BOX. Fixed 60px square, `scale` only.
 *   2. THE HAIRLINE NEVER THINS. `vector-effect: non-scaling-stroke`.
 *   3. NO BACKDROP FILTER — it would re-blur the backdrop every frame.
 *   4. COLOUR IS A PAINT-ONLY CROSS-FADE via CSS opacity.
 */

/** Outer box == the largest state. Fixed, so layout never moves. */
const BOX = 60
const REST = 30
const ACTIVE = 48
const REST_SCALE = REST / BOX
const ACTIVE_SCALE = ACTIVE / BOX

/** Circumference of the r=27 ring is ~169.6; 4 arcs of 18.2 + 4 gaps of 24.2. */
const RING_R = 27
const ARC = `${(2 * Math.PI * RING_R) / 8 - 3.6} 7.2`

export function EditorialCursor() {
  // v14 returns `boolean | null`; coerce explicitly rather than on falsiness.
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [ripple, setRipple] = useState(0)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.42 })
  const springY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.42 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const sync = () => setEnabled(fine.matches && reduceMotion !== true)
    sync()
    fine.addEventListener('change', sync)
    return () => fine.removeEventListener('change', sync)
  }, [reduceMotion])

  // Mirrors of state so the pointer listener can compare against the last value
  // it pushed. `pointermove` fires at display refresh rate, so calling setState
  // unconditionally would re-render the tree ~120x/second for values that
  // almost never change.
  const labelRef = useRef('')
  const visibleRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const move = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)

      if (!visibleRef.current) {
        visibleRef.current = true
        setVisible(true)
      }

      const target = (event.target as Element | null)?.closest<HTMLElement>('[data-cursor]')
      const next = target?.dataset.cursorLabel ?? ''
      if (next !== labelRef.current) {
        labelRef.current = next
        setLabel(next)
      }
    }

    const down = () => setPressed(true)
    const up = () => setPressed(false)

    const leave = () => {
      if (labelRef.current !== '') {
        labelRef.current = ''
        setLabel('')
      }
      if (visibleRef.current) {
        visibleRef.current = false
        setVisible(false)
      }
      setPressed(false)
    }

    const click = () => setRipple((n) => n + 1)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    window.addEventListener('pointerleave', leave)
    document.addEventListener('pointerleave', leave)
    window.addEventListener('click', click, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointerleave', leave)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('click', click)
    }
    // `visible` is deliberately NOT a dependency. It used to be, which tore the
    // pointermove listener down and re-added it on every visibility flip.
  }, [enabled, x, y])

  useEffect(() => {
    if (!enabled) return
    // Deferred a tick so the native cursor is never hidden before the custom one
    // can paint. If this never mounts (no JS, coarse pointer, reduced motion)
    // the class is never added and the real cursor is left alone.
    const id = window.setTimeout(() => document.documentElement.classList.add('cursor-hidden'), 0)
    return () => {
      window.clearTimeout(id)
      document.documentElement.classList.remove('cursor-hidden')
    }
  }, [enabled])

  if (!enabled) return null

  const active = label.length > 0
  // A press tucks the mark in slightly, like pushing a stamp onto paper.
  const scale = (active ? ACTIVE_SCALE : REST_SCALE) * (pressed ? 0.88 : 1)

  return (
    <motion.div
      aria-hidden
      data-cursor-root=""
      className="pointer-events-none fixed top-0 left-0 z-[90] grid place-items-center"
      style={{ x: springX, y: springY, translate: '-50% -50%', width: BOX, height: BOX }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.16 }}
    >
      {/* click ripple: a hairline ring expanding once and fading */}
      {ripple > 0 ? (
        <motion.span
          key={ripple}
          className="absolute rounded-full border border-clay"
          style={{ width: ACTIVE, height: ACTIVE }}
          initial={{ scale: 0.45, opacity: 0.55 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}

<motion.span
        // `ec-on` must sit on the MARK, not on a child: the CSS cross-fade
        // targets `.ec-on .ec-ring` / `.ec-on .ec-disc`, so the class has to be
        // on a common ancestor of the circles. Putting it on the centre
        // point silently left the clay ring switched off in the active state.
        className={`ec-mark relative grid place-items-center rounded-full${active ? ' ec-on' : ''}`}
        style={{ width: BOX, height: BOX }}
        initial={false}
        animate={{ scale, rotate: active ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 24 }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 60 60">
          {/* paper halo: keeps the mark readable over the black jacket */}
          <circle
            cx="30" cy="30" r={RING_R}
            className="ec-halo"
            strokeDasharray={ARC}
            vectorEffect="non-scaling-stroke"
          />
          {/* the four crop arcs, in ink at rest and clay when active */}
          <circle
            cx="30" cy="30" r={RING_R}
            className="ec-ring"
            strokeDasharray={ARC}
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="30" cy="30" r={RING_R}
            className="ec-disc"
            strokeDasharray={ARC}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* the registration point: solid, so it never disappears into the page */}
        <span className="ec-point" />
      </motion.span>

      {/* the label sits under the mark, where it has room to be read */}
      <span className={`ec-tag ${active ? 'ec-tag-on' : ''}`}>{label}</span>
    </motion.div>
  )
}
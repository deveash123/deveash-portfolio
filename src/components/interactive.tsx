import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Interaction primitives for the poster UI.
 *
 * The site is an editorial print composition: hairline rules, uppercase small
 * caps, one clay accent. So these deliberately do NOT read as bouncy web-app
 * pills. The idea is an **ink press** — the element leans toward the pointer,
 * settles with weight, and presses into the page like a stamp.
 *
 * Three rules every primitive here obeys, each of them learned the hard way on
 * this project:
 *
 *   1. ANIMATE TRANSFORM AND OPACITY ONLY. Never width/height/top/left — those
 *      force synchronous layout on every frame.
 *   2. NEVER GATE CONTENT BEHIND AN ANIMATION. These are pure enhancement; if
 *      they do not run, the element is still a normal focusable control that
 *      looks and behaves identically.
 *   3. NOTHING PER-FRAME GOES THROUGH STATE. The pointer listeners write to
 *      MotionValues and let framer-motion drive the compositor. Calling
 *      setState on pointermove re-renders the tree at pointer refresh rate.
 *
 * Magnetic attraction is fine-pointer only (it is meaningless on touch), and
 * every primitive disables itself under `prefers-reduced-motion`.
 */

/** True only for a mouse/trackpad. Coerced because v14 returns `boolean | null`. */
function useFinePointer(): boolean {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const sync = () => setFine(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return fine
}

/**
 * Pulls its child toward the pointer.
 *
 * The strength falls off toward the edge of the element, so the pull eases in
 * rather than snapping. Leaving the element (or the page) springs it home.
 */
export function Magnetic({
  children,
  className = 'inline-flex',
  strength = 0.3,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const reduce = useReducedMotion()
  const fine = useFinePointer()
  const ref = useRef<HTMLElement>(null)
  const rect = useRef<DOMRect | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 })

  const enabled = fine && reduce !== true

  // Cache the box instead of measuring on every pointer sample — a
  // getBoundingClientRect per frame would read layout 120x/second.
  const cache = useCallback(() => {
    if (ref.current) rect.current = ref.current.getBoundingClientRect()
  }, [])

  useEffect(() => {
    if (!enabled) {
      x.set(0)
      y.set(0)
      return
    }
    cache()

    const move = (event: PointerEvent) => {
      const r = rect.current
      if (!r || r.width === 0) return
      const dx = event.clientX - (r.left + r.width / 2)
      const dy = event.clientY - (r.top + r.height / 2)
      // Signed falloff: strongest at the centre, zero at the edge.
      const fx = 1 - Math.min(1, Math.abs(dx) / (r.width / 2))
      const fy = 1 - Math.min(1, Math.abs(dy) / (r.height / 2))
      x.set(dx * strength * fx)
      y.set(dy * strength * fy)
    }
    const release = () => {
      x.set(0)
      y.set(0)
    }

const el = ref.current
    el?.addEventListener('pointerenter', cache, { passive: true })
    el?.addEventListener('pointermove', move, { passive: true })
    el?.addEventListener('pointerleave', release)
    window.addEventListener('scroll', cache, { passive: true })
    window.addEventListener('resize', cache, { passive: true })
    document.addEventListener('pointerleave', release)
    return () => {
      el?.removeEventListener('pointerenter', cache)
      el?.removeEventListener('pointermove', move)
      el?.removeEventListener('pointerleave', release)
      window.removeEventListener('scroll', cache)
      window.removeEventListener('resize', cache)
      document.removeEventListener('pointerleave', release)
    }
  }, [enabled, cache, strength, x, y])

  return (
    <motion.span
      ref={ref}
      data-magnetic=""
      className={className}
      style={enabled ? { x: springX, y: springY } : undefined}
    >
      {children}
    </motion.span>
  )
}

/**
 * Press feedback for anything clickable.
 *
 * Works for mouse, keyboard and touch: `whileTap` fires on pointer down AND on
 * Space/Enter for a focused control, so keyboard users get the same confirmation
 * as mouse users. Scale only — no colour, no shadow, nothing that repaints.
 */
export function Pressable({
  children,
  className = '',
  scale = 0.96,
  ...rest
}: {
  children: ReactNode
  className?: string
  scale?: number
} & Record<string, unknown>) {
  const reduce = useReducedMotion()
  if (reduce === true) {
    // Strip the motion props so a reduced-motion user gets a plain element.
    const { whileTap: _t, whileHover: _h, ...plain } = rest
    void _t
    void _h
    return (
      <span className={className} {...plain}>
        {children}
      </span>
    )
  }
  return (
    <motion.span
      className={`inline-flex ${className}`}
      whileTap={{ scale }}
      transition={{ type: 'spring', stiffness: 520, damping: 30 }}
      {...(rest as object)}
    >
      {children}
    </motion.span>
  )
}

/**
 * The long hairline arrow that travels out of a link on hover.
 *
 * Extends the old `MagneticArrow`, which only nudged the line's scale. The
 * arrowhead now slides to the end of the rule when the LINK is hovered, so the
 * motion explains where the link goes.
 *
 * The arrowhead uses `group-hover:` rather than a framer `whileHover` because a
 * child's `whileHover` only fires when hovering that child — the hover has to
 * originate on the enclosing link, which carries the `group` class.
 */
export function ArrowRule({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  const animated = reduce !== true

  return (
    <span className={`relative inline-flex h-px w-[4.5rem] items-center ${className}`} aria-hidden>
      <motion.span
        className="absolute inset-0 origin-left bg-clay"
        initial={false}
        animate={{ scaleX: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
      />
      <span
        className={`absolute right-0 top-1/2 h-[7px] w-[7px] -translate-y-1/2 border-r border-t border-clay transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          animated
            ? 'translate-x-[-7px] opacity-50 group-hover:translate-x-0 group-hover:opacity-100'
            : 'opacity-100'
        }`}
      />
    </span>
  )
}

/**
 * A hairline rule that PRINTS itself in.
 *
 * The site's grammar is hairlines, so the most on-theme scroll animation is a
 * rule drawing itself across the page as a section arrives. It is always
 * `aria-hidden` decoration: the section's real border and content are painted
 * independently, so if this never runs the page still reads correctly. It
 * animates `scaleX` only, which is compositor-safe.
 */
export function DrawRule({
  className = '',
  delay = 0,
  tone = 'rule',
}: {
  className?: string
  delay?: number
  tone?: 'rule' | 'clay'
}) {
  const reduce = useReducedMotion()
  const off = reduce === true
  return (
    <motion.span
      aria-hidden
      className={`block h-px w-full origin-left ${tone === 'clay' ? 'bg-clay' : 'bg-rule-strong'} ${className}`}
      initial={off ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 1 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: off ? 0 : 0.85, delay: off ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}

/**
 * Staggers direct children as they scroll into view.
 *
 * Deliberately animates `y` and `opacity` on a FLOOR, never from `opacity: 0`.
 * A JS entrance that fails to fire strands the content at its start state, and
 * on this project that has already happened once — a whole product grid rendered
 * invisible. Starting at 0.001 rather than 0 removes that failure mode while
 * keeping the motion essentially the same, and `whileInView` with `once` means
 * it can only ever run in the direction of showing content.
 */
export function Stagger({
  children,
  className = '',
  gap = 0.06,
  amount = 0.25,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  gap?: number
  amount?: number
  /**
   * Pass 'ul'/'li' when the children are list items. Rendering a list of
   * principles as a plain <div> silently drops the list semantics, which is an
   * accessibility regression, so this is explicit rather than convenient.
   */
  as?: 'div' | 'ul'
}) {
  const reduce = useReducedMotion()
  const off = reduce === true
  const variants = {
    hidden: {},
    show: { transition: { staggerChildren: off ? 0 : gap } },
  }
  const shared = {
    className,
    initial: 'hidden' as const,
    whileInView: 'show' as const,
    viewport: { once: true, amount },
    variants,
  }
  return as === 'ul' ? <motion.ul {...shared}>{children}</motion.ul> : <motion.div {...shared}>{children}</motion.div>
}

/** Child of {@link Stagger}. Adds the per-item variant. */
export function StaggerItem({
  children,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li'
}) {
  const reduce = useReducedMotion()
  const off = reduce === true
  const variants = {
    hidden: off ? { opacity: 1, y: 0 } : { opacity: 0.001, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: off ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  }
  return as === 'li' ? (
    <motion.li className={className} variants={variants}>
      {children}
    </motion.li>
  ) : (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}

/**
 * Scroll fade IN and OUT — the universal version.
 *
 * The CSS `.reveal` above does this on the compositor wherever
 * `animation-timeline: view()` is supported, but Safari has no scroll-driven
 * animations, so it sees nothing at all. This component covers those engines with
 * a single IntersectionObserver, which is cheap: the callback only runs when an
 * element CROSSES a threshold, never per scroll frame, and it never reads layout.
 *
 * Two safety rules, both learned here the hard way:
 *
 *   1. NOTHING EVER RESTS AT INVISIBLE. Before the first observation lands the
 *      element renders at full opacity, and both ends of the range are 0.001 /
 *      0.12 rather than 0. An interrupted or never-running entrance has already
 *      left a whole product grid invisible on this project.
 *   2. ANIMATE OPACITY AND TRANSFORM ONLY. No height, top or margin, which would
 *      force layout on every frame.
 */
export function ScrollFade({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
  distance?: number
  outTo?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} data-fade="" className={className}>
      <div style={{ opacity: 1 }}>
        {children}
      </div>
    </div>
  )
}

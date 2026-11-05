import type { ReactNode } from 'react'
import { ArrowRule } from './interactive'

/** Two-line poster heading: first line ink, second line clay, as in the reference. */
export function PosterHeading({ one, two }: { one: string; two: string }) {
  return (
    <h2 className="poster-h2">
      <span className="block">{one}</span>
      <span className="block text-clay">{two}</span>
    </h2>
  )
}

/**
 * The long thin arrow used on every "view all" link.
 *
 * The rule is a shared framer-motion primitive so its travel is spring-driven
 * and consistent across every action link on the site, rather than each link
 * re-implementing its own hairline.
 */
export function ArrowLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 text-[11.5px] font-semibold uppercase tracking-[0.18em]">
      {children}
      <ArrowRule />
    </span>
  )
}

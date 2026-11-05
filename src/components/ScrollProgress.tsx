import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Scroll progress hairline in clay. Fixed to the very top so it reads as a rule
 * being drawn across the page rather than as a floating bar.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.3 })

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-[60] h-[2px] w-full origin-left bg-clay"
      style={{ scaleX }}
    />
  )
}
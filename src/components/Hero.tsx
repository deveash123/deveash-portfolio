import { motion, useReducedMotion } from 'framer-motion'
import { availability, intro, site } from '../data/site'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * The poster hero, built to the reference's geometry:
 *
 *   - the PORTFOLIO word runs the full inner width, un-cropped
 *   - the portrait stands IN FRONT of the word's lower edge
 *   - a clay disc sits behind the portrait, resting on the hairline
 *   - the copy column sits bottom-left, the rotating seal on the right shoulder
 *
 * Every position is a percentage of the inner width, so the composition scales
 * as one piece instead of reflowing.
 */
export function Hero() {
  const reduceMotion = useReducedMotion()
  const enter = (delay: number) =>
    reduceMotion
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        }

  return (
    <section id="home" className="poster-hero relative border-b border-rule" aria-labelledby="hero-name">
      <div className="poster-inner mx-auto max-w-[1240px] px-[var(--gutter)] pt-5 lg:px-[5.25rem]">
        {/* Anton glyph box measured at 100px: ink spans x 3..382, cap height 87.
            preserveAspectRatio="none" stretches it to the reference's tall proportion.

            The word is the back-most paper layer, so it drifts the least. */}
        <svg
          className="mega-svg"
          viewBox="3 0 379 88"
          preserveAspectRatio="none"
          role="img"
          aria-label="Portfolio"
        >
          <text x="0" y="87" fontFamily="var(--font-display)" fontSize="100" fill="currentColor">
            PORTFOLIO
          </text>
        </svg>

        <div className="stage-wrap">
        <div className="stage">
          {/* the disc presses into the page like a stamp */}
          <motion.div
            className="stage-disc"
            aria-hidden
            initial={reduceMotion ? false : { scale: 0.72, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.img
            src="/portrait.png"
            alt={`${site.name} — ${site.role}`}
            width={1254}
            height={1254}
            fetchPriority="high"
            decoding="async"
            className="stage-portrait"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease }}
          />

          <AvailabilitySeal reduceMotion={reduceMotion === true} />
        </div>

          <div className="stage-copy">
            <motion.p className="font-sans text-[clamp(12.5px,1.4cqw,15.5px)] font-medium uppercase tracking-[0.14em]" {...enter(0.05)}>
              Hello, I&rsquo;m
            </motion.p>

            <motion.h1 id="hero-name" className="hero-name" {...enter(0.12)}>
              {site.name}
            </motion.h1>

            <motion.p className="hero-role" {...enter(0.2)}>
              {site.role.split(' · ').slice(0, 2).join(' & ')}
            </motion.p>

            <motion.p className="hero-intro" {...enter(0.28)}>
              {intro}
            </motion.p>

            <motion.p aria-hidden className="hero-sign" {...enter(0.36)}>
              {site.name}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Rotating ring text is real SVG <textPath>, so it stays crisp and selectable. */
function AvailabilitySeal({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="seal" aria-hidden>
      <motion.svg
        viewBox="0 0 200 200"
        className="h-full w-full"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={reduceMotion ? undefined : { duration: 30, ease: 'linear', repeat: Infinity }}
      >
        <defs>
          <path id="seal-ring" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
        <text
          fill="currentColor"
          style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', fontWeight: 600, letterSpacing: '3.1px', textTransform: 'uppercase' }}
        >
          <textPath href="#seal-ring" startOffset="0%">
            {`${availability.ring} · ${availability.ring} · `}
          </textPath>
        </text>
      </motion.svg>

      <p className="seal-core">
        {availability.sealTitle}
        <br />
        {availability.sealBody}
      </p>
    </div>
  )
}

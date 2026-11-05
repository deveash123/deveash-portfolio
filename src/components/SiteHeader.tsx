import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { availability, navLinks, site } from '../data/site'
import { Magnetic } from './interactive'

/**
 * The reference's top strip: mark and role on the left, availability and a long
 * arrow on the right. It stays sticky so the navigation is always reachable.
 *
 * Navigation targets SECTIONS of the landing page, not routes. When the reader
 * is already home the click is a plain in-page scroll; from any other page it
 * routes home first, then scrolls once the new document has painted. The active
 * section is tracked so the current one reads as clay.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const location = useLocation()
  const navigate = useNavigate()
  // v14 returns `boolean | null`; coerce explicitly rather than on falsiness.
  const reduceMotion = useReducedMotion() === true

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // A modal menu must not leave the page scrollable behind it.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  /**
   * Scroll-spy. Only meaningful on the landing page; on any other route the
   * whole page is one section and the header shows Home.
   */
  useEffect(() => {
    if (location.pathname !== '/') {
      setActive('home')
      return
    }
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null)
    if (!sections.length) return

    // The line sits a third down the viewport, so a section counts as "current"
    // once its heading has passed that band.
    const onScroll = () => {
      const line = window.scrollY + window.innerHeight / 3
      let current = sections[0]?.id ?? 'home'
      for (const section of sections) {
        if (section.offsetTop <= line) current = section.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location.pathname])

  const goTo = useCallback(
    (id: string) => {
      setOpen(false)

      const scroll = () => {
        const target = document.getElementById(id)
        if (!target) return
        // `scroll-margin-top` handles the sticky header; CSS `scroll-behavior`
        // supplies the easing and is already disabled under reduced motion.
        target.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        })
        setActive(id)
        // Move focus without a second scroll, so the next Tab continues from
        // the section the reader asked for rather than from the top of the page.
        target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      }

      /**
       * Wait for the scroll to actually be possible, then do it.
       *
       * Two independent reasons this cannot be a plain synchronous call:
       *
       * 1. `AnimatePresence mode="wait"` keeps the OUTGOING page mounted for the
       *    whole exit transition, so after `navigate('/')` the home sections are
       *    not in the DOM yet. A fixed timeout or a double rAF both fire far
       *    too early and the scroll silently does nothing.
       * 2. On mobile the nav click closes the menu, and the open menu sets
       *    `body { overflow: hidden }` in an effect. `scrollIntoView` called
       *    while that is still applied is **silently ignored** — which is why
       *    tapping a nav item on a phone left the hero 234px above the viewport
       *    with the PORTFOLIO word hidden behind the bar.
       *
       * Polls for both conditions with a frame budget so it can never spin.
       */
      const scrollWhenReady = (budget = 120) => {
        let frames = 0
        const tick = () => {
          const locked = document.body.style.overflow === 'hidden'
          if (!locked && document.getElementById(id)) {
            scroll()
            return
          }
          if (frames++ < budget) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }

      if (location.pathname === '/') {
        scrollWhenReady()
        return
      }

      navigate('/')
      scrollWhenReady()
    },
    [location.pathname, navigate],
  )

  const linkClass = (id: string) =>
    `relative text-[12px] font-extrabold uppercase tracking-[0.2em] transition-colors ${
      active === id ? 'text-clay' : 'text-ink-soft hover:text-clay'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b border-rule bg-paper/85 backdrop-blur-md transition-[padding] duration-300 ${
        scrolled ? 'py-2.5' : 'py-4'
      }`}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-6 px-[var(--gutter)]">
        <button
          type="button"
          onClick={() => goTo('home')}
          data-cursor
          data-cursor-label="Top"
          className="flex items-baseline gap-3"
        >
          <span aria-hidden className="text-[1.05rem] leading-none text-clay">✳</span>
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-ink">
            {site.role.split(' · ')[0]}
          </span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => goTo(link.id)}
              data-cursor
              data-cursor-label={link.label}
              aria-current={active === link.id ? 'true' : undefined}
              className={linkClass(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Replaces the old "open to internships & collaboration" strip. The
              availability wording itself still lives in `availability.barLabel`
              and is shown in the Hire section and on /contact. */}
<Magnetic strength={0.22}>
            <motion.button
              type="button"
              onClick={() => goTo('hire')}
              data-cursor
              data-cursor-label="Hire"
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 520, damping: 30 }}
              className="group inline-flex items-center gap-2 border border-ink px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
            >
              Hire freelancer
              <ArrowUpRight
                size={13}
                strokeWidth={2.6}
                className="text-clay transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper"
                aria-hidden
              />
            </motion.button>
          </Magnetic>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            data-cursor
            className="grid h-9 w-9 place-items-center border border-rule-strong text-ink lg:hidden"
          >
            {open ? <X size={16} strokeWidth={2} /> : <Menu size={16} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="border-t border-rule bg-paper lg:hidden">
          <nav className="mx-auto flex max-w-[1180px] flex-col px-[var(--gutter)] py-3" aria-label="Mobile">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => goTo(link.id)}
                data-cursor
                data-cursor-label={link.label}
                aria-current={active === link.id ? 'true' : undefined}
                className={`border-b border-rule py-3.5 text-left text-[13.5px] font-extrabold uppercase tracking-[0.2em] ${
                  active === link.id ? 'text-clay' : 'text-ink-soft'
                }`}
              >
                {link.label}
              </button>
            ))}
            <p className="py-4 text-[12.5px] font-bold uppercase tracking-[0.16em] text-clay">
              {availability.barLabel}
            </p>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
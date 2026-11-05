import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Suspense, lazy, useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { EditorialCursor } from './components/EditorialCursor'
import { BootGate } from './components/PrintLoader'
import { RouteSkeleton } from './components/RouteSkeleton'
import { ScrollProgress } from './components/ScrollProgress'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

const WorkPage = lazy(() => import('./pages/WorkPage').then((m) => ({ default: m.WorkPage })))
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
)
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const DirectionPage = lazy(() =>
  import('./pages/DirectionPage').then((m) => ({ default: m.DirectionPage })),
)
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))

/**
 * Route transition: the outgoing page lifts away while a clay hairline wipes
 * across the top of the frame.
 *
 * The opacity FLOOR is deliberate and must stay: an exit that reaches
 * `opacity: 0` and an entrance that starts there will strand a page invisible if
 * the animation is interrupted (a fast double-navigation), which has happened
 * on this project. The hairline is decoration that carries the motion on its
 * own, so the page never depends on it being visible.
 */
function PageTransition({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <>{children}</>
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-clay"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
        exit={{ scaleX: 0, opacity: 0 }}
        transition={{ scaleX: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }, duration: 0.8 }}
      />
      <motion.div
        initial={{ opacity: 0.35, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </>
  )
}

/**
 * Every navigation resets scroll AND moves focus, so keyboard and screen-reader
 * users are never left stranded partway down the previous page.
 */
function useRouteReset(pathname: string) {
  const previous = useRef(pathname)
  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    window.scrollTo({ top: 0, behavior: 'auto' })
    const target = document.getElementById('main')
    if (target) {
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }
  }, [pathname])
}

export default function App() {
  const location = useLocation()
  useRouteReset(location.pathname)

  return (
    <BootGate>
      <div className="min-h-dvh bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2.5 focus:text-[12.5px] focus:font-extrabold focus:uppercase focus:tracking-[0.14em]"
      >
        Skip to content
      </a>

      <EditorialCursor />
      <ScrollProgress />
      <SiteHeader />

      <main id="main">
        <AnimatePresence mode="wait" initial={false}>
          <div key={location.pathname}>
            <PageTransition>
              <Suspense fallback={<RouteSkeleton />}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/work" element={<WorkPage />} />
                  <Route path="/work/:slug" element={<ProjectDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/direction" element={<DirectionPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </PageTransition>
          </div>
        </AnimatePresence>
      </main>

      <SiteFooter />
      </div>
    </BootGate>
  )
}

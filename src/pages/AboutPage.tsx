import { AboutSection } from '../components/sections'

/**
 * The About content now lives in `components/sections.tsx` and is mounted both
 * inline on the landing page and here, so this route keeps working for direct
 * links, sharing and search while there is only ONE definition of the content.
 */
export function AboutPage() {
  return <AboutSection />
}
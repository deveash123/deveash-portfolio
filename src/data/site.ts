/**
 * Single source of truth for identity, links and outbound destinations.
 * Anything not verified by the owner stays `null` and is simply not rendered —
 * the site must never advertise a download or a link that does not exist.
 */

export const site = {
  initials: 'DG.',
  name: 'Deveash G.',
  /** the short form he uses in the reference's "HELLO, I'M" slot */
  shortName: 'Deveash',
  /**
   * The positioning label. The owner asked for AI removed from the branding, so
   * it no longer names AI as a title. It is deliberately the same character
   * count as the label it replaced, so the header row does not re-flow.
   *
   * Capability language that mentions AI is KEPT elsewhere (`intro`,
   * `about.body`, `taglines`, the skill groups), because those describe what he
   * actually builds and removing them would understate the work.
   */
  role: 'Product Developer · Game Developer · App Developer',
  location: 'Chennai, Tamil Nadu, India',
  shortLocation: 'Chennai, India',
  email: 'gdeveash@gmail.com',
  github: 'https://github.com/deveash123',
  linkedin: 'https://www.linkedin.com/in/deveashg',
  portfolio: 'https://gdeveash.vercel.app',
  /**
   * TODO(owner): drop a real PDF at public/Deveash-G-Resume.pdf and point this at
   * "/Deveash-G-Resume.pdf". The resume button renders only once this is set, so
   * the site can never offer a download that 404s.
   */
  resumeUrl: null as string | null,
} as const

/** The reference's "AVAILABLE FOR FREELANCE" strip. Restated in his own terms. */
export const availability = {
  /** top bar */
  barLabel: 'Open to internships & collaboration',
  /** the ring text around the rotating seal */
  ring: 'Internships · Collaboration · Projects',
  /** the centre of the seal */
  sealTitle: 'Open to',
  sealBody: 'Collaborate',
} as const

/**
 * Navigation targets the SECTIONS of the landing page, not separate routes, so
 * clicking a link scrolls the poster instead of throwing the reader into a new
 * document. `id` must match a `section id` in `HomePage`; the header scrolls to
 * it (and routes home first when the reader is on another page).
 */
export const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'Work', id: 'work' },
  { label: 'About', id: 'about' },
  { label: 'Direction', id: 'direction' },
  { label: 'Contact', id: 'contact' },
] as const

/** Sections in document order — drives the scroll-spy underline in the header. */
export const sectionOrder = navLinks.map((link) => link.id) as unknown as readonly string[]

export const socialLinks = [
  { label: 'Portfolio', href: site.portfolio, handle: 'gdeveash.vercel.app' },
  { label: 'GitHub', href: site.github, handle: 'github.com/deveash123' },
  { label: 'LinkedIn', href: site.linkedin, handle: 'linkedin.com/in/deveashg' },
  { label: 'Email', href: `mailto:${site.email}`, handle: site.email, copyable: true },
] as const

export const education = {
  degree: 'B.E. Computer Science and Engineering',
  school: 'Dhaanish Chennai College of Engineering',
  status: 'Undergraduate student',
  graduation: 'Expected graduation: 2029',
  period: '2025 — 2029',
  location: 'Chennai, Tamil Nadu, India',
} as const

export const headline = 'I build games, apps, and AI-powered digital products.' as const

export const intro =
  "I'm Deveash, a Computer Science and Engineering student and product developer based in Chennai, India. I enjoy building games, web applications, mobile apps, and AI-powered tools that turn ideas into practical digital experiences." as const

export const bio =
  'Product developer focused on game development, application development, and intelligent digital products. Currently strengthening my programming fundamentals and development skills while building practical projects that combine code, AI, and design.' as const

export const taglines = [
  'Turning ideas into real digital products.',
  'Building at the intersection of code, AI, and design.',
  'From concepts to interactive experiences.',
] as const

export const about = {
  lead: "I'm Deveash G., an aspiring product developer currently pursuing a B.E. in Computer Science and Engineering.",
  body: [
    "I'm interested in creating games, web applications, mobile apps, and AI-powered products. I enjoy exploring new technologies, experimenting with ideas, and turning concepts into working projects.",
    'My current focus is strengthening my programming fundamentals, improving my software development skills, and learning how to build reliable, useful digital products.',
  ],
  goal: 'My goal is to grow into a capable developer who can take an idea from concept to a working product.',
} as const
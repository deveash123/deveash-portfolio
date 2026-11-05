/**
 * Projects, skills and direction — everything below is supplied by the owner.
 *
 * TWO HONESTY RULES ARE ENFORCED HERE:
 *
 *  1. No invented screenshots. Every `screenshot` is `null` until the owner
 *     provides a real capture; cards render a generated cover instead. The
 *     reference's project imagery was explicitly described as inspiration, not
 *     verified product shots, so it is not copied.
 *  2. No invented skill percentages. The reference showed "95% / 90%"; those
 *     are fabricated precision. Levels below are an explicit four-step ordinal
 *     scale the owner signed off on, with the word shown next to the track.
 */

export type CoverMotif = 'detective' | 'chat' | 'contour'

export type ProjectLink = {
  label: string
  href: string
}

export type Project = {
  slug: string
  title: string
  /** short stack line shown on the card, e.g. JAVA · SQLITE */
  kicker: string
  category: string
  year: string
  summary: string
  /** the problem it exists to solve */
  problem: string
  /** what he personally built */
  contribution: string
  status: string
  tags: string[]
  features: string[]
  cover: CoverMotif
  links: ProjectLink[]
  /** real capture of the running product — null until supplied */
  screenshot: string | null
  demoVideo: string | null
}

export const projects: Project[] = [
  {
    slug: 'crime-detective',
    title: 'CrimeDetective',
    kicker: 'JAVA · SQLITE',
    category: 'Game development',
    year: '2025',
    summary:
      'A murder-mystery investigation game: explore rooms, examine evidence and narrow down the suspect.',
    problem:
      'Most mystery stories hand you the answer. The interesting part of a whodunnit is the reasoning, so the game needed a structure that makes players gather evidence and reach their own conclusion instead of reading a verdict.',
    contribution:
      'I designed the investigation loop and the game logic around it — room progression, evidence examination and suspect elimination — and stored the world data in SQLite so rooms, items and dialogue stay editable outside the code.',
    status: 'Documented and developed',
    tags: ['Java', 'SQLite', 'Game logic', 'Mystery game'],
    features: ['9 explorable rooms', '4 suspects to eliminate', '15 evidence items to examine'],
    cover: 'detective',
    links: [],
    screenshot: null,
    demoVideo: null,
  },
  {
    slug: 'chatflow',
    title: 'ChatFlow',
    kicker: 'NODE.JS · SOCKET.IO · JWT',
    category: 'Backend',
    year: '2025',
    summary: 'A real-time chat backend focused on messaging infrastructure and authentication.',
    problem:
      'Polling makes a chat feel laggy and wastes requests. A conversation product needs messages pushed the moment they are sent, and it needs to know who is allowed to send them.',
    contribution:
      'I worked through the server architecture — Node.js and Express for the HTTP layer, Socket.IO for persistent connections, and JWT for authenticating a session before a socket is allowed to join a room.',
    status: 'Architecture worked through',
    tags: ['Node.js', 'Express', 'Socket.IO', 'JWT'],
    features: [
      'Persistent real-time connections',
      'JWT authentication on session',
      'Room-scoped message delivery',
    ],
    cover: 'chat',
    links: [],
    screenshot: null,
    demoVideo: null,
  },
  {
    slug: 'contour-studio',
    title: 'Contour Studio',
    kicker: 'DIGITAL PRODUCT · STUDIO PROJECT',
    category: 'Digital product',
    year: '2025',
    summary: 'A studio project built around identity, interaction and how a product feels to use.',
    problem:
      'A product can be technically correct and still feel flat. This project was about finding out how far visual identity and interaction design can carry a product on their own.',
    contribution:
      'I drove the concept and the creative development direction, iterating on the interface until the product had a point of view rather than just a feature list.',
    status: 'Confirmed project',
    tags: ['Creative development', 'Digital product', 'Product thinking'],
    features: ['Product identity and art direction', 'Interface and interaction design'],
    cover: 'contour',
    links: [],
    screenshot: null,
    demoVideo: null,
  },
]

/** He asked for the two confirmed projects to lead, so they do. */
export const featuredProjects = projects

export const findProject = (slug: string | undefined) =>
  projects.find((project) => project.slug === slug)

/* ---------------------------------------------------------------------------
   SKILLS

   `level` is a four-step ordinal, not a percentage:
     1 learning · 2 building · 3 working · 4 focus
   The reference's "95% / 90% / 85%" bars were invented numbers. These are the
   owner's own words: C++ is at fundamentals, backend development is in progress.
--------------------------------------------------------------------------- */

export type SkillLevel = 1 | 2 | 3 | 4

export type Skill = {
  name: string
  level: SkillLevel
  /** the honest word shown beside the track */
  label: string
}

export type SkillGroup = {
  title: string
  note: string
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Programming',
    note: 'Foundations',
    skills: [
      { name: 'C++ fundamentals', level: 1, label: 'Learning' },
      { name: 'Programming logic', level: 2, label: 'Building' },
      { name: 'Problem-solving practice', level: 2, label: 'Building' },
    ],
  },
  {
    title: 'Development interests',
    note: 'Where I build',
    skills: [
      { name: 'Game development', level: 3, label: 'Working with' },
      { name: 'Web development', level: 3, label: 'Working with' },
      { name: 'Mobile apps', level: 2, label: 'Building' },
      { name: 'Backend development', level: 1, label: 'In progress' },
    ],
  },
  {
    title: 'AI & technology',
    note: 'Applied, hands-on',
    skills: [
      { name: 'AI tool usage', level: 3, label: 'Working with' },
      { name: 'AI integrations', level: 2, label: 'Building' },
      { name: 'AI-powered products', level: 2, label: 'Building' },
    ],
  },
]

/**
 * Replaces the reference's four "what makes me different" rows. These are real
 * statements about how he works, not invented differentiators.
 */
export const workingPrinciples = [
  {
    title: 'Learning in public',
    body: 'Building through hands-on projects rather than collecting certificates.',
  },
  {
    title: 'Practical over theoretical',
    body: 'Understanding a language by shipping something with it.',
  },
  {
    title: 'Idea to working product',
    body: 'Taking a rough concept all the way to something that actually runs.',
  },
  {
    title: 'Design aware',
    body: 'Interested in how software, design and AI come together in one product.',
  },
] as const

/**
 * Stands in for the reference's "What Clients Say" testimonial band.
 * Invented client quotes are fabricated claims, so this band carries his own
 * stated interests and career direction instead — same structural slot, real content.
 */
export const enjoysBuilding = [
  {
    title: 'Interactive games',
    body: 'Games and gameplay experiences, where the interface is the mechanic rather than a wrapper around one.',
  },
  {
    title: 'Web & mobile apps',
    body: 'Modern websites and applications that do a real job for the person using them.',
  },
  {
    title: 'AI-powered tools',
    body: 'AI tools and intelligent workflows that help someone actually get something done.',
  },
] as const

export const direction = {
  heading: 'My direction',
  lead: "I'm working toward becoming a skilled software and game developer with the ability to build complete digital products.",
  priorities: [
    'Improving my C++ programming fundamentals.',
    'Developing stronger software engineering skills.',
    'Building practical websites and applications.',
    'Exploring game development and AI integration.',
    'Creating portfolio projects that demonstrate real implementation skills.',
    'Finding opportunities to learn through internships and collaborative projects.',
  ],
} as const

/** Replaces the reference's client quote in the Skills band. */
export const statement =
  'I like taking an idea from a rough concept to something that actually runs — and learning properly on the way there.' as const
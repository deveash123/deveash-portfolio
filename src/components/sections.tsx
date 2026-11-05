import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Copy, Send } from 'lucide-react'
import { ContactList } from './ContactList'
import { DrawRule, ScrollFade, Stagger, StaggerItem } from './interactive'
import { PosterHeading } from './PosterBits'
import { Reveal } from './Reveal'
import { SkillTable } from './Meter'
import { direction, enjoysBuilding, skillGroups } from '../data/portfolio'
import { about, availability, education, site, taglines } from '../data/site'

/**
 * The About / Direction / Contact bodies, as SECTIONS rather than pages.
 *
 * They used to live inside `AboutPage`, `DirectionPage` and `ContactPage` and
 * were only reachable by changing route. The owner wants the landing page to
 * scroll through everything, so the content was lifted here and is now rendered
 * in two places from ONE definition: inline in `HomePage`, and standalone on the
 * original routes (which stay live for direct links and sharing). Nothing is
 * duplicated — only the mount points are.
 *
 * Each section carries its own heading, so it reads correctly in both contexts
 * without needing a `variant` prop.
 */

/** Shared frame. `id` is the scroll anchor the header targets. */
function Section({
  id,
  one,
  two,
  lede,
  children,
}: {
  id: string
  one: string
  two: string
  lede: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="poster-sec" aria-labelledby={`${id}-heading`}>
      {/* the hairline prints itself in as the section arrives */}
      <DrawRule className="mb-7" />

      <div className="poster-head">
        <PosterHeading one={one} two={two} />
        <p className="poster-lede">{lede}</p>
      </div>
      <h3 id={`${id}-heading`} className="sr-only">
        {`${one} ${two}`}
      </h3>
      {/* one wrapper gives every section body the same fade in / fade out */}
      <ScrollFade>{children}</ScrollFade>
    </section>
  )
}

export function AboutSection() {
  return (
    <Section id="about" one="About" two="Me" lede={taglines[1]}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="font-serif text-[1.4rem] leading-[1.3] text-pretty">{about.lead}</p>
          </Reveal>
          <Reveal delay={5}>
            <div className="mt-7 space-y-5">
              {about.body.map((paragraph) => (
                <p key={paragraph} className="max-w-[58ch] text-[15px] leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={8}>
            <p className="mt-8 border-l-2 border-clay pl-5 text-[15.5px] leading-relaxed text-ink">
              {about.goal}
            </p>
          </Reveal>
        </div>

        <aside className="lg:col-span-5">
          <Reveal delay={4}>
            <div className="border border-rule-strong p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">Education</p>
              <p className="mt-3 text-[16.5px] font-extrabold leading-snug">{education.degree}</p>
              <p className="mt-1.5 text-[14.5px] text-ink-soft">{education.school}</p>
              <p className="mt-4 text-[13.5px] text-ink-faint">
                {education.status} · {education.graduation}
              </p>
              <p className="text-[13.5px] text-ink-faint">{education.location}</p>
            </div>
          </Reveal>

          <Reveal delay={8}>
            <div className="mt-6 border border-rule-strong p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">Based in</p>
              <p className="mt-3 text-[16.5px] font-extrabold">{site.location}</p>
              <p className="mt-1.5 text-[14px] text-ink-soft">{site.role}</p>
            </div>
          </Reveal>
        </aside>
      </div>

      <div className="mt-14 border-t border-rule pt-10">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
          What I enjoy building
        </h4>
        <ul className="mt-7 grid gap-x-10 gap-y-4 md:grid-cols-2">
          {enjoysBuilding.map((item) => (
            <Reveal as="li" key={item.title} className="border-b border-rule pb-4">
              <p className="text-[15px] font-extrabold uppercase tracking-[0.1em]">{item.title}</p>
              <p className="mt-1.5 max-w-[46ch] text-[14px] leading-relaxed text-ink-soft">{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>

      <div className="mt-14 border-t border-rule pt-10">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
          Skills, honestly
        </h4>
        <div className="mt-7">
          <SkillTable groups={skillGroups} />
        </div>
      </div>
    </Section>
  )
}

export function DirectionSection() {
  return (
    <Section id="direction" one="My" two="Direction" lede={direction.lead}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
            Current priorities
          </h4>
<Stagger as="ul" className="mt-6 border-t border-rule" gap={0.07} amount={0.12}>
            {direction.priorities.map((priority, index) => (
              <StaggerItem as="li" key={priority}>
                <div className="group relative flex items-baseline gap-5 border-b border-rule py-5">
                  <span className="font-serif text-[1.5rem] leading-none text-clay tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[14px] leading-relaxed text-ink">{priority}</p>
                  {/* a clay hairline wipes across the row on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-clay transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                  />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <aside className="lg:col-span-5">
          <Reveal delay={4}>
            <div className="border border-rule-strong p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">Right now</p>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-clay">Studying</dt>
                  <dd className="mt-1 text-[15px] font-semibold">
                    {education.degree}
                    <span className="mt-0.5 block text-[13.5px] font-normal text-ink-soft">
                      {education.school} · {education.graduation}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-clay">Building</dt>
                  <dd className="mt-1 text-[14.5px] text-ink-soft">
                    Games, web applications and AI-powered products.
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-clay">Looking for</dt>
                  <dd className="mt-1 text-[14.5px] text-ink-soft">
                    Internships and collaborative projects where I can learn from people who ship.
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-clay">Based in</dt>
                  <dd className="mt-1 text-[14.5px] text-ink-soft">{site.location}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </aside>
      </div>
    </Section>
  )
}

export function ContactSection() {
  return (
    <Section
      id="contact"
      one="Get in"
      two="Touch"
      lede="The fastest route is email — I read everything."
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Reveal>
            <ContactList />
          </Reveal>

          <Reveal delay={5}>
            <p className="mt-8 max-w-[54ch] text-[15px] leading-relaxed text-ink-soft">
              If you&rsquo;re working on an interesting idea, looking for a developer to collaborate with, or
              offering a relevant internship opportunity, feel free to reach out.
            </p>
          </Reveal>
        </div>

        <aside className="lg:col-span-5">
          <Reveal delay={4}>
            <div className="border border-rule-strong p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                Availability
              </p>
              <p className="mt-3 font-serif text-[1.5rem] leading-tight">{availability.barLabel}</p>
              <ul className="mt-5 space-y-2.5">
                {['Internships', 'Collaborative projects', 'Learning through real work'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[14.5px] text-ink-soft">
                    <span className="h-1.5 w-1.5 bg-clay" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={8}>
            <div className="mt-6 border border-rule-strong p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">Based in</p>
              <p className="mt-3 text-[16.5px] font-extrabold">{site.location}</p>
              <p className="mt-1.5 text-[14px] text-ink-soft">{site.role}</p>
              <a
                href={`mailto:${site.email}`}
                data-cursor
                className="mt-5 inline-flex items-center gap-3 border border-ink px-4 py-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-paper"
              >
                Email me directly
              </a>
            </div>
          </Reveal>
        </aside>
      </div>
    </Section>
  )
}
/* ---------------------------------------------------------------------------
 * Freelance enquiry
 * ------------------------------------------------------------------------- */

const PROJECT_KINDS = [
  'Website',
  'Mobile app',
  'Web app / dashboard',
  'Game',
  'AI or automation',
  'Something else',
] as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const DETAILS_MIN = 20

/**
 * "Hire freelancer" — the brief behind the header button.
 *
 * There is no backend in this project (no API route, no form service), so this
 * does NOT pretend to submit anything. It validates, then does the two things
 * that actually work with zero infrastructure: copies a fully written brief to
 * the clipboard, and opens the visitor's mail client pre-filled with the same
 * text. Copy is offered FIRST because a mailto silently fails whenever no mail
 * handler is installed — which is most browsers.
 */
export function HireSection() {
  const reduceMotion = useReducedMotion()
  const reduce = reduceMotion === true
  const [kind, setKind] = useState('')
  const [details, setDetails] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'copied' | 'mailed'>('idle')
  const focusFirstError = useRef(false)

  /**
   * Move focus to the first invalid field after a failed submit.
   *
   * This MUST run from an effect rather than straight after `setErrors()`:
   * React has not committed the error attributes yet at that point, so querying
   * `[data-hire-error="true"]` inline finds nothing and focus silently stays on
   * the submit button.
   */
  useEffect(() => {
    if (!focusFirstError.current) return
    focusFirstError.current = false
    document.querySelector<HTMLElement>('[data-hire-error="true"]')?.focus()
  }, [errors])

  const brief =
    `Freelance enquiry from ${site.name}\n\n` +
    `Project type: ${kind}\n` +
    `Name: ${name}\n` +
    `Reply to: ${email}\n\n` +
    `What I need:\n${details}\n`

  const validate = () => {
    const next: Record<string, string> = {}
    if (!kind) next.kind = 'Pick the closest match.'
    if (details.trim().length < DETAILS_MIN)
      next.details = `Please be specific — at least ${DETAILS_MIN} characters.`
    if (!name.trim()) next.name = 'Tell me who you are.'
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter an email I can reply to.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
if (!validate()) {
      // `validate` has already committed the new error object; set the flag so
      // the effect below moves focus once those attributes exist in the DOM.
      focusFirstError.current = true
      return
    }

    let copied = false
    try {
      await navigator.clipboard.writeText(brief)
      copied = true
      setStatus('copied')
    } catch {
      copied = false
    }

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `Freelance enquiry — ${kind}`,
    )}&body=${encodeURIComponent(brief)}`

    if (!copied) setStatus('mailed')
    window.setTimeout(() => setStatus('idle'), 6000)
  }

  const field =
    'w-full border bg-paper px-3.5 py-2.5 text-[15px] leading-relaxed outline-none transition-colors placeholder:text-ink-faint focus:border-clay'
  const label = 'block text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint'

  return (
    <Section
      id="hire"
      one="Hire"
      two="Me"
      lede="Tell me what you need built. The more specific you are, the more useful my reply will be — scope, platform and timeline all help."
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
<div className="lg:col-span-7">
          <form onSubmit={submit} noValidate className="mt-10 space-y-7">
            {/* what kind of thing */}
            <fieldset>
              <legend className={label}>What do you need built?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {PROJECT_KINDS.map((option) => {
                  const on = kind === option
                  return (
<motion.label
                      key={option}
                      data-cursor
                      data-cursor-label={on ? 'Selected' : 'Pick'}
                      whileTap={reduce ? undefined : { scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 30 }}
                      className={`cursor-pointer border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-clay ${
                        on
                          ? 'border-clay bg-clay text-paper'
                          : 'border-rule-strong text-ink-soft hover:border-clay hover:text-clay'
                      }`}
                    >
                      <input
                        type="radio"
                        name="project-kind"
                        value={option}
                        checked={on}
                        onChange={() => {
                          setKind(option)
                          setErrors((e) => ({ ...e, kind: '' }))
                        }}
                        className="sr-only"
                      />
{option}
                    </motion.label>
                  )
                })}
              </div>
              {errors.kind ? (
                <p className="mt-2 text-[13px] font-semibold text-clay">{errors.kind}</p>
              ) : null}
            </fieldset>

            {/* the specifics */}
            <div>
              <label htmlFor="hire-details" className={label}>
                Be specific — what exactly?
              </label>
              <textarea
                id="hire-details"
                rows={6}
                maxLength={1200}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                onBlur={() => {
                  if (details.trim().length && details.trim().length < DETAILS_MIN)
                    setErrors((e) => ({ ...e, details: 'Add a little more detail.' }))
                }}
                aria-invalid={Boolean(errors.details)}
                aria-describedby={errors.details ? 'hire-details-error' : undefined}
                data-hire-error={errors.details ? 'true' : undefined}
                placeholder="e.g. A booking site for a single salon — 4 pages, customers pick a slot and get a confirmation email. Mobile-first, to launch in about a month."
                className={`${field} mt-3 resize-y ${errors.details ? 'border-clay' : 'border-rule-strong'}`}
              />
              {errors.details ? (
                <p id="hire-details-error" className="mt-2 text-[13px] font-semibold text-clay">
                  {errors.details}
                </p>
              ) : (
                <p className="mt-2 text-[13px] text-ink-faint">
                  {details.length}/1200 — pages, features, platform, deadline, anything you already know.
                </p>
              )}
            </div>

            {/* who */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="hire-name" className={label}>
                  Your name
                </label>
                <input
                  id="hire-name"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'hire-name-error' : undefined}
                  data-hire-error={errors.name ? 'true' : undefined}
                  className={`${field} mt-3 ${errors.name ? 'border-clay' : 'border-rule-strong'}`}
                />
                {errors.name ? (
                  <p id="hire-name-error" className="mt-2 text-[13px] font-semibold text-clay">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="hire-email" className={label}>
                  Your email
                </label>
                <input
                  id="hire-email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'hire-email-error' : undefined}
                  data-hire-error={errors.email ? 'true' : undefined}
                  className={`${field} mt-3 ${errors.email ? 'border-clay' : 'border-rule-strong'}`}
                />
                {errors.email ? (
                  <p id="hire-email-error" className="mt-2 text-[13px] font-semibold text-clay">
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
<motion.button
                type="submit"
                data-cursor
                data-cursor-label="Send"
                whileTap={reduce ? undefined : { scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 520, damping: 30 }}
                className="group inline-flex items-center gap-2.5 border border-ink px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] transition-colors duration-200 hover:bg-ink hover:text-paper"
              >
                <motion.span
                  aria-hidden
                  className="inline-block"
                  whileHover={reduce === true ? undefined : { rotate: -45 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  <Send size={13} strokeWidth={2.4} />
                </motion.span>
                Prepare my enquiry
              </motion.button>

              <p role="status" aria-live="polite" className="text-[13px] font-semibold text-ink-soft">
                {status === 'copied' ? (
                  <span className="inline-flex items-center gap-1.5 text-clay">
                    <Check size={12} strokeWidth={2.6} aria-hidden /> Copied — paste it into email or chat.
                  </span>
                ) : status === 'mailed' ? (
                  <span className="inline-flex items-center gap-1.5 text-clay">
                    <Copy size={12} strokeWidth={2.4} aria-hidden /> Your mail app should have opened.
                  </span>
                ) : (
                  <>Copies the brief, then opens your mail app.</>
                )}
              </p>
            </div>

            <p className="text-[13px] leading-relaxed text-ink-faint">
              Nothing is sent from this page. It writes your brief to your clipboard and hands it to your
              own mail app — if neither is available, email{' '}
              <a href={`mailto:${site.email}`} className="link-underline">
                {site.email}
              </a>{' '}
              directly.
            </p>
          </form>
        </div>

        <aside className="lg:col-span-5">
          <Reveal delay={4}>
            <div className="border border-rule-strong p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                Current availability
              </p>
              <p className="mt-3 font-serif text-[1.5rem] leading-tight">{availability.barLabel}</p>
              <ul className="mt-5 space-y-2.5">
                {['Freelance projects', 'Internships', 'Collaborative builds'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-[14.5px] text-ink-soft">
                    <span className="h-1.5 w-1.5 bg-clay" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-rule pt-4 text-[13.5px] leading-relaxed text-ink-faint">
                Small, well-specified jobs are the best fit — a site, an app, or a game prototype taken from
                blank file to something you can actually open.
              </p>
            </div>
          </Reveal>
        </aside>
      </div>
    </Section>
  )
}

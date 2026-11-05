import { Link } from 'react-router-dom'
import { BookOpen, Hammer, Palette, Rocket } from 'lucide-react'
import { Hero } from '../components/Hero'
import { ProjectThumb } from '../components/ProjectThumb'
import { PosterHeading, ArrowLabel } from '../components/PosterBits'
import { Reveal } from '../components/Reveal'
import { Stagger, StaggerItem, ScrollFade } from '../components/interactive'
import { AboutSection, ContactSection, DirectionSection, HireSection } from '../components/sections'
import {
  featuredProjects,
  skillGroups,
  statement,
  workingPrinciples,
} from '../data/portfolio'
import { site } from '../data/site'

/** six rows, picked across the three groups, to match the reference's six bars */
const homeSkills = skillGroups
  .flatMap((group) => group.skills)
  .filter((skill) =>
    ['Game development', 'Web development', 'AI-powered products', 'Mobile apps', 'Backend development', 'C++ fundamentals'].includes(
      skill.name,
    ),
  )

const principleIcons = [BookOpen, Hammer, Rocket, Palette]

/**
 * The landing page, in the reference's single-poster order:
 *   hero -> selected projects -> skills / quote / principles
 *   -> "what clients say" band -> closing call to action (the site footer).
 *
 * The testimonial band and the 95%/90% bars are the only places the reference
 * is NOT copied literally: both were invented claims. They keep their exact
 * layout but carry the owner's own words and an honest four-step scale.
 */
export function HomePage() {
  return (
    <>
      <Hero />

      {/* ---- selected projects ---- */}
      <section id="work" className="poster-sec" aria-labelledby="work-heading">
        <div className="poster-head">
          <PosterHeading one="Selected" two="Projects" />
          <p className="poster-lede">
            A curated selection of what I have actually built — a mystery game, a real-time backend and a studio
            project.
          </p>
          <Link to="/work" data-cursor data-cursor-label="All" className="poster-link">
            <ArrowLabel>View all projects</ArrowLabel>
          </Link>
        </div>
        <h3 id="work-heading" className="sr-only">
          Selected projects
        </h3>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-5">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} delay={(index % 4) * 4}>
              <Link to={`/work/${project.slug}`} data-cursor data-cursor-label="View" className="group block">
                <div className="overflow-hidden">
                  <div className="transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                    <ProjectThumb motif={project.cover} title={project.title} />
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2.5">
                  <span className="font-serif text-[1.45rem] leading-none text-clay tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-bold leading-tight">{project.title}</p>
                    <p className="mt-0.5 truncate text-[13.5px] text-ink-faint">{project.category}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}

          {/* the reference has four tiles; the fourth points at the real GitHub rather than inventing a project */}
          <Reveal delay={12}>
            <a href={site.github} target="_blank" rel="noreferrer" data-cursor data-cursor-label="GitHub" className="group block">
              <div className="overflow-hidden">
                <div className="transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                  <ProjectThumb motif="github" title="More projects on GitHub" />
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2.5">
                <span className="font-serif text-[1.45rem] leading-none text-clay tabular-nums">04</span>
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] font-bold leading-tight">More on GitHub</p>
                  <p className="mt-0.5 truncate text-[13.5px] text-ink-faint">github.com/deveash123</p>
                </div>
              </div>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---- skills / quote / principles ---- */}
      <section className="poster-sec" aria-labelledby="skills-heading">
        <h3 id="skills-heading" className="sr-only">
          Skills and expertise
        </h3>
        <ScrollFade>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr_1.05fr] lg:gap-0">
          <div className="lg:pr-9">
            <PosterHeading one="Skills &" two="Expertise" />
            <ul className="mt-7 space-y-3.5">
              {homeSkills.map((skill) => (
                <li key={skill.name} className="grid grid-cols-[minmax(0,1fr)_5.2rem_5.6rem] items-center gap-3">
                  <span className="text-[11.5px] font-semibold uppercase tracking-[0.1em]">{skill.name}</span>
                  <span className="flex gap-[3px]" role="img" aria-label={`${skill.label}, step ${skill.level} of 4`}>
                    {[1, 2, 3, 4].map((step) => (
                      <i
                        key={step}
                        className={`block h-[2px] flex-1 ${step <= skill.level ? 'bg-clay' : 'bg-rule-strong'}`}
                      />
                    ))}
                  </span>
                  <span className="text-right text-[11.5px] text-ink-soft">{skill.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <figure className="flex flex-col justify-center border-rule lg:border-x lg:px-9">
            <span aria-hidden className="block font-serif text-[3.6rem] leading-[0.6] text-clay">
              &ldquo;
            </span>
            <blockquote className="mt-3 font-serif text-[clamp(1.2rem,1.9vw,1.55rem)] leading-[1.32] text-pretty">
              {statement}
            </blockquote>
          </figure>

<Stagger as="ul" className="space-y-6 lg:pl-9" gap={0.09} amount={0.2}>
            {workingPrinciples.map((principle, index) => {
              const Icon = principleIcons[index] ?? Rocket
              return (
                <StaggerItem as="li" key={principle.title}>
                  <div className="group flex gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-clay text-paper transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-6">
                      <Icon size={15} strokeWidth={1.8} aria-hidden />
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.1em]">{principle.title}</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{principle.body}</p>
                    </div>
                  </div>
                </StaggerItem>
              )
})}
          </Stagger>
        </div>
        </ScrollFade>
      </section>

      {/* ---- About / Direction / Contact ---------------------------------
          These used to be separate pages reachable only by changing route. The
          owner wants the landing page to scroll through everything, so the
          bodies live in `sections.tsx` and are mounted here AND on their
          original routes — one definition, two mount points.

          The old standalone "What I enjoy building" band was removed from this
          page: `AboutSection` already carries that content, and leaving both
          would print the same three cards twice in one scroll. */}
      <AboutSection />
      <DirectionSection />
      <HireSection />
      <ContactSection />
    </>
  )
}

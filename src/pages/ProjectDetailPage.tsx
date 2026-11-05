import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { ProjectCover } from '../components/ProjectCover'
import { Reveal } from '../components/Reveal'
import { ProjectRow } from '../components/ProjectCard'
import { findProject, projects } from '../data/portfolio'
import { site } from '../data/site'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = findProject(slug)
  if (!project) return <Navigate to="/work" replace />

  const others = projects.filter((item) => item.slug !== project.slug)
  const index = projects.findIndex((item) => item.slug === project.slug)

  return (
    <>
      <PageHero eyebrow={`${String(index + 1).padStart(2, '0')} · ${project.category}`} title={project.title} />

      <article className="mx-auto max-w-[1180px] px-[var(--gutter)] py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* cover */}
          <Reveal className="lg:col-span-5">
            <ProjectCover motif={project.cover} title={project.title} />
            {project.screenshot ? (
              <img
                src={project.screenshot}
                alt={`${project.title} screenshot`}
                className="mt-4 w-full border border-rule"
                loading="lazy"
              />
            ) : (
              <p className="mt-4 border border-dashed border-rule-strong p-4 text-[13px] leading-relaxed text-ink-faint">
                No screenshot yet — this cover is a generated diagram of the project, not a capture of it.
                A real screenshot will be added when one is available.
              </p>
            )}
          </Reveal>

          {/* body */}
          <div className="lg:col-span-7">
            <Reveal delay={4}>
              <p className="text-[11.5px] font-extrabold uppercase tracking-[0.2em] text-clay">{project.kicker}</p>
              <p className="mt-4 font-serif text-[1.45rem] leading-[1.28] text-pretty">{project.summary}</p>
            </Reveal>

            <Reveal delay={8}>
              <dl className="mt-10 space-y-8">
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                    The problem
                  </dt>
                  <dd className="mt-2.5 max-w-[58ch] text-[15px] leading-relaxed text-ink-soft">
                    {project.problem}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                    What I built
                  </dt>
                  <dd className="mt-2.5 max-w-[58ch] text-[15px] leading-relaxed text-ink-soft">
                    {project.contribution}
                  </dd>
                </div>

                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                    Recorded features
                  </dt>
                  <dd>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-[14.5px] text-ink-soft">
                          <Check size={14} strokeWidth={2.4} className="mt-0.5 shrink-0 text-clay" aria-hidden />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>

                <div className="grid gap-6 border-t border-rule pt-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">Status</dt>
                    <dd className="mt-2 text-[14.5px] font-semibold">{project.status}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">Year</dt>
                    <dd className="mt-2 text-[14.5px] font-semibold">{project.year}</dd>
                  </div>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={10}>
              <ul className="mt-9 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="border border-rule-strong px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-soft"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>

            {project.links.length > 0 ? (
              <Reveal delay={12}>
                <ul className="mt-9 flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor
                        data-cursor-label="Open"
                        className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-paper"
                      >
                        {link.label}
                        <ArrowUpRight size={13} strokeWidth={2.4} aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : (
              <Reveal delay={12}>
                <p className="mt-9 border-l-2 border-clay pl-4 text-[14px] leading-relaxed text-ink-soft">
                  No public demo or repository link for this one yet.{' '}
                  <Link to="/contact" className="font-semibold text-clay link-underline">
                    Ask me for a walkthrough
                  </Link>{' '}
                  — happy to share the code and explain the implementation.
                </p>
              </Reveal>
            )}
          </div>
        </div>
      </article>

      {/* other projects */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-[1180px] px-[var(--gutter)] py-14 md:py-20">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">More projects</h2>
          <ul className="mt-6 border-t border-rule">
            {others.map((item, i) => (
              <ProjectRow key={item.slug} project={item} index={i} />
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-rule bg-paper-dim">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6 px-[var(--gutter)] py-10">
          <p className="text-[14px] text-ink-soft">
            Want the code, or want something like this built?{' '}
            {/* `clay-deep`, not `clay`: on the paper-dim ground plain clay only reaches
                4.20:1, which fails AA at this size. */}
            <a href={`mailto:${site.email}`} className="font-semibold text-clay-deep link-underline">
              {site.email}
            </a>
          </p>
          <Link
            to="/work"
            data-cursor
            className="flex items-center gap-3 text-[11.5px] font-extrabold uppercase tracking-[0.2em] text-ink-soft transition-colors hover:text-clay"
          >
            Back to all work <span className="arrow-rule" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  )
}
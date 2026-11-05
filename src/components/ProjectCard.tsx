import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ProjectCover } from './ProjectCover'
import { Reveal } from './Reveal'
import type { Project } from '../data/portfolio'

/**
 * Project card in the reference's form: cover art, then a serif number, a bold
 * title and a muted subtitle below it.
 *
 * The whole card is one link so the click target matches what people aim at,
 * but only the title carries an accessible name — the cover is decorative.
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal as="article" delay={(index % 4) * 5} className="h-full">
      <Link
        to={`/work/${project.slug}`}
        data-cursor
        data-cursor-label="View"
        className="group flex h-full flex-col focus-visible:outline-offset-8"
      >
        <div className="overflow-hidden">
          <div className="transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]">
            <ProjectCover motif={project.cover} title={project.title} />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-serif text-[1.35rem] leading-none text-clay tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-[16.5px] font-extrabold uppercase tracking-[0.06em]">{project.title}</h3>
            <p className="mt-1 truncate text-[13px] font-semibold uppercase tracking-[0.13em] text-ink-faint">
              {project.category}
            </p>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

/**
 * Compact variant for inner pages, where the reference's poster rhythm is not
 * needed and a denser list reads better.
 */
export function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal as="li" delay={(index % 5) * 4}>
      <Link
        to={`/work/${project.slug}`}
        data-cursor
        data-cursor-label="Open"
        className="group grid items-center gap-4 border-b border-rule py-6 sm:grid-cols-12 sm:gap-6"
      >
        <span className="font-serif text-[1.6rem] leading-none text-clay tabular-nums sm:col-span-1">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-[1.05rem] font-extrabold uppercase tracking-[0.05em] sm:col-span-4">
          {project.title}
        </h3>
        <p className="text-[14.5px] leading-relaxed text-ink-soft sm:col-span-5">{project.summary}</p>
        <span className="justify-self-start text-[11.5px] font-bold uppercase tracking-[0.18em] text-ink-faint sm:col-span-2 sm:justify-self-end">
          {project.kicker}
        </span>
      </Link>
    </Reveal>
  )
}

/** Small magnetic arrow that follows the pointer, used on action links. */
export function MagneticArrow() {
  return (
    <motion.span
      aria-hidden
      className="arrow-rule"
      initial={{ scaleX: 0.7 }}
      whileHover={{ scaleX: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    />
  )
}

import { PageHero } from '../components/PageHero'
import { ProjectRow } from '../components/ProjectCard'
import { Reveal } from '../components/Reveal'
import { projects } from '../data/portfolio'

export function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="Things I have"
        accent="built"
        lede="Each of these is a real project, described by what it solves and what I personally implemented. Where a live demo or screenshot does not exist yet, I say so rather than inventing one."
      />

      <section className="mx-auto max-w-[1180px] px-[var(--gutter)] py-14 md:py-20">
        <ul className="border-t border-rule">
          {projects.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index} />
          ))}
        </ul>

        <Reveal delay={6}>
          <p className="mt-10 max-w-[58ch] text-[14px] leading-relaxed text-ink-faint">
            More projects are in progress. If you want to see work in a particular direction — game
            systems, backend infrastructure, or AI integrations — the fastest way is to get in touch and I
            will send anything I can share.
          </p>
        </Reveal>
      </section>
    </>
  )
}
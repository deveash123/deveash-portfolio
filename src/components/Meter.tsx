import { Reveal } from './Reveal'

/**
 * The skill track.
 *
 * NOT a percentage. The reference showed "95% / 90% / 85%", which is invented
 * precision. This is a four-step ordinal with the owner's own word beside it, so
 * "C++ fundamentals" can honestly read "Learning" instead of claiming 90%.
 */
export function Meter({ level, label }: { level: number; label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-3">
      <span className="meter" aria-hidden>
        {[1, 2, 3, 4].map((step) => (
          <i
            key={step}
            data-on={step <= level ? 'true' : 'false'}
            /* group-hover on the parent row lights the track in sequence, so the
               four-step scale reads as one gesture rather than four states. */
            className="group-hover:origin-left"
            style={{ transitionDelay: `${step * 45}ms` }}
          />
        ))}
      </span>
      <span className="whitespace-nowrap text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink-faint">
        {label}
      </span>
      <span className="sr-only">
        {label} — step {level} of 4
      </span>
    </span>
  )
}

export function SkillTable({ groups }: { groups: typeof import('../data/portfolio').skillGroups }) {
  return (
    <div className="divide-y divide-rule border-y border-rule">
      {groups.map((group, groupIndex) => (
        <Reveal key={group.title} delay={groupIndex * 4} as="div">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 py-7 md:grid-cols-12 md:items-baseline">
            <div className="min-w-0 md:col-span-4">
              <p className="text-[14.5px] font-extrabold uppercase tracking-[0.12em]">{group.title}</p>
              <p className="mt-1.5 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                {group.note}
              </p>
            </div>

            {/* Two columns only from `lg` up. At tablet width the meter track plus
                its label is ~230px of unshrinkable content, which overflowed the
                column, so the skill name has to be the thing that gives way. */}
            {/* `grid-cols-[minmax(0,1fr)]` is load-bearing. A grid item defaults to
                `min-width: auto`, and an IMPLICIT track is sized by max-content —
                so the meter track plus its nowrap label sized the column to 381px
                inside a 350px column at 390px wide, and no amount of `min-w-0`
                on the item would cap it. Only an explicit `minmax(0,1fr)` track
                does. The skill NAME absorbs the difference; it already truncates. */}
            <ul className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-4 md:col-span-8 lg:grid-cols-2">
              {group.skills.map((skill) => (
                <li key={skill.name} className="group flex items-center justify-between gap-4">
                  <span className="min-w-0 truncate text-[14.5px] text-ink-soft">{skill.name}</span>
                  <Meter level={skill.level} label={skill.label} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

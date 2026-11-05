import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

/**
 * Section heading in the reference's two-line form: a neutral first line and a
 * clay second line, with the section number in the margin. The rule beneath is
 * what actually divides the page — there are no section backgrounds.
 */
export function SectionHeading({
  number,
  lineOne,
  lineTwo,
  lede,
  align = 'start',
  className = '',
}: {
  number: string
  lineOne: string
  /** clay-coloured second line */
  lineTwo?: string
  lede?: ReactNode
  align?: 'start' | 'center'
  className?: string
}) {
  return (
    <Reveal className={className}>
      <div
        className={`flex flex-col gap-6 border-b border-rule pb-8 ${
          align === 'center' ? 'items-center text-center' : ''
        }`}
      >
        <div className={align === 'center' ? 'w-full' : 'flex flex-1 flex-wrap items-baseline gap-x-6'}>
          <h2 className="font-serif text-[clamp(2.1rem,5.6vw,4.1rem)] leading-[0.98] tracking-[-0.015em]">
            <span className="block">{lineOne}</span>
            {lineTwo ? <span className="block text-clay">{lineTwo}</span> : null}
          </h2>
          {lede ? (
            <p className="max-w-[42ch] text-[15px] leading-relaxed text-ink-soft">{lede}</p>
          ) : null}
        </div>
        <span className="font-sans text-[12.5px] font-extrabold tracking-[0.2em] text-clay tabular-nums">
          {number}
        </span>
      </div>
    </Reveal>
  )
}

import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

/** Shared masthead so every inner page opens with the same editorial rhythm. */
export function PageHero({
  eyebrow,
  title,
  accent,
  lede,
}: {
  eyebrow: string
  title: string
  accent?: string
  lede?: ReactNode
}) {
  return (
    <section className="border-b border-rule" aria-labelledby="page-title">
      <div className="mx-auto max-w-[1180px] px-[var(--gutter)] py-14 md:py-20">
        <Reveal>
          <p className="eyebrow">
            <span className="h-1.5 w-1.5 bg-clay" aria-hidden />
            {eyebrow}
          </p>
          <h1
            id="page-title"
            className="mt-5 font-serif text-[clamp(2.3rem,7.2vw,4.6rem)] font-medium leading-[0.94] tracking-[-0.02em] text-balance"
          >
            {title}
            {accent ? <span className="text-clay"> {accent}</span> : null}
          </h1>
          {lede ? (
            <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">{lede}</p>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}
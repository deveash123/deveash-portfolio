import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1180px] flex-col justify-center px-[var(--gutter)] py-20">
      <p className="eyebrow">
        <span className="h-1.5 w-1.5 bg-clay" aria-hidden />
        Error 404
      </p>
      {/* Same full-bleed cropped treatment as the landing page's wordmark. */}
      <h1 className="mega-word mt-6">NOT FOUND</h1>
      <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-ink-soft">
        That page doesn&rsquo;t exist. It may have been renamed, or the link may be out of date.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/"
          data-cursor
          className="border border-ink px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-[0.18em] transition-colors hover:bg-ink hover:text-paper"
        >
          Back home
        </Link>
        <Link
          to="/work"
          data-cursor
          className="border border-rule-strong px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-clay hover:text-clay"
        >
          See the work
        </Link>
      </div>
    </section>
  )
}
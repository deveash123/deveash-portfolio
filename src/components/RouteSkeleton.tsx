/**
 * Route loading state.
 *
 * Static and opaque on purpose — an animating placeholder trades a short gap
 * for a layout shift. `role="status"` + `aria-live` so the wait is announced.
 */
export function RouteSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page…</span>

      <section className="border-b border-rule">
        <div className="mx-auto max-w-[1180px] px-[var(--gutter)] py-14 md:py-20">
          <div className="h-2.5 w-28 bg-paper-deep" />
          <div className="mt-6 h-11 w-4/5 bg-paper-deep md:h-14" />
          <div className="mt-5 h-3 w-2/3 bg-paper-dim" />
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[var(--gutter)] py-14 md:py-20">
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index}>
              <div className="aspect-4/5 bg-paper-dim" />
              <div className="mt-4 h-3 w-1/3 bg-paper-deep" />
              <div className="mt-2 h-2.5 w-1/2 bg-paper-dim" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
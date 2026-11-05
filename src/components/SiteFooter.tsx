import { Link } from 'react-router-dom'
import { Globe, Mail, MapPin } from 'lucide-react'
import { site } from '../data/site'
import { ScrollFade } from './interactive'

/**
 * The reference's closing strip: invitation left, QR centre, three contact
 * lines right, separated by vertical hairlines.
 *
 * The QR is a real code generated from `site.portfolio` at build time
 * (scripts/make-assets.mjs) and verified by `npm run verify:qr`.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <ScrollFade className="mx-auto max-w-[1240px] px-[var(--gutter)] py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr_1fr] lg:gap-0">
          <div className="lg:pr-9">
            <h2 className="poster-h2">
              <span className="block">Let&rsquo;s create</span>
              <span className="block text-clay">Something great</span>
            </h2>
            <p className="mt-4 max-w-[30ch] text-[14px] leading-relaxed text-ink-soft">
              Hiring an intern, or got a project that needs another builder? Let&rsquo;s make something that has an
              impact.
            </p>
            <Link
              to="/contact"
              data-cursor
              data-cursor-label="Write"
              className="mt-5 inline-block text-[11.5px] font-semibold uppercase tracking-[0.18em] link-underline"
            >
              Start a conversation
            </Link>
          </div>

          <div className="flex items-center gap-4 border-rule lg:justify-center lg:border-x lg:px-9">
            <img
              src="/qr-portfolio.png"
              alt={`QR code linking to ${site.portfolio}`}
              width={96}
              height={96}
              className="h-24 w-24 mix-blend-multiply"
              loading="lazy"
            />
            <div className="flex items-end gap-2">
              <p className="max-w-[9ch] text-[11px] font-semibold uppercase leading-snug tracking-[0.14em] text-ink-soft">
                Scan to visit my website
              </p>
              <svg width="38" height="26" viewBox="0 0 38 26" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden className="text-ink-soft">
                <path d="M36 3 C 26 2, 12 6, 6 20" />
                <path d="M2 15 L6 21 L12 17" />
              </svg>
            </div>
          </div>

          <ul className="space-y-3.5 lg:pl-9">
            <li className="flex items-center gap-3.5 text-[14px]">
              <Mail size={15} strokeWidth={1.5} className="shrink-0 text-ink-soft" aria-hidden />
              <a href={`mailto:${site.email}`} data-cursor className="link-underline">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3.5 text-[14px]">
              <Globe size={15} strokeWidth={1.5} className="shrink-0 text-ink-soft" aria-hidden />
              <a href={site.portfolio} target="_blank" rel="noreferrer" data-cursor className="link-underline">
                {/* derived, so the printed URL can never drift from the link */}
                {site.portfolio.replace(/^https?:\/\//, '')}
              </a>
            </li>
            <li className="flex items-center gap-3.5 text-[14px]">
              <MapPin size={15} strokeWidth={1.5} className="shrink-0 text-ink-soft" aria-hidden />
              {site.location}
            </li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            &copy; {new Date().getFullYear()} {site.name}
          </p>
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            <a href={site.github} target="_blank" rel="noreferrer" className="link-underline">GitHub</a>
            {' · '}
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="link-underline">LinkedIn</a>
          </p>
        </div>
      </ScrollFade>
      </footer>
    )
  }

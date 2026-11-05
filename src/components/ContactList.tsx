import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Copy } from 'lucide-react'
import { socialLinks } from '../data/site'

/**
 * The reference's contact strip, restructured to the owner's real links.
 * Every row is a real destination except email, which copies as well as links —
 * the reference showed both "Open" and "Copy" affordances for it.
 */
export function ContactList() {
  return (
    <ul className="divide-y divide-rule border-y border-rule">
      {socialLinks.map((link) => (
        <li key={link.label}>
          <ContactRow label={link.label} href={link.href} handle={link.handle} />
        </li>
      ))}
    </ul>
  )
}

function ContactRow({ label, href, handle }: { label: string; href: string; handle: string }) {
  const [copied, setCopied] = useState(false)
  const reduce = useReducedMotion() === true

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(handle)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard access can be denied; the mailto link beside it still works.
      setCopied(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">{label}</p>
        <p className="mt-1 truncate text-[15px] font-semibold text-ink">{handle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
<motion.button
          type="button"
          onClick={copy}
          data-cursor
          data-cursor-label="Copy"
          whileTap={reduce ? undefined : { scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 520, damping: 30 }}
          className="flex items-center gap-1.5 border border-rule-strong px-2.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-clay hover:text-clay"
          aria-label={`Copy ${label} address`}
        >
          {copied ? (
            <>
              <Check size={12} strokeWidth={2.6} className="text-clay" aria-hidden /> Copied
            </>
          ) : (
            <>
              <Copy size={12} strokeWidth={2.4} aria-hidden /> Copy
            </>
          )}
        </motion.button>

        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          data-cursor
          data-cursor-label="Open"
          className="border border-rule-strong px-2.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-clay hover:text-clay"
          aria-label={`Open ${label} in a new tab`}
        >
          Open
        </a>
      </div>
    </div>
  )
}

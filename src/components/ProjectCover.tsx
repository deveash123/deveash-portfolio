import type { CoverMotif } from '../data/portfolio'

/**
 * Generated project cover art.
 *
 * These are DIAGRAMS, not screenshots. The owner has not supplied real captures
 * yet, and inventing a fake product screenshot would be a fabricated claim — so
 * each motif is an honest schematic that shows what the project *is* (rooms and
 * evidence for the game, message flow for the backend, and so on).
 */
export function ProjectCover({ motif, title }: { motif: CoverMotif; title: string }) {
  if (motif === 'detective') return <DetectiveCover title={title} />
  if (motif === 'chat') return <ChatCover title={title} />
  return <ContourCover title={title} />
}

const frame = 'relative aspect-4/5 overflow-hidden'

function DetectiveCover({ title }: { title: string }) {
  return (
    <div className={`${frame} cover-ink`} role="img" aria-label={`${title} — schematic of the investigation map`}>
      <div aria-hidden className="absolute inset-0 p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-paper/50">Investigation map</p>
        <p className="mt-1 font-display text-[clamp(1.5rem,4.4vw,2.4rem)] leading-none tracking-tight text-paper">
          9 ROOMS
        </p>

        {/* 3x3 grid of rooms, one lit as "you are here" */}
        <div className="mt-7 grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className={
                i === 4
                  ? 'aspect-square border border-clay bg-clay/25'
                  : 'aspect-square border border-paper/25'
              }
            >
              <span className="sr-only">Room {i + 1}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-clay" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-paper/70">
            4 suspects · 15 evidence
          </span>
        </div>
      </div>
    </div>
  )
}

function ChatCover({ title }: { title: string }) {
  return (
    <div className={`${frame} cover-paper`} role="img" aria-label={`${title} — schematic of the message flow`}>
      <div aria-hidden className="absolute inset-0 p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink-faint">Message flow</p>
        <p className="mt-1 font-display text-[clamp(1.5rem,4.4vw,2.4rem)] leading-none tracking-tight">
          REALTIME
        </p>

        {/* client -> server -> two peers */}
        <div className="mt-9 space-y-3">
          <Bubble align="left" label="client" />
          <div className="flex items-center gap-2 pl-3 text-[11px] font-bold uppercase tracking-[0.18em] text-clay">
            <span className="h-px flex-1 bg-clay/40" />
            jwt
            <span className="h-px flex-1 bg-clay/40" />
          </div>
          <Bubble align="left" label="server · express" />
          <div className="flex items-center gap-2 pl-3 text-[11px] font-bold uppercase tracking-[0.18em] text-clay">
            <span className="h-px flex-1 bg-clay/40" />
            socket.io
            <span className="h-px flex-1 bg-clay/40" />
          </div>
          <div className="flex gap-2">
            <Bubble align="left" label="room a" tight />
            <Bubble align="left" label="room b" tight />
          </div>
        </div>
      </div>
    </div>
  )
}

function Bubble({
  align,
  label,
  tight,
}: {
  align: 'left' | 'right'
  label: string
  tight?: boolean
}) {
  return (
    <div className={align === 'right' ? 'flex justify-end' : 'flex justify-start'}>
      <span
        className={`inline-block border border-ink/25 px-3 py-1.5 text-[11.5px] font-bold tracking-[0.1em] ${
          tight ? 'text-ink-soft' : 'bg-ink text-paper border-ink'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function ContourCover({ title }: { title: string }) {
  return (
    <div className={`${frame} cover-clay`} role="img" aria-label={`${title} — abstract shapes`}>
      <div aria-hidden className="absolute inset-0">
        {/* overlapping arcs, echoing "contour" */}
        <div className="absolute -right-10 top-10 h-44 w-44 rounded-full border border-paper/40" />
        <div className="absolute -right-2 top-20 h-44 w-44 rounded-full border border-paper/30" />
        <div className="absolute right-6 top-32 h-40 w-40 rounded-full border border-paper/25" />
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-paper/70">Studio project</p>
          <div>
            <p className="font-display text-[clamp(1.4rem,4vw,2.2rem)] leading-[0.9] tracking-tight text-paper">
              IDENTITY
              <br />
              &amp; FEEL
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

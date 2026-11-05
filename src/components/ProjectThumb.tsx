import type { CoverMotif } from '../data/portfolio'

/**
 * Compact project tile in the reference's "mini website" style: a small kicker,
 * a serif title set left, a piece of art set right.
 *
 * Like ProjectCover these are SCHEMATICS built from facts about the project, not
 * fake product screenshots — the owner has not supplied real captures yet.
 */
export function ProjectThumb({ motif, title }: { motif: CoverMotif | 'github'; title: string }) {
  return (
    <div
      className={`thumb thumb-${motif}`}
      role="img"
      aria-label={`${title} — project tile`}
    >
      <div aria-hidden className="thumb-in">
        {motif === 'detective' && <Detective />}
        {motif === 'chat' && <Chat />}
        {motif === 'contour' && <Contour />}
        {motif === 'github' && <Github />}
      </div>
    </div>
  )
}

function Kicker({ children }: { children: string }) {
  return <p className="thumb-kicker">{children}</p>
}

function Detective() {
  return (
    <>
      <Kicker>Investigation map</Kicker>
      <p className="thumb-title">
        Crime
        <br />
        Detective
      </p>
      <span className="thumb-btn">9 rooms · 4 suspects</span>
      <div className="thumb-art grid w-[34%] grid-cols-3 gap-[3%]">
        {Array.from({ length: 9 }, (_, i) => (
          <i
            key={i}
            className={`aspect-square border ${i === 4 ? 'border-clay bg-clay/40' : 'border-paper/30'}`}
          />
        ))}
      </div>
    </>
  )
}

function Chat() {
  return (
    <>
      <Kicker>Message flow</Kicker>
      <p className="thumb-title">
        Real-time
        <br />
        Chat
      </p>
      <span className="thumb-btn">Socket.IO · JWT</span>
      <div className="thumb-art flex w-[38%] flex-col gap-[7%]">
        <i className="block h-[0.9rem] w-[70%] border border-ink/40" />
        <i className="block h-[0.9rem] w-[85%] self-end bg-ink" />
        <i className="block h-[0.9rem] w-[55%] border border-clay bg-clay/25" />
      </div>
    </>
  )
}

function Contour() {
  return (
    <>
      <Kicker>Studio project</Kicker>
      <p className="thumb-title">
        Identity
        <br />
        &amp; Feel
      </p>
      <span className="thumb-btn">Contour Studio</span>
      <svg className="thumb-art w-[46%]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
        {[44, 35, 26, 17, 8].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} strokeOpacity={0.25 + (44 - r) / 70} />
        ))}
      </svg>
    </>
  )
}

function Github() {
  return (
    <>
      <Kicker>Elsewhere</Kicker>
      <p className="thumb-title">
        More on
        <br />
        GitHub
      </p>
      <span className="thumb-btn">Open profile ↗</span>
    </>
  )
}

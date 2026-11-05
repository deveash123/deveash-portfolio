/**
 * Below-the-fold reveal.
 *
 * Deliberately CSS-driven (scroll-timeline) rather than a JS `whileInView`
 * observer: a JS entrance that never fires leaves content at opacity 0, and on
 * this project that has already happened once. The animation is ADDITIVE — the
 * resting state is fully visible, so anything that cannot run the animation
 * (Safari, reduced motion, a stalled compositor) still shows the content.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  /** lead-in as a percentage of the scroll range */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  return (
    <Tag className={`reveal ${className}`} style={{ '--reveal-lead': `${delay}%` } as React.CSSProperties}>
      {children}
    </Tag>
  )
}

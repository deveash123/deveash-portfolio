import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { projects, skillGroups } from '../data/portfolio'
import { findProject } from '../data/portfolio'
import { site, socialLinks, availability, education } from '../data/site'

/**
 * These are CONTENT tests, not rendering tests. Their job is to enforce the two
 * honesty rules this site is built on, so a future edit cannot quietly
 * reintroduce a fabricated claim:
 *
 *   1. no invented screenshots or demo videos
 *   2. no invented skill percentages / levels outside the four-step scale
 */
describe('site identity', () => {
  it('exposes the owner\u2019s real links', () => {
    expect(site.github).toBe('https://github.com/deveash123')
    expect(site.linkedin).toBe('https://www.linkedin.com/in/deveashg')
    expect(site.email).toBe('gdeveash@gmail.com')
    expect(site.portfolio).toBe('https://gdeveash.vercel.app')
  })

  it('keeps resumeUrl null until a real PDF is supplied', () => {
    // The hero renders a resume button only when this is set, so a value here
    // without a file at public/ would advertise a 404.
    expect(site.resumeUrl).toBeNull()
  })

  it('gives every social row a real href', () => {
    for (const link of socialLinks) {
      expect(link.href).toMatch(/^(https:\/\/|mailto:)/)
    }
  })

  it('states availability in the owner\u2019s terms, not "freelance"', () => {
    expect(availability.barLabel).toMatch(/internship|collaboration/i)
    expect(availability.barLabel).not.toMatch(/freelance/i)
  })

  it('records the real education', () => {
    expect(education.school).toBe('Dhaanish Chennai College of Engineering')
    expect(education.graduation).toMatch(/2029/)
  })
})

describe('projects', () => {
  it('has three real projects with unique slugs', () => {
    expect(projects.length).toBe(3)
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('includes the two projects the owner confirmed', () => {
    expect(findProject('crime-detective')).toBeDefined()
    expect(findProject('chatflow')).toBeDefined()
  })

  it('returns undefined for an unknown slug rather than throwing', () => {
    expect(findProject('kavi')).toBeUndefined()
    expect(findProject(undefined)).toBeUndefined()
  })

  it('has no fabricated screenshots or demo videos', () => {
    for (const project of projects) {
      expect(project.screenshot).toBeNull()
      expect(project.demoVideo).toBeNull()
    }
  })

  it('does not link to a bare platform homepage as if it were a project', () => {
    for (const project of projects) {
      for (const link of project.links) {
        // A link must be to the specific thing, not to devpost.com or github.com
        expect(link.href).not.toMatch(/^https:\/\/(devpost|github)\.com\/?$/)
      }
    }
  })

  it('describes what was built rather than listing buzzwords', () => {
    for (const project of projects) {
      expect(project.problem.length).toBeGreaterThan(80)
      expect(project.contribution.length).toBeGreaterThan(80)
    }
  })
})

describe('skills are described honestly', () => {
  it('uses only the four-step ordinal scale', () => {
    for (const group of skillGroups) {
      for (const skill of group.skills) {
        expect([1, 2, 3, 4]).toContain(skill.level)
      }
    }
  })

  it('states C++ as learning, not as a percentage', () => {
    const cxx = skillGroups.flatMap((g) => g.skills).find((s) => s.name.includes('C++'))
    expect(cxx).toBeDefined()
    expect(cxx?.level).toBe(1)
    expect(cxx?.label).toMatch(/learning/i)
  })

  it('marks backend development as in progress', () => {
    const backend = skillGroups
      .flatMap((g) => g.skills)
      .find((s) => s.name === 'Backend development')
    expect(backend?.label).toMatch(/progress/i)
  })

  it('contains no percentage strings anywhere in the skill data', () => {
    const serialised = JSON.stringify(skillGroups)
    expect(serialised).not.toMatch(/\d+%/)
  })
})
/**
 * Palette contrast guard.
 *
 * `--color-ink-faint` shipped at #7a736a, which measured **4.04:1** on the cream
 * ground and failed WCAG AA at the 9.5-12px label sizes that tier exists for —
 * 16 visible failures across the site. Colour is easy to nudge back, so the rule
 * is enforced here against the tokens in `index.css` rather than left to taste.
 *
 * The full runtime audit (every element, against its real painted background,
 * all routes) is `%TEMP%/opencode/contrast-audit.cjs`. This is the fast
 * regression net for the palette itself.
 */
describe('palette contrast', () => {
  const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

  const token = (name: string) => {
    const match = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`))
    if (!match) throw new Error(`token ${name} not found in index.css`)
    return match[1]
  }

  const luminance = (hex: string) => {
    const n = parseInt(hex.slice(1), 16)
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
      const c = v / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const contrast = (a: string, b: string) => {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
    return (hi + 0.05) / (lo + 0.05)
  }

  const paper = token('--color-paper')
  const paperDim = token('--color-paper-dim')
  const clay = token('--color-clay')

  it('every text tier reaches WCAG AA (4.5:1) on the cream ground', () => {
    for (const name of ['--color-ink', '--color-ink-soft', '--color-ink-faint', '--color-clay']) {
      const ratio = contrast(token(name), paper)
      expect(ratio, `${name} on paper is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('every text tier still reaches AA on the dimmed panel', () => {
    for (const name of ['--color-ink', '--color-ink-soft', '--color-ink-faint']) {
      const ratio = contrast(token(name), paperDim)
      expect(ratio, `${name} on paper-dim is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('plain clay is not used as body text on the dimmed panel', () => {
    // clay on paper-dim is only ~4.20:1; the dimmed panel must use clay-deep.
    expect(contrast(clay, paperDim)).toBeLessThan(4.5)
    expect(contrast(token('--color-clay-deep'), paperDim)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps a readable hierarchy between the ink tiers', () => {
    // each tier must be visibly lighter than the one above it, or the palette
    // loses the only structure it has
    expect(luminance(token('--color-ink'))).toBeLessThan(luminance(token('--color-ink-soft')))
    expect(luminance(token('--color-ink-soft'))).toBeLessThan(luminance(token('--color-ink-faint')))
  })

  it('paper text on the clay ground is readable', () => {
    expect(contrast(paper, clay)).toBeGreaterThanOrEqual(4.5)
  })
})

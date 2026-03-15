import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatExactTime, getRelativeTime } from './format-time.js'

describe('formatExactTime', () => {
  it('formats date to expected pattern', () => {
    const result = formatExactTime('2026-03-15T14:30:00Z')
    // Should contain time, weekday, and date parts
    expect(result).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)\s*\w+\s*\d+\/\d+\/\d+/)
  })
})

describe('getRelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "Just now" for < 1 minute ago', () => {
    const now = new Date()
    expect(getRelativeTime(now.toISOString())).toBe('Just now')
  })

  it('returns "Xm ago" for minutes', () => {
    const date = new Date(Date.now() - 5 * 60000)
    expect(getRelativeTime(date.toISOString())).toBe('5m ago')
  })

  it('returns "Xh ago" for hours', () => {
    const date = new Date(Date.now() - 3 * 3600000)
    expect(getRelativeTime(date.toISOString())).toBe('3h ago')
  })

  it('returns "Xd ago" for days', () => {
    const date = new Date(Date.now() - 2 * 86400000)
    expect(getRelativeTime(date.toISOString())).toBe('2d ago')
  })

  it('returns "Xw ago" for weeks', () => {
    const date = new Date(Date.now() - 14 * 86400000)
    expect(getRelativeTime(date.toISOString())).toBe('2w ago')
  })

  it('returns formatted date for > 30 days', () => {
    const date = new Date(Date.now() - 60 * 86400000)
    const result = getRelativeTime(date.toISOString())
    // Should be a readable date like "Jan 14, 2026"
    expect(result).toMatch(/\w+ \d+, \d{4}/)
  })
})

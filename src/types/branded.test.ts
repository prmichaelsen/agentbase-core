import { describe, it, expect } from 'vitest'
import { toUserId, toSessionId, toTokenId, toEmailAddress, toTimestamp } from './branded.js'

describe('branded primitives', () => {
  it('toUserId returns branded string', () => {
    const id = toUserId('abc')
    expect(id).toBe('abc')
    expect(typeof id).toBe('string')
  })

  it('toSessionId returns branded string', () => {
    const id = toSessionId('sess-123')
    expect(id).toBe('sess-123')
  })

  it('toTokenId returns branded string', () => {
    const id = toTokenId('tok-456')
    expect(id).toBe('tok-456')
  })

  it('toEmailAddress returns branded string', () => {
    const email = toEmailAddress('a@b.com')
    expect(email).toBe('a@b.com')
  })

  it('toTimestamp returns branded number', () => {
    const ts = toTimestamp(1234567890)
    expect(ts).toBe(1234567890)
    expect(typeof ts).toBe('number')
  })
})

import { describe, it, expect } from 'vitest'
import { isRealUser, isRealUserServer } from './helpers.js'

describe('isRealUser', () => {
  it('returns true for non-anonymous user', () => {
    expect(isRealUser({ isAnonymous: false })).toBe(true)
  })

  it('returns false for anonymous user', () => {
    expect(isRealUser({ isAnonymous: true })).toBe(false)
  })

  it('returns false for null', () => {
    expect(isRealUser(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isRealUser(undefined)).toBe(false)
  })

  it('returns true when isAnonymous is undefined (real user assumed)', () => {
    expect(isRealUser({})).toBe(true)
  })
})

describe('isRealUserServer', () => {
  const makeUser = (overrides = {}) => ({
    uid: 'u1',
    email: 'a@b.com',
    displayName: null,
    photoURL: null,
    emailVerified: true,
    isAnonymous: false,
    ...overrides,
  })

  it('returns true for non-anonymous AuthUser', () => {
    expect(isRealUserServer(makeUser())).toBe(true)
  })

  it('returns false for anonymous AuthUser', () => {
    expect(isRealUserServer(makeUser({ isAnonymous: true }))).toBe(false)
  })

  it('returns false for null', () => {
    expect(isRealUserServer(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isRealUserServer(undefined)).toBe(false)
  })
})

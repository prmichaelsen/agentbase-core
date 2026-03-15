import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockVerifySessionCookie, mockVerifyIdToken } = vi.hoisted(() => ({
  mockVerifySessionCookie: vi.fn(),
  mockVerifyIdToken: vi.fn(),
}))

vi.mock('@prmichaelsen/firebase-admin-sdk-v8', () => ({
  verifySessionCookie: mockVerifySessionCookie,
  verifyIdToken: mockVerifyIdToken,
  createSessionCookie: vi.fn(),
}))

// Suppress console output
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'debug').mockImplementation(() => {})

import { requireAuth, requireAdmin, isAdmin } from './guards.js'

function makeRequest(cookie?: string): Request {
  const headers = new Headers()
  if (cookie) headers.set('cookie', cookie)
  return new Request('https://example.com', { headers })
}

const decodedToken = {
  sub: 'user-123',
  email: 'admin@example.com',
  name: 'Admin',
  picture: null,
  email_verified: true,
  firebase: { sign_in_provider: 'password' },
}

describe('requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null (pass) for authenticated request', async () => {
    mockVerifySessionCookie.mockResolvedValue(decodedToken)
    const result = await requireAuth(makeRequest('session=valid'))
    expect(result).toBeNull()
  })

  it('returns 401 for unauthenticated request', async () => {
    const result = await requireAuth(makeRequest())
    expect(result).toBeInstanceOf(Response)
    expect(result!.status).toBe(401)
    const body = await result!.json()
    expect(body.error).toContain('Unauthorized')
  })
})

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null for admin email', async () => {
    mockVerifySessionCookie.mockResolvedValue(decodedToken)
    const result = await requireAdmin(makeRequest('session=valid'), 'admin@example.com,other@ex.com')
    expect(result).toBeNull()
  })

  it('returns 401 for unauthenticated request', async () => {
    const result = await requireAdmin(makeRequest())
    expect(result).toBeInstanceOf(Response)
    expect(result!.status).toBe(401)
  })

  it('returns 403 for non-admin authenticated user', async () => {
    mockVerifySessionCookie.mockResolvedValue({
      ...decodedToken,
      email: 'regular@example.com',
    })
    const result = await requireAdmin(makeRequest('session=valid'), 'admin@example.com')
    expect(result).toBeInstanceOf(Response)
    expect(result!.status).toBe(403)
    const body = await result!.json()
    expect(body.error).toContain('Forbidden')
  })

  it('reads OWNER_EMAILS from env when not passed', async () => {
    const original = process.env.OWNER_EMAILS
    process.env.OWNER_EMAILS = 'admin@example.com'
    mockVerifySessionCookie.mockResolvedValue(decodedToken)
    const result = await requireAdmin(makeRequest('session=valid'))
    expect(result).toBeNull()
    process.env.OWNER_EMAILS = original
  })
})

describe('isAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true for admin email', async () => {
    mockVerifySessionCookie.mockResolvedValue(decodedToken)
    expect(await isAdmin(makeRequest('session=valid'), 'admin@example.com')).toBe(true)
  })

  it('returns false for non-admin', async () => {
    mockVerifySessionCookie.mockResolvedValue({
      ...decodedToken,
      email: 'nope@example.com',
    })
    expect(await isAdmin(makeRequest('session=valid'), 'admin@example.com')).toBe(false)
  })

  it('returns false for unauthenticated', async () => {
    expect(await isAdmin(makeRequest(), 'admin@example.com')).toBe(false)
  })

  it('handles comma-separated emails', async () => {
    mockVerifySessionCookie.mockResolvedValue(decodedToken)
    expect(await isAdmin(makeRequest('session=valid'), 'other@x.com, admin@example.com')).toBe(true)
  })
})

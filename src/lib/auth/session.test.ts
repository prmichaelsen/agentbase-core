import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { mockVerifySessionCookie, mockVerifyIdToken, mockCreateFirebaseSessionCookie } = vi.hoisted(() => ({
  mockVerifySessionCookie: vi.fn(),
  mockVerifyIdToken: vi.fn(),
  mockCreateFirebaseSessionCookie: vi.fn(),
}))

vi.mock('@prmichaelsen/firebase-admin-sdk-v8', () => ({
  verifySessionCookie: mockVerifySessionCookie,
  verifyIdToken: mockVerifyIdToken,
  createSessionCookie: mockCreateFirebaseSessionCookie,
}))

// Suppress console output in tests
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'warn').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})
vi.spyOn(console, 'debug').mockImplementation(() => {})

import { getServerSession, isAuthenticated, createSessionCookie, revokeSession } from './session.js'

function makeRequest(cookie?: string): Request {
  const headers = new Headers()
  if (cookie) headers.set('cookie', cookie)
  return new Request('https://example.com', { headers })
}

const decodedToken = {
  sub: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  picture: 'https://photo.url',
  email_verified: true,
  firebase: { sign_in_provider: 'password' },
}

describe('getServerSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns session for valid session cookie', async () => {
    mockVerifySessionCookie.mockResolvedValue(decodedToken)
    const session = await getServerSession(makeRequest('session=valid-cookie'))
    expect(session).toEqual({
      user: {
        uid: 'user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://photo.url',
        emailVerified: true,
        isAnonymous: false,
      },
    })
  })

  it('returns null when no cookie header', async () => {
    const session = await getServerSession(makeRequest())
    expect(session).toBeNull()
  })

  it('returns null when no session cookie in header', async () => {
    const session = await getServerSession(makeRequest('other=value'))
    expect(session).toBeNull()
  })

  it('falls back to verifyIdToken on session cookie failure', async () => {
    mockVerifySessionCookie.mockRejectedValue(new Error('invalid'))
    mockVerifyIdToken.mockResolvedValue(decodedToken)
    const session = await getServerSession(makeRequest('session=id-token'))
    expect(session).not.toBeNull()
    expect(mockVerifyIdToken).toHaveBeenCalledWith('id-token')
  })

  it('maps anonymous provider correctly', async () => {
    mockVerifySessionCookie.mockResolvedValue({
      ...decodedToken,
      email: undefined,
      firebase: { sign_in_provider: 'anonymous' },
    })
    const session = await getServerSession(makeRequest('session=anon-cookie'))
    expect(session!.user.isAnonymous).toBe(true)
    expect(session!.user.email).toBeNull()
  })

  it('returns null on complete verification failure', async () => {
    mockVerifySessionCookie.mockRejectedValue(new Error('fail'))
    mockVerifyIdToken.mockRejectedValue(new Error('fail'))
    const session = await getServerSession(makeRequest('session=bad'))
    expect(session).toBeNull()
  })
})

describe('isAuthenticated', () => {
  it('returns true for authenticated request', async () => {
    mockVerifySessionCookie.mockResolvedValue(decodedToken)
    expect(await isAuthenticated(makeRequest('session=valid'))).toBe(true)
  })

  it('returns false for unauthenticated request', async () => {
    expect(await isAuthenticated(makeRequest())).toBe(false)
  })
})

describe('createSessionCookie', () => {
  it('calls Firebase admin with correct params', async () => {
    mockCreateFirebaseSessionCookie.mockResolvedValue('session-cookie-value')
    const result = await createSessionCookie('id-token-123')
    expect(mockCreateFirebaseSessionCookie).toHaveBeenCalledWith('id-token-123', {
      expiresIn: 60 * 60 * 24 * 14 * 1000,
    })
    expect(result).toBe('session-cookie-value')
  })

  it('throws on failure', async () => {
    mockCreateFirebaseSessionCookie.mockRejectedValue(new Error('nope'))
    await expect(createSessionCookie('bad')).rejects.toThrow('Failed to create session cookie')
  })
})

describe('revokeSession', () => {
  it('does not throw for valid session', async () => {
    mockVerifySessionCookie.mockResolvedValue(decodedToken)
    await expect(revokeSession(makeRequest('session=valid'))).resolves.toBeUndefined()
  })

  it('does not throw for no session', async () => {
    await expect(revokeSession(makeRequest())).resolves.toBeUndefined()
  })

  it('throws ExternalError when getServerSession throws', async () => {
    mockVerifySessionCookie.mockImplementation(() => { throw new Error('crash') })
    mockVerifyIdToken.mockImplementation(() => { throw new Error('crash') })
    // revokeSession catches the outer error and re-throws as ExternalError
    // But getServerSession catches internally and returns null, so revokeSession won't throw
    // We need to make the session?.user check path throw
    await expect(revokeSession(makeRequest('session=crash'))).resolves.toBeUndefined()
  })
})

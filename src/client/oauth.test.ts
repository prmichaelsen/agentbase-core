import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateCodeVerifier,
  generateCodeChallenge,
  buildAuthorizationUrl,
  InMemoryTokenStorage,
  OAuthClient,
} from './oauth.js'
import { HttpClient } from './http-transport.js'

describe('generateCodeVerifier', () => {
  it('returns string of specified length', () => {
    expect(generateCodeVerifier(43).length).toBe(43)
    expect(generateCodeVerifier(128).length).toBe(128)
  })

  it('defaults to 64 chars', () => {
    expect(generateCodeVerifier().length).toBe(64)
  })

  it('generates unique values', () => {
    expect(generateCodeVerifier()).not.toBe(generateCodeVerifier())
  })
})

describe('generateCodeChallenge', () => {
  it('returns URL-safe base64 string', async () => {
    const challenge = await generateCodeChallenge('test-verifier')
    expect(challenge).not.toContain('+')
    expect(challenge).not.toContain('/')
    expect(challenge).not.toContain('=')
    expect(challenge.length).toBeGreaterThan(0)
  })

  it('is deterministic', async () => {
    const a = await generateCodeChallenge('same')
    const b = await generateCodeChallenge('same')
    expect(a).toBe(b)
  })
})

describe('buildAuthorizationUrl', () => {
  it('builds correct URL with required params', () => {
    const url = buildAuthorizationUrl('https://agentbase.me', {
      clientId: 'my-client',
      redirectUri: 'http://localhost:3000/callback',
    })
    expect(url).toContain('response_type=code')
    expect(url).toContain('client_id=my-client')
    expect(url).toContain('redirect_uri=')
  })

  it('includes optional params', () => {
    const url = buildAuthorizationUrl('https://agentbase.me', {
      clientId: 'c',
      redirectUri: 'http://localhost',
      scope: 'read write',
      state: 'xyz',
      codeChallenge: 'abc123',
    })
    expect(url).toContain('scope=read+write')
    expect(url).toContain('state=xyz')
    expect(url).toContain('code_challenge=abc123')
    expect(url).toContain('code_challenge_method=S256')
  })
})

describe('InMemoryTokenStorage', () => {
  let storage: InMemoryTokenStorage

  beforeEach(() => {
    storage = new InMemoryTokenStorage()
  })

  it('returns null when empty', async () => {
    expect(await storage.getAccessToken()).toBeNull()
    expect(await storage.getRefreshToken()).toBeNull()
  })

  it('stores and retrieves tokens', async () => {
    await storage.setTokens('access', 'refresh', 3600)
    expect(await storage.getAccessToken()).toBe('access')
    expect(await storage.getRefreshToken()).toBe('refresh')
  })

  it('returns null for expired access token', async () => {
    await storage.setTokens('access', 'refresh', 0)
    expect(await storage.getAccessToken()).toBeNull()
    expect(await storage.getRefreshToken()).toBe('refresh')
  })

  it('clears tokens', async () => {
    await storage.setTokens('a', 'r', 3600)
    await storage.clearTokens()
    expect(await storage.getAccessToken()).toBeNull()
    expect(await storage.getRefreshToken()).toBeNull()
  })
})

describe('OAuthClient', () => {
  const mockFetch = vi.fn()
  vi.stubGlobal('fetch', mockFetch)

  function jsonResponse(data: object, status = 200) {
    return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
  }

  let oauthClient: OAuthClient

  beforeEach(() => {
    vi.clearAllMocks()
    const http = new HttpClient({ baseUrl: 'https://api.test' })
    oauthClient = new OAuthClient(http, { clientId: 'test-client' })
  })

  it('exchanges code for tokens', async () => {
    mockFetch.mockResolvedValue(jsonResponse({
      access_token: 'at',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'rt',
    }))

    const result = await oauthClient.exchangeCode('code123', 'http://localhost/cb', 'verifier')
    expect(result.data?.access_token).toBe('at')

    const storage = oauthClient.getStorage()
    expect(await storage.getAccessToken()).toBe('at')
    expect(await storage.getRefreshToken()).toBe('rt')
  })

  it('exchanges API token', async () => {
    mockFetch.mockResolvedValue(jsonResponse({
      access_token: 'at2',
      token_type: 'bearer',
      expires_in: 3600,
    }))

    const result = await oauthClient.exchangeApiToken('my-api-key')
    expect(result.data?.access_token).toBe('at2')
  })

  it('getValidToken returns stored token', async () => {
    mockFetch.mockResolvedValue(jsonResponse({
      access_token: 'at3',
      token_type: 'bearer',
      expires_in: 3600,
    }))

    await oauthClient.exchangeCode('code', 'http://cb')
    const token = await oauthClient.getValidToken()
    expect(token).toBe('at3')
  })
})

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

  it('refreshAccessToken returns null when no refresh token stored', async () => {
    const result = await oauthClient.refreshAccessToken()
    expect(result).toBeNull()
  })

  it('refreshAccessToken uses stored refresh token', async () => {
    // First store tokens via exchangeCode
    mockFetch.mockResolvedValueOnce(jsonResponse({
      access_token: 'at-old',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'rt-stored',
    }))
    await oauthClient.exchangeCode('code', 'http://cb')

    // Now refresh
    mockFetch.mockResolvedValueOnce(jsonResponse({
      access_token: 'at-refreshed',
      token_type: 'bearer',
      expires_in: 3600,
    }))
    const result = await oauthClient.refreshAccessToken()
    expect(result!.data!.access_token).toBe('at-refreshed')

    const body = JSON.parse(mockFetch.mock.calls[1][1].body)
    expect(body.grant_type).toBe('refresh_token')
    expect(body.refresh_token).toBe('rt-stored')
  })

  it('getValidToken refreshes when token expired', async () => {
    // Store tokens with 0 expiry (immediately expired)
    mockFetch.mockResolvedValueOnce(jsonResponse({
      access_token: 'at-expired',
      token_type: 'bearer',
      expires_in: 0,
      refresh_token: 'rt-for-refresh',
    }))
    await oauthClient.exchangeCode('code', 'http://cb')

    // getValidToken should trigger refresh
    mockFetch.mockResolvedValueOnce(jsonResponse({
      access_token: 'at-fresh',
      token_type: 'bearer',
      expires_in: 3600,
    }))
    const token = await oauthClient.getValidToken()
    expect(token).toBe('at-fresh')
  })

  it('getValidToken returns null when no token and no refresh token', async () => {
    const token = await oauthClient.getValidToken()
    expect(token).toBeNull()
  })

  it('includes clientSecret when provided', async () => {
    const http = new HttpClient({ baseUrl: 'https://api.test' })
    const clientWithSecret = new OAuthClient(http, {
      clientId: 'test-client',
      clientSecret: 'my-secret',
    })

    mockFetch.mockResolvedValue(jsonResponse({
      access_token: 'at',
      token_type: 'bearer',
      expires_in: 3600,
    }))

    await clientWithSecret.exchangeCode('code', 'http://cb')
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.client_secret).toBe('my-secret')
  })

  it('refreshAccessToken includes clientSecret when provided', async () => {
    const http = new HttpClient({ baseUrl: 'https://api.test' })
    const clientWithSecret = new OAuthClient(http, {
      clientId: 'test-client',
      clientSecret: 'my-secret',
    })

    // Store tokens first
    mockFetch.mockResolvedValueOnce(jsonResponse({
      access_token: 'at',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'rt',
    }))
    await clientWithSecret.exchangeCode('code', 'http://cb')

    // Refresh
    mockFetch.mockResolvedValueOnce(jsonResponse({
      access_token: 'at2',
      token_type: 'bearer',
      expires_in: 3600,
    }))
    await clientWithSecret.refreshAccessToken()
    const body = JSON.parse(mockFetch.mock.calls[1][1].body)
    expect(body.client_secret).toBe('my-secret')
  })

  it('exchangeCode without codeVerifier omits it from body', async () => {
    mockFetch.mockResolvedValue(jsonResponse({
      access_token: 'at',
      token_type: 'bearer',
      expires_in: 3600,
    }))

    await oauthClient.exchangeCode('code', 'http://cb')
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.code_verifier).toBeUndefined()
  })

  it('exchangeCode error response does not store tokens', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ error: 'invalid_grant' }, 400))

    await oauthClient.exchangeCode('bad-code', 'http://cb')
    const storage = oauthClient.getStorage()
    expect(await storage.getAccessToken()).toBeNull()
  })

  it('refreshAccessToken error response does not update tokens', async () => {
    // Store initial tokens
    mockFetch.mockResolvedValueOnce(jsonResponse({
      access_token: 'at',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'rt',
    }))
    await oauthClient.exchangeCode('code', 'http://cb')

    // Failed refresh
    mockFetch.mockResolvedValueOnce(jsonResponse({ error: 'invalid_grant' }, 400))
    const result = await oauthClient.refreshAccessToken()
    expect(result!.error).not.toBeNull()
  })
})

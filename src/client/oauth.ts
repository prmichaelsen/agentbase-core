import type { HttpClient } from './http-transport.js'

/**
 * Generate a random PKCE code verifier (43-128 chars, URL-safe)
 */
export function generateCodeVerifier(length = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

/**
 * Generate PKCE code challenge from verifier (S256)
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Build OAuth authorization URL
 */
export function buildAuthorizationUrl(
  baseUrl: string,
  params: {
    clientId: string
    redirectUri: string
    scope?: string
    state?: string
    codeChallenge?: string
  }
): string {
  const url = new URL('/oauth/authorize', baseUrl)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', params.clientId)
  url.searchParams.set('redirect_uri', params.redirectUri)
  if (params.scope) url.searchParams.set('scope', params.scope)
  if (params.state) url.searchParams.set('state', params.state)
  if (params.codeChallenge) {
    url.searchParams.set('code_challenge', params.codeChallenge)
    url.searchParams.set('code_challenge_method', 'S256')
  }
  return url.toString()
}

/**
 * Token storage interface — implement to persist tokens
 */
export interface TokenStorage {
  getAccessToken(): Promise<string | null>
  getRefreshToken(): Promise<string | null>
  setTokens(accessToken: string, refreshToken: string | null, expiresIn: number): Promise<void>
  clearTokens(): Promise<void>
}

/**
 * In-memory token storage (default, not persistent)
 */
export class InMemoryTokenStorage implements TokenStorage {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private expiresAt: number = 0

  async getAccessToken() {
    if (this.accessToken && Date.now() < this.expiresAt) return this.accessToken
    return null
  }

  async getRefreshToken() {
    return this.refreshToken
  }

  async setTokens(accessToken: string, refreshToken: string | null, expiresIn: number) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken ?? this.refreshToken
    this.expiresAt = Date.now() + expiresIn * 1000
  }

  async clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    this.expiresAt = 0
  }
}

/**
 * OAuth client — handles token exchange and refresh
 */
export class OAuthClient {
  private http: HttpClient
  private storage: TokenStorage
  private clientId: string
  private clientSecret?: string

  constructor(
    http: HttpClient,
    options: {
      clientId: string
      clientSecret?: string
      storage?: TokenStorage
    }
  ) {
    this.http = http
    this.clientId = options.clientId
    this.clientSecret = options.clientSecret
    this.storage = options.storage ?? new InMemoryTokenStorage()
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCode(code: string, redirectUri: string, codeVerifier?: string) {
    const body: Record<string, string> = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: this.clientId,
    }
    if (this.clientSecret) body.client_secret = this.clientSecret
    if (codeVerifier) body.code_verifier = codeVerifier

    const result = await this.http.post<{
      access_token: string
      token_type: string
      expires_in: number
      refresh_token?: string
    }>('/api/oauth/token', body)

    if (result.data) {
      await this.storage.setTokens(
        result.data.access_token,
        result.data.refresh_token ?? null,
        result.data.expires_in
      )
    }

    return result
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken() {
    const refreshToken = await this.storage.getRefreshToken()
    if (!refreshToken) return null

    const body: Record<string, string> = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
    }
    if (this.clientSecret) body.client_secret = this.clientSecret

    const result = await this.http.post<{
      access_token: string
      token_type: string
      expires_in: number
      refresh_token?: string
    }>('/api/oauth/token', body)

    if (result.data) {
      await this.storage.setTokens(
        result.data.access_token,
        result.data.refresh_token ?? null,
        result.data.expires_in
      )
    }

    return result
  }

  /**
   * Exchange API token for access token
   */
  async exchangeApiToken(apiToken: string) {
    const result = await this.http.post<{
      access_token: string
      token_type: string
      expires_in: number
    }>('/api/oauth/token', {
      grant_type: 'api_token',
      api_token: apiToken,
      client_id: this.clientId,
    })

    if (result.data) {
      await this.storage.setTokens(result.data.access_token, null, result.data.expires_in)
    }

    return result
  }

  /**
   * Get a valid access token (refreshes if expired)
   */
  async getValidToken(): Promise<string | null> {
    const token = await this.storage.getAccessToken()
    if (token) return token

    const refreshResult = await this.refreshAccessToken()
    return refreshResult?.data?.access_token ?? null
  }

  getStorage() {
    return this.storage
  }
}

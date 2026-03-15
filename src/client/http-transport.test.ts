import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from './http-transport.js'
import { UnauthorizedError, RateLimitError, ExternalError } from '../errors/index.js'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

function jsonResponse(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('HttpClient', () => {
  let client: HttpClient

  beforeEach(() => {
    vi.clearAllMocks()
    client = new HttpClient({ baseUrl: 'https://api.test' })
  })

  describe('request', () => {
    it('makes GET request with correct URL', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ ok: true }))
      await client.get('/foo')
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.test/foo',
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('appends query params', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ ok: true }))
      await client.get('/foo', { limit: 10, cursor: 'abc' })
      const url = mockFetch.mock.calls[0][0]
      expect(url).toContain('limit=10')
      expect(url).toContain('cursor=abc')
    })

    it('skips undefined params', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ ok: true }))
      await client.get('/foo', { limit: 10, cursor: undefined })
      const url = mockFetch.mock.calls[0][0]
      expect(url).toContain('limit=10')
      expect(url).not.toContain('cursor')
    })

    it('sends JSON body for POST', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ ok: true }))
      await client.post('/foo', { bar: 'baz' })
      const call = mockFetch.mock.calls[0]
      expect(call[1].body).toBe(JSON.stringify({ bar: 'baz' }))
      expect(call[1].headers['Content-Type']).toBe('application/json')
    })

    it('returns data on success', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ name: 'test' }))
      const result = await client.get<{ name: string }>('/foo')
      expect(result.data).toEqual({ name: 'test' })
      expect(result.error).toBeNull()
      expect(result.status).toBe(200)
    })

    it('returns UnauthorizedError on 401', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ error: 'bad token' }, 401))
      const result = await client.get('/foo')
      expect(result.data).toBeNull()
      expect(result.error).toBeInstanceOf(UnauthorizedError)
      expect(result.status).toBe(401)
    })

    it('returns RateLimitError on 429', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ error: 'slow down' }, 429))
      const result = await client.get('/foo')
      expect(result.error).toBeInstanceOf(RateLimitError)
      expect(result.status).toBe(429)
    })

    it('returns ExternalError on other errors', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ error: 'nope' }, 500))
      const result = await client.get('/foo')
      expect(result.error).toBeInstanceOf(ExternalError)
      expect(result.status).toBe(500)
    })

    it('handles network errors', async () => {
      mockFetch.mockRejectedValue(new TypeError('Failed to fetch'))
      const result = await client.get('/foo')
      expect(result.data).toBeNull()
      expect(result.error).toBeInstanceOf(ExternalError)
      expect(result.error!.message).toBe('Failed to fetch')
      expect(result.status).toBe(0)
    })
  })

  describe('auth strategies', () => {
    it('adds bearer token header', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))
      const authedClient = new HttpClient({
        baseUrl: 'https://api.test',
        auth: { type: 'bearer', token: 'my-token' },
      })
      await authedClient.get('/foo')
      const headers = mockFetch.mock.calls[0][1].headers
      expect(headers.Authorization).toBe('Bearer my-token')
    })

    it('supports async token function', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))
      const authedClient = new HttpClient({
        baseUrl: 'https://api.test',
        auth: { type: 'bearer', token: async () => 'dynamic-token' },
      })
      await authedClient.get('/foo')
      const headers = mockFetch.mock.calls[0][1].headers
      expect(headers.Authorization).toBe('Bearer dynamic-token')
    })

    it('adds API key header', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))
      const authedClient = new HttpClient({
        baseUrl: 'https://api.test',
        auth: { type: 'apiKey', key: 'my-key' },
      })
      await authedClient.get('/foo')
      const headers = mockFetch.mock.calls[0][1].headers
      expect(headers.Authorization).toBe('Bearer my-key')
    })

    it('cookie auth sends credentials include', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))
      const authedClient = new HttpClient({
        baseUrl: 'https://api.test',
        auth: { type: 'cookie' },
      })
      await authedClient.get('/foo')
      expect(mockFetch.mock.calls[0][1].credentials).toBe('include')
    })
  })

  describe('HTTP methods', () => {
    it('patch sends PATCH', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))
      await client.patch('/foo', { x: 1 })
      expect(mockFetch.mock.calls[0][1].method).toBe('PATCH')
    })

    it('delete sends DELETE', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))
      await client.delete('/foo')
      expect(mockFetch.mock.calls[0][1].method).toBe('DELETE')
    })
  })
})

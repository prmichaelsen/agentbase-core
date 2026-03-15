import { describe, it, expect, vi } from 'vitest'
import { checkRateLimit, createRateLimitResponse, getRateLimitIdentifier } from './rate-limiter.js'

// Suppress console.error in tests
vi.spyOn(console, 'error').mockImplementation(() => {})

const config = { limit: 100, period: 60, keyPrefix: 'api' }

describe('checkRateLimit', () => {
  it('returns success when limiter allows', async () => {
    const limiter = { limit: vi.fn().mockResolvedValue({ success: true, limit: 100, remaining: 99 }) }
    const result = await checkRateLimit(limiter, 'user:1', config)
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(99)
  })

  it('returns failure when limiter denies', async () => {
    const limiter = { limit: vi.fn().mockResolvedValue({ success: false, limit: 100, remaining: 0, retryAfter: 30 }) }
    const result = await checkRateLimit(limiter, 'user:1', config)
    expect(result.success).toBe(false)
    expect(result.retryAfter).toBe(30)
  })

  it('fails open on limiter error', async () => {
    const limiter = { limit: vi.fn().mockRejectedValue(new Error('down')) }
    const result = await checkRateLimit(limiter, 'user:1', config)
    expect(result.success).toBe(true)
    expect(result.limit).toBe(100)
  })

  it('constructs key from prefix + identifier', async () => {
    const limiter = { limit: vi.fn().mockResolvedValue({ success: true, limit: 100, remaining: 99 }) }
    await checkRateLimit(limiter, 'user:abc', config)
    expect(limiter.limit).toHaveBeenCalledWith({ key: 'api:user:abc' })
  })
})

describe('createRateLimitResponse', () => {
  it('returns 429 status', () => {
    const res = createRateLimitResponse({ success: false, limit: 100, remaining: 0, retryAfter: 60 })
    expect(res.status).toBe(429)
  })

  it('includes Retry-After header', () => {
    const res = createRateLimitResponse({ success: false, limit: 100, remaining: 0, retryAfter: 30 })
    expect(res.headers.get('Retry-After')).toBe('30')
  })

  it('includes X-RateLimit headers', () => {
    const res = createRateLimitResponse({ success: false, limit: 100, remaining: 5, retryAfter: 60 })
    expect(res.headers.get('X-RateLimit-Limit')).toBe('100')
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('5')
  })

  it('body contains error message JSON', async () => {
    const res = createRateLimitResponse({ success: false, limit: 100, remaining: 0, retryAfter: 60 })
    const body = await res.json()
    expect(body.error).toBe('Too many requests')
    expect(body.retryAfter).toBe(60)
  })
})

describe('getRateLimitIdentifier', () => {
  it('returns user:{userId} when userId provided', () => {
    const req = new Request('https://x.com')
    expect(getRateLimitIdentifier(req, 'u123')).toBe('user:u123')
  })

  it('returns ip from cf-connecting-ip header', () => {
    const req = new Request('https://x.com', { headers: { 'cf-connecting-ip': '1.2.3.4' } })
    expect(getRateLimitIdentifier(req)).toBe('ip:1.2.3.4')
  })

  it('falls back to x-forwarded-for', () => {
    const req = new Request('https://x.com', { headers: { 'x-forwarded-for': '5.6.7.8' } })
    expect(getRateLimitIdentifier(req)).toBe('ip:5.6.7.8')
  })

  it('returns ip:unknown when no headers', () => {
    const req = new Request('https://x.com')
    expect(getRateLimitIdentifier(req)).toBe('ip:unknown')
  })
})

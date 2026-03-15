/**
 * Rate Limiting Utility
 *
 * Provides rate limiting functionality using Cloudflare Workers Rate Limiting API
 */

import { apiLogger } from './logger.js'

export interface RateLimitConfig {
  limit: number
  period: number  // seconds
  keyPrefix: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  retryAfter?: number
}

/**
 * Check rate limit for a request
 */
export async function checkRateLimit(
  rateLimiter: any,  // Cloudflare Rate Limiter binding
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `${config.keyPrefix}:${identifier}`

  try {
    const { success, limit, remaining, retryAfter } = await rateLimiter.limit({ key })

    return {
      success,
      limit,
      remaining,
      retryAfter
    }
  } catch (error) {
    apiLogger.error('Rate limit check failed, failing open', error as Error)
    // Fail open - allow request if rate limiter fails
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit
    }
  }
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  const retryAfter = result.retryAfter ?? 60
  const limit = result.limit ?? 100
  const remaining = result.remaining ?? 0

  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString()
      }
    }
  )
}

/**
 * Get rate limit identifier from request
 * Uses IP address, falling back to user ID if authenticated
 */
export function getRateLimitIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`
  }

  const ip = request.headers.get('cf-connecting-ip') ||
              request.headers.get('x-forwarded-for') ||
              'unknown'

  return `ip:${ip}`
}

# Task 9: Tests — Rate Limiter

**Milestone**: M1 — Core Infrastructure
**Status**: not_started
**Estimated Hours**: 1.5
**Depends on**: Task 2

## Objective

Write unit tests for `checkRateLimit`, `createRateLimitResponse`, and `getRateLimitIdentifier`.

## Context

- `checkRateLimit` expects a Cloudflare Workers rate limiter binding (mock `.limit()`)
- `createRateLimitResponse` creates a 429 Response with standard headers
- `getRateLimitIdentifier` extracts IP from CF headers or uses userId

## Steps

### rate-limiter.test.ts
1. `checkRateLimit` — returns success when limiter allows
2. `checkRateLimit` — returns failure when limiter denies
3. `checkRateLimit` — fails open on limiter error (returns success: true)
4. `checkRateLimit` — constructs key from prefix + identifier
5. `createRateLimitResponse` — returns 429 status
6. `createRateLimitResponse` — includes Retry-After header
7. `createRateLimitResponse` — includes X-RateLimit-Limit and X-RateLimit-Remaining headers
8. `createRateLimitResponse` — body contains error message JSON
9. `getRateLimitIdentifier` — returns `user:{userId}` when userId provided
10. `getRateLimitIdentifier` — returns `ip:{ip}` from cf-connecting-ip header
11. `getRateLimitIdentifier` — falls back to x-forwarded-for
12. `getRateLimitIdentifier` — returns `ip:unknown` when no headers

## Verification

- [ ] Rate limiter mock correctly simulated
- [ ] Fail-open behavior verified
- [ ] Response headers and body correct
- [ ] IP extraction priority order verified

# Task 14: Update session.ts and rate-limiter.ts error handling
**Milestone**: M2 — Critical Pattern Compliance
**Status**: not_started
**Estimated Hours**: 1
**Depends on**: T12

## Objective
Replace generic error returns and silent failures in `session.ts` and `rate-limiter.ts` with typed error throws, improving debuggability and enabling callers to handle specific failure modes.

## Context
`getServerSession` currently returns `null` on verification failure, hiding the reason for failure. `createSessionCookie` throws a generic `Error`. `rate-limiter.ts` uses `console.error` and fails open silently. Typed errors make failure modes explicit while preserving the fail-open behavior for rate limiting.

## Steps
1. Update `src/lib/auth/session.ts`
   - `getServerSession`: throw `UnauthorizedError` on token verification failure instead of returning `null` (include reason in error context)
   - `createSessionCookie`: throw `ExternalError` instead of generic `Error` when cookie creation fails
   - `revokeSession`: throw `ExternalError` on revocation failure with context about which session failed
2. Update `src/lib/rate-limiter.ts`
   - `checkRateLimit`: throw `RateLimitError` when the rate limit is exceeded, with context including the limit, window, and identifier
   - On internal failure (e.g., store unavailable), keep fail-open behavior but log via structured logger instead of `console.error`
   - Include remaining attempts and reset time in the `RateLimitError` context when available

## Verification
- `getServerSession` throws `UnauthorizedError` with descriptive context on verification failure
- `createSessionCookie` throws `ExternalError` on failure
- `checkRateLimit` throws `RateLimitError` with limit metadata in context when rate is exceeded
- Rate limiter still fails open on internal errors (does not throw)
- `npm run build` succeeds

# Task 4: Tests — Logger & Sanitization

**Milestone**: M1 — Core Infrastructure
**Status**: not_started
**Estimated Hours**: 2
**Depends on**: Task 2

## Objective

Write unit tests for `createLogger`, `sanitizeToken`, `sanitizeEmail`, `sanitizeUserId`, `sanitizeObject`, and pre-configured loggers.

## Context

- Logger uses console.* internally — spy on console methods
- `sanitizeToken` uses crypto.createHash — deterministic output
- `sanitizeObject` recursively redacts sensitive fields
- Debug logging is gated on `NODE_ENV === 'development'`

## Steps

### Sanitization tests (`src/lib/logger.test.ts`)
1. `sanitizeToken`: returns hash prefix for valid token, `[empty]` for null/undefined
2. `sanitizeEmail`: returns masked email, `[empty]` for null, `[invalid]` for no domain
3. `sanitizeUserId`: returns `user_` prefix + first 8 chars, `[empty]` for null
4. `sanitizeObject`: redacts fields containing token/password/secret/key/authorization/credential
5. `sanitizeObject`: recursively handles nested objects
6. `sanitizeObject`: handles arrays
7. `sanitizeObject`: returns non-objects as-is

### Logger tests
1. `createLogger` returns logger with debug/info/warn/error methods
2. `info()` calls console.log with context prefix
3. `warn()` calls console.warn
4. `error()` calls console.error with error.message
5. `debug()` only logs when NODE_ENV=development
6. Logger sanitizes data before output
7. Pre-configured loggers (authLogger, apiLogger, etc.) have correct context names

## Verification

- [ ] All sanitization functions tested with valid and edge-case inputs
- [ ] Logger output verified via console spies
- [ ] NODE_ENV gating tested for debug
- [ ] Error logging includes error message and optional stack

# Task 15: Tests for error types and refactored guards
**Milestone**: M2 — Critical Pattern Compliance
**Status**: not_started
**Estimated Hours**: 1.5
**Depends on**: T13, T14

## Objective
Add comprehensive unit tests covering the new error type hierarchy, the `isAppError` type guard, and the updated throw behavior in auth guards and session/rate-limiter modules.

## Context
Tasks 12-14 introduce a typed error hierarchy and refactor several modules to throw instead of returning error responses or null. Tests must verify that the correct error types are thrown with the expected status codes and context, and that existing behavior (like `isAdmin` returning a boolean and rate limiter failing open) is preserved.

## Steps
1. Create `src/errors/base.error.test.ts`
   - Test `AppError` construction: verify `kind`, `message`, `statusCode`, `context` properties
   - Test that `AppError` instances are `instanceof Error`
   - Test that `name` is set correctly for stack traces
2. Create `src/errors/app-errors.test.ts`
   - Test each subclass (`ValidationError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`, `RateLimitError`, `ExternalError`, `InternalError`)
   - Verify each maps to the correct `kind` and `statusCode`
   - Verify optional `context` is stored and retrievable
3. Test `isAppError()` type guard
   - Returns `true` for all `AppError` subclasses
   - Returns `false` for plain `Error`, strings, null, undefined, and objects with similar shapes
4. Update `src/lib/auth/guards.test.ts`
   - `requireAuth` throws `UnauthorizedError` when session is missing
   - `requireAdmin` throws `UnauthorizedError` when unauthenticated
   - `requireAdmin` throws `ForbiddenError` when authenticated but not admin
   - `isAdmin` still returns boolean (no throws)
5. Update `src/lib/auth/session.test.ts`
   - `getServerSession` throws `UnauthorizedError` on verification failure
   - `createSessionCookie` throws `ExternalError` on failure
6. Update `src/lib/rate-limiter.test.ts`
   - `checkRateLimit` throws `RateLimitError` with context when limit exceeded
   - Verify fail-open behavior on internal errors (no throw, continues)

## Verification
- `npm test` passes all new and updated tests
- Coverage includes all error subclasses and the type guard
- No regressions in existing test suites
- `npm run build` succeeds

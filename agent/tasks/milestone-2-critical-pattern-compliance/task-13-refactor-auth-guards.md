# Task 13: Refactor auth guards to throw typed errors
**Milestone**: M2 — Critical Pattern Compliance
**Status**: not_started
**Estimated Hours**: 1.5
**Depends on**: T12

## Objective
Replace raw `Response(401)` and `Response(403)` returns in auth guards with typed `UnauthorizedError` and `ForbiddenError` throws, so that error handling is consistent and callers can catch and match on error kind.

## Context
Currently `requireAuth` and `requireAdmin` in `src/lib/auth/guards.ts` return HTTP Response objects directly on failure. This couples the guard logic to HTTP semantics and prevents reuse in non-HTTP contexts. By throwing typed errors, guards become transport-agnostic. A separate `handleAuthError` utility gives HTTP consumers a convenient Response conversion.

## Steps
1. Update `src/lib/auth/guards.ts`
   - `requireAuth`: throw `UnauthorizedError` instead of returning `Response(401)`
   - `requireAdmin`: throw `UnauthorizedError` for unauthenticated requests, `ForbiddenError` for authenticated-but-not-admin requests, instead of returning Response objects
   - `isAdmin`: no change (remains a boolean helper)
2. Create `src/lib/auth/error-handler.ts`
   - Export `handleAuthError(error: unknown): Response` utility
   - If error is `UnauthorizedError`, return `Response(401)` with JSON body
   - If error is `ForbiddenError`, return `Response(403)` with JSON body
   - If error is any other `AppError`, return Response with the error's statusCode
   - Otherwise return `Response(500)`
3. Update `src/lib/auth/index.ts`
   - Export `handleAuthError` from the barrel

## Verification
- `requireAuth` throws `UnauthorizedError` when no valid session exists
- `requireAdmin` throws `ForbiddenError` when user is authenticated but not admin
- `handleAuthError(new UnauthorizedError("no session"))` returns a Response with status 401
- `isAdmin` still returns a boolean without throwing
- `npm run build` succeeds

# Task 7: Tests — Auth (session, guards, helpers)

**Milestone**: M1 — Core Infrastructure
**Status**: not_started
**Estimated Hours**: 3
**Depends on**: Task 2

## Objective

Write unit tests for server-side auth: `session.ts`, `guards.ts`, `helpers.ts`.

## Context

- Session uses Firebase Admin `verifySessionCookie`/`verifyIdToken` — must mock
- Guards return `Response` objects (401/403) — Web API compatible
- Guards read `OWNER_EMAILS` env var for admin check
- Helpers are pure functions on AuthUser

## Steps

### helpers.test.ts
1. `isRealUser` — returns true for non-anonymous, false for anonymous/null/undefined
2. `isRealUserServer` — same behavior with AuthUser type

### session.test.ts
3. `getServerSession` — returns session for valid cookie
4. `getServerSession` — returns null for no cookie
5. `getServerSession` — falls back to verifyIdToken on cookie failure
6. `getServerSession` — maps anonymous provider correctly
7. `isAuthenticated` — returns boolean based on session
8. `createSessionCookie` — calls Firebase admin with correct params
9. `revokeSession` — logs revocation for valid session

### guards.test.ts
10. `requireAuth` — returns null (pass) for authenticated request
11. `requireAuth` — returns 401 Response for unauthenticated
12. `requireAdmin` — returns null for admin email
13. `requireAdmin` — returns 401 for unauthenticated
14. `requireAdmin` — returns 403 for non-admin authenticated user
15. `isAdmin` — returns boolean based on email match

## Verification

- [ ] All helper functions tested
- [ ] Session creation, verification, revocation tested
- [ ] Guard responses have correct status codes and JSON bodies
- [ ] Admin check works with comma-separated OWNER_EMAILS
- [ ] Anonymous user detection tested

# Task 40: Firebase Admin + Session Integration Tests

**Milestone**: M6 — E1 Integration Tests
**Status**: not_started
**Estimated Hours**: 3
**Dependencies**: Task 38, Task 39

---

## Objective

Write integration tests for the full server-side auth flow: Firebase Admin SDK initialization, ID token verification, session cookie creation, and `getServerSession()`.

## Context

This is the highest-value integration test — it exercises both client and admin SDKs together in a real auth flow. The admin SDK requires `agentbase-e1-service.json` service account credentials.

## Steps

- [ ] Create `src/lib/auth/session.integ.test.ts`
- [ ] Test `initFirebaseAdmin()` with e1 service account — should not throw
- [ ] Full auth flow test:
  1. `signInAnonymously()` via client SDK
  2. `getIdToken()` to get a real ID token
  3. `createSessionCookie(idToken)` via admin SDK — should return a cookie string
  4. Construct a `Request` with the session cookie in headers
  5. `getServerSession(request)` — should return a `ServerSession` with the anonymous user's uid
  6. `isAuthenticated(request)` — should return `true`
- [ ] Test `getServerSession()` with invalid/expired cookie — should return `null`
- [ ] Test `revokeSession()` flow
- [ ] Clean up: sign out client after each test

## Verification

- [ ] Full flow test passes end-to-end
- [ ] Session cookie is a valid string (not empty)
- [ ] `getServerSession` returns correct uid matching the anonymous user
- [ ] Tests skip when admin credentials missing
- [ ] No lingering Firebase app instances after tests

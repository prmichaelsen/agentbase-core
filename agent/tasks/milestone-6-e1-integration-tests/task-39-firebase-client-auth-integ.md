# Task 39: Firebase Client Auth Integration Tests

**Milestone**: M6 — E1 Integration Tests
**Status**: not_started
**Estimated Hours**: 2
**Dependencies**: Task 38

---

## Objective

Write integration tests that exercise Firebase client auth functions against the real agentbase-e1 Firebase project.

## Context

The Firebase client wrapper (`firebase-client.ts`) provides `initializeFirebase`, `signInAnonymously`, `getIdToken`, `signIn`, `signUp`, `logout`, etc. Unit tests mock Firebase — these tests verify the real thing works.

## Steps

- [ ] Create `src/lib/firebase-client.integ.test.ts`
- [ ] Test `initializeFirebase()` with e1 config — should not throw
- [ ] Test `signInAnonymously()` — should return a UserCredential with a uid
- [ ] Test `getIdToken()` after anonymous sign-in — should return a non-empty JWT string
- [ ] Test `logout()` — should succeed, `getCurrentUser()` returns null after
- [ ] Clean up: sign out after each test to avoid state leakage

## Verification

- [ ] All tests pass with valid `.env.e1.local`
- [ ] Tests skip when credentials missing
- [ ] No test user pollution (anonymous accounts are ephemeral)
- [ ] ID token returned is a valid JWT (3 dot-separated segments)

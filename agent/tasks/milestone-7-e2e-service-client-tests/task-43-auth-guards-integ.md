# Task 43: Auth Guards Integration Tests

**Milestone**: M7 — E2E Service Client Tests
**Status**: not_started
**Estimated Hours**: 1
**Dependencies**: M6 (integ infrastructure)

---

## Objective

Write integration tests for `requireAuth`, `requireAdmin`, and `isAdmin` using real Firebase session cookies against the e1 environment.

## Steps

- [ ] Create `src/lib/auth/guards.integ.test.ts`
- [ ] Reuse session setup pattern from `session.integ.test.ts` (sign up → ID token → session cookie → Request)
- [ ] Test `requireAuth` does not throw for authenticated request
- [ ] Test `requireAuth` throws `UnauthorizedError` for unauthenticated request
- [ ] Test `requireAdmin` with owner email (`michaelsenpatrick@gmail.com` from OWNER_EMAILS)
- [ ] Test `requireAdmin` throws `ForbiddenError` for non-admin user
- [ ] Test `isAdmin` returns true/false correctly
- [ ] Clean up test user after all tests

## Verification

- [ ] All tests pass with valid `.env.e1.local`
- [ ] Tests skip when credentials missing
- [ ] UnauthorizedError and ForbiddenError thrown with correct types

# Task 41: Config Loading Integration Tests

**Milestone**: M6 — E1 Integration Tests
**Status**: not_started
**Estimated Hours**: 1
**Dependencies**: Task 38

---

## Objective

Write integration tests verifying `loadConfig()` and `validateConfig()` work correctly against real `.env.e1.local` environment variables.

## Context

Config loading currently has unit tests with manual env objects. Integration tests verify the real env file parsing path and that all expected fields are populated.

## Steps

- [ ] Create `src/config/config.integ.test.ts`
- [ ] Test `loadConfig()` with e1 env loaded — should return a fully populated `AgentbaseConfig`
- [ ] Verify all Firebase client fields are non-empty (apiKey, authDomain, projectId, etc.)
- [ ] Verify Firebase admin fields are populated (serviceAccountKey path, projectId)
- [ ] Verify auth config (ownerEmails parsed correctly)
- [ ] Test `validateConfig(config, { requireFirebaseAdmin: true, requireFirebaseClient: true })` — should not throw
- [ ] Test `validateConfig()` with deliberately missing fields — should throw `ValidationError`

## Verification

- [ ] All tests pass with valid `.env.e1.local`
- [ ] Tests skip when env file missing
- [ ] Config fields match expected e1 values

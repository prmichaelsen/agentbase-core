# Task 45: AppClient Workflow Tests

**Milestone**: M7 — E2E Service Client Tests
**Status**: not_started
**Estimated Hours**: 2
**Dependencies**: Task 44

---

## Objective

Write integration tests for AppClient compound workflows against the live e1 API.

## Steps

- [ ] Create `src/client/app.integ.test.ts`
- [ ] Test `loginAndGetSession(idToken)` — full login flow returning session
- [ ] Test `getFullProfile(userId)` — profile + memory count for test user
- [ ] Test `startDm(userId)` — creates or finds existing DM (if second test user available)
- [ ] Test error handling — `loginAndGetSession` with invalid token returns error SdkResponse
- [ ] Clean up: delete test users/DMs created during tests

## Verification

- [ ] All tests pass against live e1 API
- [ ] Tests skip when credentials missing
- [ ] Compound operations complete without partial failures
- [ ] No persistent test data left on e1

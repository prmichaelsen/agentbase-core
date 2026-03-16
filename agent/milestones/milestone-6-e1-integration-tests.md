# Milestone 6: E1 Integration Tests

**ID**: M6
**Status**: not_started
**Started**: null
**Estimated Duration**: 1 week

---

## Goal

Add integration tests that run against the real agentbase-e1 Firebase environment using `.env.e1.local` credentials. These tests validate that the auth flow, Firebase wrappers, session management, and config loading work end-to-end against real infrastructure — not just mocks.

## Deliverables

- Separate vitest config for integration tests (`vitest.integration.config.ts`)
- Test helper that loads `.env.e1.local` and skips gracefully when credentials are missing
- Integration tests for Firebase client auth (anonymous sign-in, ID token retrieval)
- Integration tests for Firebase admin (init, token verification, session cookie creation)
- Integration tests for full auth flow (sign in → ID token → session cookie → getServerSession)
- Integration tests for config loading against real env vars
- npm script `test:integration` to run integration tests separately from unit tests

## Success Criteria

- All integration tests pass against agentbase-e1 when `.env.e1.local` is present
- All integration tests skip gracefully (not fail) when credentials are absent (CI, other devs)
- Unit test suite (`npm test`) is unaffected — integration tests run separately
- No secrets committed to git

## Tasks

- [Task 38: Integration test infrastructure](../tasks/milestone-6-e1-integration-tests/task-38-integration-test-infrastructure.md)
- [Task 39: Firebase client auth integration tests](../tasks/milestone-6-e1-integration-tests/task-39-firebase-client-auth-integ.md)
- [Task 40: Firebase admin + session integration tests](../tasks/milestone-6-e1-integration-tests/task-40-firebase-admin-session-integ.md)
- [Task 41: Config loading integration tests](../tasks/milestone-6-e1-integration-tests/task-41-config-loading-integ.md)
- [Task 42: Client SDK live API tests (future)](../tasks/milestone-6-e1-integration-tests/task-42-client-sdk-live-api.md)

## Dependencies

- M1 complete (core infrastructure, unit tests)
- `.env.e1.local` with valid Firebase credentials
- `agentbase-e1-service.json` service account key file

# Task 38: Integration Test Infrastructure

**Milestone**: M6 — E1 Integration Tests
**Status**: not_started
**Estimated Hours**: 2
**Dependencies**: None

---

## Objective

Set up the infrastructure for running integration tests against the e1 environment, separate from the unit test suite.

## Context

Unit tests use mocks and run in CI. Integration tests need real Firebase credentials from `.env.e1.local` and should skip gracefully when those credentials aren't available.

## Steps

- [ ] Create `vitest.integration.config.ts` that extends the base config but targets `**/*.integ.test.ts` files
- [ ] Add npm script `test:integration` that runs `vitest run --config vitest.integration.config.ts`
- [ ] Create `src/test-utils/integ-helpers.ts` with:
  - `loadE1Env()` — loads `.env.e1.local` using dotenv or manual parsing
  - `skipIfNoCredentials()` — checks for required env vars and calls `describe.skip` / returns early
  - `getE1Config()` — returns typed config from e1 env vars
- [ ] Ensure `.env.e1.local` and `*-service.json` are in `.gitignore` (already are)
- [ ] Add `dotenv` as a devDependency if not present

## Verification

- [ ] `npm run test:integration` runs without error (even if no tests yet)
- [ ] Helper functions export correctly
- [ ] Unit tests (`npm test`) do not pick up `*.integ.test.ts` files
- [ ] Running without `.env.e1.local` skips gracefully, not fails

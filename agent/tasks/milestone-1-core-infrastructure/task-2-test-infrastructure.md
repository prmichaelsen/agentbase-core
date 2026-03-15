# Task 2: Test Infrastructure Setup

**Milestone**: M1 — Core Infrastructure
**Status**: not_started
**Estimated Hours**: 2
**Depends on**: Task 1

## Objective

Set up test runner (vitest recommended for ESM), configure mocking strategy for Firebase peer deps, add test scripts to package.json.

## Context

- ESM-only project — needs a test runner with native ESM support
- Firebase Admin and Firebase Client are optional peer deps — tests must mock these
- jsonwebtoken is also an optional peer dep

## Steps

1. Install vitest as devDependency
2. Create `vitest.config.ts` with:
   - ESM module handling
   - Coverage configuration (v8 or istanbul)
   - Test file pattern: `src/**/*.test.ts`
3. Add scripts to package.json:
   - `"test": "vitest run"`
   - `"test:watch": "vitest"`
   - `"test:coverage": "vitest run --coverage"`
4. Create mock setup for Firebase modules:
   - `src/__mocks__/@prmichaelsen/firebase-admin-sdk-v8.ts`
   - `src/__mocks__/firebase/app.ts`
   - `src/__mocks__/firebase/auth.ts`
   - `src/__mocks__/jsonwebtoken.ts`
5. Create a minimal smoke test to verify the setup works
6. Run `npm test` to confirm infrastructure is working

## Verification

- [ ] vitest installed and configured
- [ ] `npm test` runs and passes (at least smoke test)
- [ ] Coverage reporting works
- [ ] Mock setup resolves for Firebase imports
- [ ] ESM imports work correctly in tests

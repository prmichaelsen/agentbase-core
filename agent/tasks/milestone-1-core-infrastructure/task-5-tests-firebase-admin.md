# Task 5: Tests — Firebase Admin Wrapper

**Milestone**: M1 — Core Infrastructure
**Status**: not_started
**Estimated Hours**: 1
**Depends on**: Task 2

## Objective

Write unit tests for `initFirebaseAdmin()`.

## Context

- Simple wrapper that calls `initializeApp` from `@prmichaelsen/firebase-admin-sdk-v8`
- Reads `FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY` and `FIREBASE_PROJECT_ID` from env
- Must mock the admin SDK

## Steps

1. Mock `@prmichaelsen/firebase-admin-sdk-v8` initializeApp
2. Set env vars in test setup
3. Test `initFirebaseAdmin()` calls initializeApp with correct config
4. Test env var mapping (serviceAccount, projectId)

## Verification

- [ ] initFirebaseAdmin calls underlying SDK with correct params
- [ ] Env vars correctly passed through

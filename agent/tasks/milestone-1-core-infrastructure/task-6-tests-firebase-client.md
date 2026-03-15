# Task 6: Tests — Firebase Client Wrapper

**Milestone**: M1 — Core Infrastructure
**Status**: not_started
**Estimated Hours**: 3
**Depends on**: Task 2

## Objective

Write unit tests for all Firebase client wrapper functions in `firebase-client.ts`.

## Context

- Singleton pattern (app/authInstance cached)
- 13 exported functions covering init, sign-in flows, anonymous upgrade, password reset, logout, auth state
- Must mock `firebase/app` and `firebase/auth` modules

## Steps

### Initialization tests
1. `initializeFirebase` — creates app on first call, returns existing on subsequent
2. `getFirebaseApp` — throws if not initialized
3. `getFirebaseAuth` — throws if not initialized

### Auth flow tests
4. `signIn` — delegates to signInWithEmailAndPassword
5. `signUp` — delegates to createUserWithEmailAndPassword
6. `signInAnonymously` — delegates to firebaseSignInAnonymously
7. `upgradeAnonymousAccount` — throws if no anonymous user, links credential
8. `upgradeAnonymousWithPopup` — throws if no anonymous user, links with popup
9. `resetPassword` — delegates to sendPasswordResetEmail
10. `logout` — delegates to signOut

### Session helpers
11. `onAuthChange` — registers callback via onAuthStateChanged
12. `getCurrentUser` — returns currentUser
13. `getIdToken` — returns token if user exists, null otherwise

## Verification

- [ ] All 13 functions tested
- [ ] Singleton initialization verified
- [ ] Error cases (not initialized, no anonymous user) tested
- [ ] Mock cleanup between tests to avoid singleton leakage

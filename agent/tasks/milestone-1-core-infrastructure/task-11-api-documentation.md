# Task 11: API Documentation / README

**Milestone**: M1 — Core Infrastructure
**Status**: not_started
**Estimated Hours**: 2
**Depends on**: Task 10

## Objective

Create a README.md documenting all public exports, installation, usage examples, and peer dependency requirements.

## Steps

1. Create README.md with sections:
   - Package description and purpose
   - Installation (`npm i @prmichaelsen/agentbase-core`)
   - Peer dependencies and which are optional
   - Quick start example
2. Document services:
   - `BaseService` — how to extend, config/logger injection, lifecycle hooks
   - `ConfirmationTokenService` — two-step confirmation flow example
3. Document auth:
   - Server-side: `getServerSession`, `requireAuth`, `requireAdmin`, `isAdmin`
   - Client-side: `signIn`, `signUp`, `signInAnonymously`, `upgradeAnonymousAccount`
   - Helpers: `isRealUser`, `isRealUserServer`
4. Document utilities:
   - Logger: `createLogger`, sanitization functions
   - Firebase: `initFirebaseAdmin`, `initializeFirebase`
   - Rate limiter: `checkRateLimit`, `createRateLimitResponse`
   - Misc: `formatExactTime`, `getRelativeTime`, `linkifyText`, `generateUUID`
5. Document export entry points:
   - `@prmichaelsen/agentbase-core` (everything)
   - `@prmichaelsen/agentbase-core/services`
   - `@prmichaelsen/agentbase-core/lib`
   - `@prmichaelsen/agentbase-core/lib/auth`
   - `@prmichaelsen/agentbase-core/types`

## Verification

- [ ] All public exports documented
- [ ] Installation instructions correct
- [ ] Usage examples compile
- [ ] Peer dependency requirements explained

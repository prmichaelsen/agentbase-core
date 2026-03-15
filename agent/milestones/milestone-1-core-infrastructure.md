# Milestone 1: Core Infrastructure

**ID**: M1
**Status**: in_progress
**Started**: 2026-03-15
**Estimated Duration**: 2 weeks
**Progress**: 80% (implementation done, testing & publish remaining)

---

## Goal

Deliver `@prmichaelsen/agentbase-core` as a published npm package with full test coverage and documentation. The package provides shared service infrastructure (BaseService, auth, Firebase wrappers, logging, utilities) consumed by all agentbase projects.

## Deliverables

- TypeScript library compiles cleanly with strict mode
- Full unit test suite with high coverage
- npm package published and consumable via `npm i @prmichaelsen/agentbase-core`
- README with API docs and usage examples
- Multiple export entry points working (`/services`, `/lib`, `/lib/auth`, `/types`)

## Current State

Implementation is ~80% complete. All source files exist:
- `src/services/` — BaseService (abstract), ConfirmationTokenService
- `src/lib/` — logger, firebase-admin, firebase-client, auth (session/guards/helpers), format-time, linkify, uuid, rate-limiter
- `src/types/` — AuthUser, ServerSession, AuthResult
- `src/index.ts` — barrel exports

**Remaining**: build verification, test suite, npm publish setup, API docs.

## Success Criteria

- [ ] `npm run build` succeeds with zero errors
- [ ] Test suite passes with >= 80% coverage
- [ ] `npm publish --dry-run` succeeds
- [ ] Package installable and importable in a consumer project
- [ ] README documents all public exports with examples

## Tasks

| Task | Name | Status | Est. Hours |
|------|------|--------|------------|
| T1 | Build verification | not_started | 1 |
| T2 | Test infrastructure setup | not_started | 2 |
| T3 | Tests: BaseService + ConfirmationTokenService | not_started | 2 |
| T4 | Tests: Logger & sanitization | not_started | 2 |
| T5 | Tests: Firebase Admin wrapper | not_started | 1 |
| T6 | Tests: Firebase Client wrapper | not_started | 3 |
| T7 | Tests: Auth (session, guards, helpers) | not_started | 3 |
| T8 | Tests: Utilities (format-time, linkify, uuid) | not_started | 2 |
| T9 | Tests: Rate limiter | not_started | 1.5 |
| T10 | npm publish setup & verification | not_started | 1.5 |
| T11 | API documentation / README | not_started | 2 |

**Total estimated**: ~21 hours

## Dependencies

- `@prmichaelsen/firebase-admin-sdk-v8` (peer dep, custom fork)
- `firebase` (peer dep)
- `jsonwebtoken` (peer dep)

## Notes

- ESM-only package (`"type": "module"`)
- Targets ES2022, Node16 module resolution
- Firebase wrappers need mocking in tests (peer deps are optional)
- Auth guards return `Response` objects (Web API compatible)

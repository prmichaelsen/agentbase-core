# Task 16: Define service interfaces
**Milestone**: M3 — High Pattern Compliance
**Status**: not_started
**Estimated Hours**: 1.5
**Depends on**: None

## Objective
Create TypeScript interfaces for ConfirmationTokenService and AuthService so that consumers can depend on abstractions rather than concrete implementations.

## Steps
1. Create `IConfirmationTokenService` interface in `src/services/confirmation-token.service.ts` matching the public API of the concrete class.
2. Create `IAuthService` interface wrapping server auth functions: `getServerSession`, `isAuthenticated`, `createSessionCookie`, `revokeSession`, `requireAuth`, `requireAdmin`, `isAdmin`.
3. Export both interfaces from `src/services/index.ts`.
4. Re-export from the package root so downstream consumers can import them directly.

## Verification
- `npx tsc --noEmit` passes with no errors.
- Interfaces are importable from the package root entry point.
- Concrete implementations satisfy their respective interfaces (verified by type assignment in a test or inline check).

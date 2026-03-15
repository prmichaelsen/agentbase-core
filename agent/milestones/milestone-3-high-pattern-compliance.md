# Milestone 3: High Pattern Compliance

**ID**: M3
**Status**: not_started
**Estimated Duration**: 1 week
**Priority**: High
**Depends on**: M2

## Goal

Define service interfaces for DI/testability and add state tracking to BaseService. Compliance improvement from ~80% to ~85%.

## Deliverables

- Explicit interfaces for all public services
- BaseService state tracking (uninitialized/initialized/shutdown)
- ensureInitialized() guard helper

## Tasks

| Task | Name | Est. Hours |
|------|------|------------|
| T16 | Define service interfaces (IConfirmationTokenService, IAuthService) | 1.5 |
| T17 | Add ServiceState enum and state tracking to BaseService | 1 |
| T18 | Tests for interfaces and state tracking | 1 |

**Total**: ~3.5 hours

## Success Criteria

- [ ] All public services have corresponding interfaces
- [ ] BaseService tracks state and prevents use before initialize()
- [ ] Tests verify state transitions and interface compliance

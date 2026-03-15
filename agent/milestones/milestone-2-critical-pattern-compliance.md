# Milestone 2: Critical Pattern Compliance

**ID**: M2
**Status**: not_started
**Estimated Duration**: 1 week
**Priority**: Critical

## Goal

Implement typed error hierarchy and refactor guards to decouple the service layer from HTTP transport. These are the highest-impact changes identified in audit-2 (pattern compliance score improvement from 65% to ~80%).

## Deliverables

- `src/errors/` module with AppError base class and typed subclasses
- Guards throw typed errors instead of returning Response objects
- All services use typed errors instead of generic Error/null
- Error-to-HTTP mapping utility for adapter/consumer layer

## Tasks

| Task | Name | Est. Hours |
|------|------|------------|
| T12 | Create error type hierarchy | 2 |
| T13 | Refactor auth guards to throw typed errors | 1.5 |
| T14 | Update session.ts and rate-limiter.ts error handling | 1 |
| T15 | Tests for error types and refactored guards | 1.5 |

**Total**: ~6 hours

## Success Criteria

- [ ] No `new Response(...)` in service layer code
- [ ] All error paths throw typed AppError subclasses
- [ ] Error-to-HTTP status mapping works correctly
- [ ] All existing tests still pass
- [ ] New error module has full test coverage

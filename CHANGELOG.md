# Changelog

## [0.5.0] - 2026-03-16

### Added
- Firestore collection helpers: all platform-level constants and user-scoped path functions extracted from agentbase.me
- New `./collections` export entry point: `import { USERS, getUserConversations } from '@prmichaelsen/agentbase-core/collections'`
- 26 platform-level collection constants (USERS, CREDENTIALS, MCP_SERVERS, etc.)
- 24 user-scoped path functions (getUserConversations, getUserSubscriptionCollection, etc.)
- Full unit test coverage for all collections exports

## [0.4.0] - 2026-03-16

### Added
- Generated DTO classes from OpenAPI spec via `npm run generate:dtos`
- 19 DTO classes with `class-validator` decorators (framework-agnostic — works with NestJS, Express, Hono, etc.)
- New `./dto` export entry point: `import { MemoryDto } from '@prmichaelsen/agentbase-core/dto'`
- `class-validator` and `class-transformer` as optional peer dependencies
- `scripts/generate-dtos.ts` code generator

## [0.3.0] - 2026-03-16

### Changed
- **BREAKING**: Remove `Logger` type — use `LoggerBackend` instead (same shape, single source of truth from `logger.ts`)
- `BaseService` now imports `LoggerBackend` from `logger.ts` instead of defining its own duplicate interface

### Migration
- Replace `import type { Logger } from '@prmichaelsen/agentbase-core'` with `import type { LoggerBackend } from '@prmichaelsen/agentbase-core'`

## [0.2.0] - 2026-03-16

### Added
- Pluggable logger backend via `setLoggerBackend()` — consumers can inject pino, winston, or any custom logger
- `LoggerBackend` and `LoggerBackendFactory` type exports
- 6 new tests for backend injection, sanitization passthrough, and reset behavior

### Changed
- Logger resolves backend lazily per call — `setLoggerBackend()` takes effect immediately for all loggers including pre-configured `authLogger`, `apiLogger`, etc.

## [0.1.2] - 2026-03-15

- Initial publish — BaseService, auth, Firebase wrappers, logger, utilities, error types, Result type, branded primitives, client SDK, config validation

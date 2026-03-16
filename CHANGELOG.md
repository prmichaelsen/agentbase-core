# Changelog

## [0.2.0] - 2026-03-16

### Added
- Pluggable logger backend via `setLoggerBackend()` — consumers can inject pino, winston, or any custom logger
- `LoggerBackend` and `LoggerBackendFactory` type exports
- 6 new tests for backend injection, sanitization passthrough, and reset behavior

### Changed
- Logger resolves backend lazily per call — `setLoggerBackend()` takes effect immediately for all loggers including pre-configured `authLogger`, `apiLogger`, etc.

## [0.1.2] - 2026-03-15

- Initial publish — BaseService, auth, Firebase wrappers, logger, utilities, error types, Result type, branded primitives, client SDK, config validation

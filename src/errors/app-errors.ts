import { AppError, type ErrorKind } from './base.error.js'

export class ValidationError extends AppError {
  readonly kind: ErrorKind = 'VALIDATION'
  readonly statusCode = 400
}

export class NotFoundError extends AppError {
  readonly kind: ErrorKind = 'NOT_FOUND'
  readonly statusCode = 404
}

export class UnauthorizedError extends AppError {
  readonly kind: ErrorKind = 'UNAUTHORIZED'
  readonly statusCode = 401
}

export class ForbiddenError extends AppError {
  readonly kind: ErrorKind = 'FORBIDDEN'
  readonly statusCode = 403
}

export class ConflictError extends AppError {
  readonly kind: ErrorKind = 'CONFLICT'
  readonly statusCode = 409
}

export class RateLimitError extends AppError {
  readonly kind: ErrorKind = 'RATE_LIMIT'
  readonly statusCode = 429
}

export class ExternalError extends AppError {
  readonly kind: ErrorKind = 'EXTERNAL'
  readonly statusCode = 502
}

export class InternalError extends AppError {
  readonly kind: ErrorKind = 'INTERNAL'
  readonly statusCode = 500
}

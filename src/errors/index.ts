export { AppError, type ErrorKind } from './base.error.js'
export {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  ExternalError,
  InternalError,
} from './app-errors.js'

import { AppError } from './base.error.js'

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError
}

export function errorToStatusCode(err: unknown): number {
  if (err instanceof AppError) return err.statusCode
  return 500
}

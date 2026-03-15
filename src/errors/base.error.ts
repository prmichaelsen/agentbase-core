export type ErrorKind =
  | 'VALIDATION'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'RATE_LIMIT'
  | 'EXTERNAL'
  | 'INTERNAL'

export abstract class AppError extends Error {
  abstract readonly kind: ErrorKind
  abstract readonly statusCode: number
  readonly context?: Record<string, unknown>

  constructor(message: string, context?: Record<string, unknown>) {
    super(message)
    this.name = this.constructor.name
    this.context = context
  }
}

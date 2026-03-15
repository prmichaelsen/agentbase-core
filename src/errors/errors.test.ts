import { describe, it, expect } from 'vitest'
import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  ExternalError,
  InternalError,
  isAppError,
  errorToStatusCode,
} from './index.js'

describe('AppError subclasses', () => {
  const cases: [string, new (msg: string, ctx?: Record<string, unknown>) => AppError, string, number][] = [
    ['ValidationError', ValidationError, 'VALIDATION', 400],
    ['NotFoundError', NotFoundError, 'NOT_FOUND', 404],
    ['UnauthorizedError', UnauthorizedError, 'UNAUTHORIZED', 401],
    ['ForbiddenError', ForbiddenError, 'FORBIDDEN', 403],
    ['ConflictError', ConflictError, 'CONFLICT', 409],
    ['RateLimitError', RateLimitError, 'RATE_LIMIT', 429],
    ['ExternalError', ExternalError, 'EXTERNAL', 502],
    ['InternalError', InternalError, 'INTERNAL', 500],
  ]

  for (const [name, ErrorClass, expectedKind, expectedStatus] of cases) {
    describe(name, () => {
      it(`has kind "${expectedKind}"`, () => {
        const err = new ErrorClass('test')
        expect(err.kind).toBe(expectedKind)
      })

      it(`has statusCode ${expectedStatus}`, () => {
        const err = new ErrorClass('test')
        expect(err.statusCode).toBe(expectedStatus)
      })

      it('extends AppError', () => {
        const err = new ErrorClass('test')
        expect(err).toBeInstanceOf(AppError)
        expect(err).toBeInstanceOf(Error)
      })

      it('stores message', () => {
        const err = new ErrorClass('something went wrong')
        expect(err.message).toBe('something went wrong')
      })

      it('sets name to class name', () => {
        const err = new ErrorClass('test')
        expect(err.name).toBe(name)
      })

      it('accepts optional context', () => {
        const err = new ErrorClass('test', { userId: 'abc' })
        expect(err.context).toEqual({ userId: 'abc' })
      })
    })
  }
})

describe('isAppError', () => {
  it('returns true for AppError instances', () => {
    expect(isAppError(new ValidationError('bad'))).toBe(true)
    expect(isAppError(new UnauthorizedError('no'))).toBe(true)
    expect(isAppError(new InternalError('fail'))).toBe(true)
  })

  it('returns false for generic Error', () => {
    expect(isAppError(new Error('generic'))).toBe(false)
  })

  it('returns false for non-errors', () => {
    expect(isAppError('string')).toBe(false)
    expect(isAppError(null)).toBe(false)
    expect(isAppError(undefined)).toBe(false)
    expect(isAppError(42)).toBe(false)
  })
})

describe('errorToStatusCode', () => {
  it('returns statusCode for AppError', () => {
    expect(errorToStatusCode(new ValidationError('bad'))).toBe(400)
    expect(errorToStatusCode(new NotFoundError('missing'))).toBe(404)
    expect(errorToStatusCode(new RateLimitError('slow down'))).toBe(429)
  })

  it('returns 500 for generic Error', () => {
    expect(errorToStatusCode(new Error('generic'))).toBe(500)
  })

  it('returns 500 for non-errors', () => {
    expect(errorToStatusCode('string')).toBe(500)
    expect(errorToStatusCode(null)).toBe(500)
  })
})

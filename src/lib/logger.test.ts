import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  sanitizeToken,
  sanitizeEmail,
  sanitizeUserId,
  sanitizeObject,
  createLogger,
  authLogger,
  apiLogger,
  dbLogger,
  chatLogger,
} from './logger.js'

describe('sanitizeToken', () => {
  it('returns hash prefix for valid token', () => {
    const result = sanitizeToken('my-secret-token')
    expect(result).toMatch(/^[0-9a-f]{8}\.\.\.$/)
  })

  it('returns [empty] for null', () => {
    expect(sanitizeToken(null)).toBe('[empty]')
  })

  it('returns [empty] for undefined', () => {
    expect(sanitizeToken(undefined)).toBe('[empty]')
  })

  it('returns [empty] for empty string', () => {
    expect(sanitizeToken('')).toBe('[empty]')
  })

  it('is deterministic for same input', () => {
    expect(sanitizeToken('abc')).toBe(sanitizeToken('abc'))
  })
})

describe('sanitizeEmail', () => {
  it('masks email correctly', () => {
    expect(sanitizeEmail('john@example.com')).toBe('jo***@example.com')
  })

  it('returns [empty] for null', () => {
    expect(sanitizeEmail(null)).toBe('[empty]')
  })

  it('returns [empty] for undefined', () => {
    expect(sanitizeEmail(undefined)).toBe('[empty]')
  })

  it('returns [invalid] for no domain', () => {
    expect(sanitizeEmail('nodomain')).toBe('[invalid]')
  })
})

describe('sanitizeUserId', () => {
  it('returns user_ prefix with first 8 chars', () => {
    expect(sanitizeUserId('abcdefghijklmnop')).toBe('user_abcdefgh')
  })

  it('returns [empty] for null', () => {
    expect(sanitizeUserId(null)).toBe('[empty]')
  })

  it('handles short user IDs', () => {
    expect(sanitizeUserId('ab')).toBe('user_ab')
  })
})

describe('sanitizeObject', () => {
  it('redacts fields containing token', () => {
    expect(sanitizeObject({ accessToken: 'secret' })).toEqual({ accessToken: '[REDACTED]' })
  })

  it('redacts fields containing password', () => {
    expect(sanitizeObject({ password: '123' })).toEqual({ password: '[REDACTED]' })
  })

  it('redacts fields containing secret', () => {
    expect(sanitizeObject({ clientSecret: 'abc' })).toEqual({ clientSecret: '[REDACTED]' })
  })

  it('redacts fields containing key', () => {
    expect(sanitizeObject({ apiKey: 'xyz' })).toEqual({ apiKey: '[REDACTED]' })
  })

  it('redacts fields containing authorization', () => {
    expect(sanitizeObject({ authorization: 'Bearer xxx' })).toEqual({ authorization: '[REDACTED]' })
  })

  it('redacts fields containing credential', () => {
    expect(sanitizeObject({ credential: 'cred' })).toEqual({ credential: '[REDACTED]' })
  })

  it('recursively sanitizes nested objects', () => {
    const input = { user: { name: 'John', password: 'secret' } }
    expect(sanitizeObject(input)).toEqual({ user: { name: 'John', password: '[REDACTED]' } })
  })

  it('handles arrays', () => {
    const input = [{ token: 'abc' }, { name: 'ok' }]
    expect(sanitizeObject(input)).toEqual([{ token: '[REDACTED]' }, { name: 'ok' }])
  })

  it('returns non-objects as-is', () => {
    expect(sanitizeObject('hello')).toBe('hello')
    expect(sanitizeObject(42)).toBe(42)
    expect(sanitizeObject(null)).toBeNull()
  })

  it('leaves safe fields untouched', () => {
    expect(sanitizeObject({ name: 'John', age: 30 })).toEqual({ name: 'John', age: 30 })
  })
})

describe('createLogger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'debug').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns logger with debug/info/warn/error methods', () => {
    const logger = createLogger('Test')
    expect(typeof logger.debug).toBe('function')
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.error).toBe('function')
  })

  it('info calls console.log with context prefix', () => {
    const logger = createLogger('MyCtx')
    logger.info('hello')
    expect(console.log).toHaveBeenCalledWith('[MyCtx]', 'hello', '')
  })

  it('warn calls console.warn', () => {
    const logger = createLogger('W')
    logger.warn('warning')
    expect(console.warn).toHaveBeenCalledWith('[W]', 'warning', '')
  })

  it('error calls console.error with error message', () => {
    const logger = createLogger('E')
    const err = new Error('boom')
    logger.error('failed', err)
    expect(console.error).toHaveBeenCalled()
    const call = (console.error as any).mock.calls[0]
    expect(call[0]).toBe('[E]')
    expect(call[1]).toBe('failed')
  })

  it('debug does not log when NODE_ENV is not development', () => {
    const original = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    const logger = createLogger('D')
    logger.debug('test')
    expect(console.debug).not.toHaveBeenCalled()
    process.env.NODE_ENV = original
  })

  it('debug logs when NODE_ENV is development', () => {
    const original = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const logger = createLogger('D')
    logger.debug('test')
    expect(console.debug).toHaveBeenCalled()
    process.env.NODE_ENV = original
  })

  it('sanitizes data before output', () => {
    const logger = createLogger('S')
    logger.info('data', { password: 'secret', name: 'ok' })
    const call = (console.log as any).mock.calls[0]
    expect(call[2]).toEqual({ password: '[REDACTED]', name: 'ok' })
  })
})

describe('pre-configured loggers', () => {
  it('authLogger has Auth context', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    authLogger.info('test')
    expect(console.log).toHaveBeenCalledWith('[Auth]', 'test', '')
    vi.restoreAllMocks()
  })

  it('apiLogger has API context', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    apiLogger.info('test')
    expect(console.log).toHaveBeenCalledWith('[API]', 'test', '')
    vi.restoreAllMocks()
  })

  it('dbLogger has Database context', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    dbLogger.info('test')
    expect(console.log).toHaveBeenCalledWith('[Database]', 'test', '')
    vi.restoreAllMocks()
  })

  it('chatLogger has Chat context', () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    chatLogger.info('test')
    expect(console.log).toHaveBeenCalledWith('[Chat]', 'test', '')
    vi.restoreAllMocks()
  })
})

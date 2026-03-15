import { describe, it, expect } from 'vitest'
import {
  ok, err, isOk, isErr,
  mapOk, mapErr, andThen, getOrElse,
  tryCatch, tryCatchAsync,
} from './result.js'

describe('ok / err constructors', () => {
  it('ok creates success result', () => {
    const r = ok(42)
    expect(r.success).toBe(true)
    expect(r.value).toBe(42)
  })

  it('err creates failure result', () => {
    const r = err('bad')
    expect(r.success).toBe(false)
    expect(r.error).toBe('bad')
  })
})

describe('isOk / isErr guards', () => {
  it('isOk returns true for Ok', () => {
    expect(isOk(ok(1))).toBe(true)
  })

  it('isOk returns false for Err', () => {
    expect(isOk(err('x'))).toBe(false)
  })

  it('isErr returns true for Err', () => {
    expect(isErr(err('x'))).toBe(true)
  })

  it('isErr returns false for Ok', () => {
    expect(isErr(ok(1))).toBe(false)
  })
})

describe('mapOk', () => {
  it('transforms Ok value', () => {
    const r = mapOk(ok(2), (x) => x * 3)
    expect(isOk(r) && r.value).toBe(6)
  })

  it('passes Err through', () => {
    const r = mapOk(err('fail'), (x: number) => x * 3)
    expect(isErr(r) && r.error).toBe('fail')
  })
})

describe('mapErr', () => {
  it('transforms Err value', () => {
    const r = mapErr(err('bad'), (e) => `wrapped: ${e}`)
    expect(isErr(r) && r.error).toBe('wrapped: bad')
  })

  it('passes Ok through', () => {
    const r = mapErr(ok(42), (e: string) => `wrapped: ${e}`)
    expect(isOk(r) && r.value).toBe(42)
  })
})

describe('andThen', () => {
  it('chains Ok results', () => {
    const r = andThen(ok(2), (x) => ok(x + 10))
    expect(isOk(r) && r.value).toBe(12)
  })

  it('short-circuits on Err', () => {
    const r = andThen(err('stop'), (x: number) => ok(x + 10))
    expect(isErr(r) && r.error).toBe('stop')
  })

  it('can produce Err from Ok', () => {
    const r = andThen(ok(0), (x) => x === 0 ? err('zero') : ok(x))
    expect(isErr(r) && r.error).toBe('zero')
  })
})

describe('getOrElse', () => {
  it('returns value for Ok', () => {
    expect(getOrElse(ok(42), 0)).toBe(42)
  })

  it('returns default for Err', () => {
    expect(getOrElse(err('fail'), 0)).toBe(0)
  })
})

describe('tryCatch', () => {
  it('returns Ok for successful function', () => {
    const r = tryCatch(() => 42, (e) => String(e))
    expect(isOk(r) && r.value).toBe(42)
  })

  it('returns Err for throwing function', () => {
    const r = tryCatch(() => { throw new Error('boom') }, (e) => (e as Error).message)
    expect(isErr(r) && r.error).toBe('boom')
  })
})

describe('tryCatchAsync', () => {
  it('returns Ok for resolved promise', async () => {
    const r = await tryCatchAsync(async () => 42, (e) => String(e))
    expect(isOk(r) && r.value).toBe(42)
  })

  it('returns Err for rejected promise', async () => {
    const r = await tryCatchAsync(async () => { throw new Error('boom') }, (e) => (e as Error).message)
    expect(isErr(r) && r.error).toBe('boom')
  })
})

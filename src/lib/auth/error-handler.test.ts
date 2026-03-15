import { describe, it, expect } from 'vitest'
import { handleAuthError } from './error-handler.js'
import { UnauthorizedError, ForbiddenError } from '../../errors/index.js'

describe('handleAuthError', () => {
  it('returns 401 for UnauthorizedError', async () => {
    const res = handleAuthError(new UnauthorizedError('no session'))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('no session')
  })

  it('returns 403 for ForbiddenError', async () => {
    const res = handleAuthError(new ForbiddenError('admin only'))
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toBe('admin only')
  })

  it('returns 500 for generic Error', async () => {
    const res = handleAuthError(new Error('boom'))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Internal server error')
  })

  it('returns 500 for non-Error values', async () => {
    const res = handleAuthError('string error')
    expect(res.status).toBe(500)
  })
})

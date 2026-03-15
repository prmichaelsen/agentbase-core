import { describe, it, expect } from 'vitest'
import { generateUUID } from './uuid.js'

describe('generateUUID', () => {
  it('returns valid UUID v4 format', () => {
    const uuid = generateUUID()
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('version nibble is 4', () => {
    const uuid = generateUUID()
    expect(uuid[14]).toBe('4')
  })

  it('variant bits are correct (8, 9, a, or b)', () => {
    const uuid = generateUUID()
    expect(['8', '9', 'a', 'b']).toContain(uuid[19])
  })

  it('two calls return different values', () => {
    const a = generateUUID()
    const b = generateUUID()
    expect(a).not.toBe(b)
  })
})

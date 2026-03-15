import { describe, it, expect, vi } from 'vitest'
import { BaseService, type Logger } from './base.service.js'

class TestService extends BaseService<{ port: number }> {
  constructor(config: { port: number }, logger: Logger) {
    super(config, logger)
  }
}

class CustomLifecycleService extends BaseService<{ name: string }> {
  public initialized = false
  public shutDown = false

  constructor(config: { name: string }, logger: Logger) {
    super(config, logger)
  }

  async initialize(): Promise<void> {
    this.initialized = true
  }

  async shutdown(): Promise<void> {
    this.shutDown = true
  }
}

function mockLogger(): Logger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }
}

describe('BaseService', () => {
  it('sets name from constructor', () => {
    const svc = new TestService({ port: 3000 }, mockLogger())
    expect(svc['name']).toBe('TestService')
  })

  it('stores config and logger', () => {
    const logger = mockLogger()
    const config = { port: 8080 }
    const svc = new TestService(config, logger)
    expect(svc['config']).toBe(config)
    expect(svc['logger']).toBe(logger)
  })

  it('initialize() is callable and no-op by default', async () => {
    const svc = new TestService({ port: 3000 }, mockLogger())
    await expect(svc.initialize()).resolves.toBeUndefined()
  })

  it('shutdown() is callable and no-op by default', async () => {
    const svc = new TestService({ port: 3000 }, mockLogger())
    await expect(svc.shutdown()).resolves.toBeUndefined()
  })

  it('overridden initialize() is called', async () => {
    const svc = new CustomLifecycleService({ name: 'test' }, mockLogger())
    expect(svc.initialized).toBe(false)
    await svc.initialize()
    expect(svc.initialized).toBe(true)
  })

  it('overridden shutdown() is called', async () => {
    const svc = new CustomLifecycleService({ name: 'test' }, mockLogger())
    expect(svc.shutDown).toBe(false)
    await svc.shutdown()
    expect(svc.shutDown).toBe(true)
  })
})

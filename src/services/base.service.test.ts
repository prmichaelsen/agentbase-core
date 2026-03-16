import { describe, it, expect, vi } from 'vitest'
import { BaseService, ServiceState, type LoggerBackend } from './base.service.js'

class TestService extends BaseService<{ port: number }> {
  constructor(config: { port: number }, logger: LoggerBackend) {
    super(config, logger)
  }

  // Expose ensureInitialized for testing
  public checkInitialized() {
    this.ensureInitialized()
  }
}

class CustomLifecycleService extends BaseService<{ name: string }> {
  public initialized = false
  public shutDown = false

  constructor(config: { name: string }, logger: LoggerBackend) {
    super(config, logger)
  }

  async initialize(): Promise<void> {
    await super.initialize()
    this.initialized = true
  }

  async shutdown(): Promise<void> {
    await super.shutdown()
    this.shutDown = true
  }
}

function mockLoggerBackend(): LoggerBackend {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }
}

describe('BaseService', () => {
  it('sets name from constructor', () => {
    const svc = new TestService({ port: 3000 }, mockLoggerBackend())
    expect(svc['name']).toBe('TestService')
  })

  it('stores config and logger', () => {
    const logger = mockLoggerBackend()
    const config = { port: 8080 }
    const svc = new TestService(config, logger)
    expect(svc['config']).toBe(config)
    expect(svc['logger']).toBe(logger)
  })

  it('initialize() is callable', async () => {
    const svc = new TestService({ port: 3000 }, mockLoggerBackend())
    await expect(svc.initialize()).resolves.toBeUndefined()
  })

  it('shutdown() is callable', async () => {
    const svc = new TestService({ port: 3000 }, mockLoggerBackend())
    await expect(svc.shutdown()).resolves.toBeUndefined()
  })

  it('overridden initialize() is called', async () => {
    const svc = new CustomLifecycleService({ name: 'test' }, mockLoggerBackend())
    expect(svc.initialized).toBe(false)
    await svc.initialize()
    expect(svc.initialized).toBe(true)
  })

  it('overridden shutdown() is called', async () => {
    const svc = new CustomLifecycleService({ name: 'test' }, mockLoggerBackend())
    await svc.initialize()
    expect(svc.shutDown).toBe(false)
    await svc.shutdown()
    expect(svc.shutDown).toBe(true)
  })
})

describe('ServiceState', () => {
  it('starts as Uninitialized', () => {
    const svc = new TestService({ port: 3000 }, mockLoggerBackend())
    expect(svc.getState()).toBe(ServiceState.Uninitialized)
  })

  it('transitions to Initialized after initialize()', async () => {
    const svc = new TestService({ port: 3000 }, mockLoggerBackend())
    await svc.initialize()
    expect(svc.getState()).toBe(ServiceState.Initialized)
  })

  it('transitions to ShutDown after shutdown()', async () => {
    const svc = new TestService({ port: 3000 }, mockLoggerBackend())
    await svc.initialize()
    await svc.shutdown()
    expect(svc.getState()).toBe(ServiceState.ShutDown)
  })

  it('custom lifecycle sets state correctly', async () => {
    const svc = new CustomLifecycleService({ name: 'test' }, mockLoggerBackend())
    expect(svc.getState()).toBe(ServiceState.Uninitialized)
    await svc.initialize()
    expect(svc.getState()).toBe(ServiceState.Initialized)
    await svc.shutdown()
    expect(svc.getState()).toBe(ServiceState.ShutDown)
  })
})

describe('ensureInitialized', () => {
  it('throws when not initialized', () => {
    const svc = new TestService({ port: 3000 }, mockLoggerBackend())
    expect(() => svc.checkInitialized()).toThrow('TestService is not initialized')
  })

  it('does not throw when initialized', async () => {
    const svc = new TestService({ port: 3000 }, mockLoggerBackend())
    await svc.initialize()
    expect(() => svc.checkInitialized()).not.toThrow()
  })

  it('throws after shutdown', async () => {
    const svc = new TestService({ port: 3000 }, mockLoggerBackend())
    await svc.initialize()
    await svc.shutdown()
    expect(() => svc.checkInitialized()).toThrow('TestService is not initialized')
  })
})

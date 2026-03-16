import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockInitializeApp = vi.fn()
const mockReadFileSync = vi.fn()

vi.mock('@prmichaelsen/firebase-admin-sdk-v8', () => ({
  initializeApp: mockInitializeApp,
}))

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>()
  return { ...actual, readFileSync: (...args: any[]) => mockReadFileSync(...args) }
})

describe('initFirebaseAdmin', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY = '{"type":"service_account"}'
    process.env.FIREBASE_PROJECT_ID = 'test-project'
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    vi.resetModules()
  })

  it('calls initializeApp with JSON value directly', async () => {
    const { initFirebaseAdmin } = await import('./firebase-admin.js')
    initFirebaseAdmin()
    expect(mockInitializeApp).toHaveBeenCalledWith({
      serviceAccount: '{"type":"service_account"}',
      projectId: 'test-project',
    })
    expect(mockReadFileSync).not.toHaveBeenCalled()
  })

  it('passes undefined when env vars not set', async () => {
    delete process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY
    delete process.env.FIREBASE_PROJECT_ID
    const { initFirebaseAdmin } = await import('./firebase-admin.js')
    initFirebaseAdmin()
    expect(mockInitializeApp).toHaveBeenCalledWith({
      serviceAccount: undefined,
      projectId: undefined,
    })
  })

  it('reads file when value is not valid JSON', async () => {
    mockReadFileSync.mockReturnValue('{"type":"from-file"}')
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY = './some-service-account.json'

    const { initFirebaseAdmin } = await import('./firebase-admin.js')
    initFirebaseAdmin()

    expect(mockReadFileSync).toHaveBeenCalled()
    expect(mockInitializeApp).toHaveBeenCalledWith({
      serviceAccount: '{"type":"from-file"}',
      projectId: 'test-project',
    })
  })

  it('throws when value is not JSON and file does not exist', async () => {
    mockReadFileSync.mockImplementation(() => { throw new Error('ENOENT') })
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY = './nonexistent.json'

    const { initFirebaseAdmin } = await import('./firebase-admin.js')
    expect(() => initFirebaseAdmin()).toThrow('not valid JSON and could not be read as a file path')
  })
})

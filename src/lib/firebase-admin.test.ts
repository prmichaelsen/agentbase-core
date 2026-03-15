import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockInitializeApp = vi.fn()

vi.mock('@prmichaelsen/firebase-admin-sdk-v8', () => ({
  initializeApp: mockInitializeApp,
}))

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

  it('calls initializeApp with correct config from env vars', async () => {
    const { initFirebaseAdmin } = await import('./firebase-admin.js')
    initFirebaseAdmin()
    expect(mockInitializeApp).toHaveBeenCalledWith({
      serviceAccount: '{"type":"service_account"}',
      projectId: 'test-project',
    })
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
})

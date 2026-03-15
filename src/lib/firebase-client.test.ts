import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetApps = vi.fn(() => [])
const mockGetApp = vi.fn()
const mockInitializeApp = vi.fn(() => ({ name: 'test-app' }))
const mockGetAuth = vi.fn(() => mockAuthInstance)
const mockSignInWithEmailAndPassword = vi.fn()
const mockCreateUserWithEmailAndPassword = vi.fn()
const mockFirebaseSignInAnonymously = vi.fn()
const mockLinkWithCredential = vi.fn()
const mockLinkWithPopup = vi.fn()
const mockSendPasswordResetEmail = vi.fn()
const mockSignOut = vi.fn()
const mockOnAuthStateChanged = vi.fn(() => vi.fn()) // returns unsubscribe

const mockAuthInstance = {
  currentUser: null as any,
}

vi.mock('firebase/app', () => ({
  initializeApp: mockInitializeApp,
  getApps: mockGetApps,
  getApp: mockGetApp,
}))

vi.mock('firebase/auth', () => ({
  getAuth: mockGetAuth,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInAnonymously: mockFirebaseSignInAnonymously,
  linkWithCredential: mockLinkWithCredential,
  linkWithPopup: mockLinkWithPopup,
  EmailAuthProvider: { credential: vi.fn(() => 'mock-credential') },
  sendPasswordResetEmail: mockSendPasswordResetEmail,
  signOut: mockSignOut,
  onAuthStateChanged: mockOnAuthStateChanged,
}))

// Must dynamic import to allow mocks to take effect
async function freshImport() {
  vi.resetModules()
  return import('./firebase-client.js')
}

describe('firebase-client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetApps.mockReturnValue([])
    mockAuthInstance.currentUser = null
  })

  describe('initializeFirebase', () => {
    it('creates app on first call', async () => {
      const mod = await freshImport()
      mod.initializeFirebase({ apiKey: 'test' })
      expect(mockInitializeApp).toHaveBeenCalled()
    })

    it('returns existing app if already initialized', async () => {
      mockGetApps.mockReturnValue([{ name: 'existing' }])
      const mod = await freshImport()
      mod.initializeFirebase({ apiKey: 'test' })
      expect(mockGetApp).toHaveBeenCalled()
    })
  })

  describe('getFirebaseApp', () => {
    it('throws if not initialized', async () => {
      const mod = await freshImport()
      expect(() => mod.getFirebaseApp()).toThrow('Firebase not initialized')
    })

    it('returns app after init', async () => {
      const mod = await freshImport()
      mod.initializeFirebase({ apiKey: 'test' })
      expect(mod.getFirebaseApp()).toBeDefined()
    })
  })

  describe('getFirebaseAuth', () => {
    it('throws if not initialized', async () => {
      const mod = await freshImport()
      expect(() => mod.getFirebaseAuth()).toThrow('Firebase not initialized')
    })

    it('returns auth after init', async () => {
      const mod = await freshImport()
      mod.initializeFirebase({ apiKey: 'test' })
      expect(mod.getFirebaseAuth()).toBeDefined()
    })
  })

  describe('auth flows', () => {
    async function initModule() {
      const mod = await freshImport()
      mod.initializeFirebase({ apiKey: 'test' })
      return mod
    }

    it('signIn delegates to signInWithEmailAndPassword', async () => {
      const mod = await initModule()
      await mod.signIn('a@b.com', 'pass')
      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), 'a@b.com', 'pass'
      )
    })

    it('signUp delegates to createUserWithEmailAndPassword', async () => {
      const mod = await initModule()
      await mod.signUp('a@b.com', 'pass')
      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(), 'a@b.com', 'pass'
      )
    })

    it('signInAnonymously delegates correctly', async () => {
      const mod = await initModule()
      await mod.signInAnonymously()
      expect(mockFirebaseSignInAnonymously).toHaveBeenCalled()
    })

    it('upgradeAnonymousAccount throws if no anonymous user', async () => {
      const mod = await initModule()
      mockAuthInstance.currentUser = null
      await expect(mod.upgradeAnonymousAccount('a@b.com', 'pass')).rejects.toThrow('No anonymous user')
    })

    it('upgradeAnonymousAccount links credential for anonymous user', async () => {
      const mod = await initModule()
      mockAuthInstance.currentUser = { isAnonymous: true }
      await mod.upgradeAnonymousAccount('a@b.com', 'pass')
      expect(mockLinkWithCredential).toHaveBeenCalled()
    })

    it('upgradeAnonymousWithPopup throws if no anonymous user', async () => {
      const mod = await initModule()
      mockAuthInstance.currentUser = null
      await expect(mod.upgradeAnonymousWithPopup({} as any)).rejects.toThrow('No anonymous user')
    })

    it('upgradeAnonymousWithPopup links with popup for anonymous user', async () => {
      const mod = await initModule()
      mockAuthInstance.currentUser = { isAnonymous: true }
      const provider = {} as any
      await mod.upgradeAnonymousWithPopup(provider)
      expect(mockLinkWithPopup).toHaveBeenCalledWith(expect.anything(), provider)
    })

    it('resetPassword delegates to sendPasswordResetEmail', async () => {
      const mod = await initModule()
      await mod.resetPassword('a@b.com')
      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'a@b.com')
    })

    it('logout delegates to signOut', async () => {
      const mod = await initModule()
      await mod.logout()
      expect(mockSignOut).toHaveBeenCalled()
    })
  })

  describe('session helpers', () => {
    async function initModule() {
      const mod = await freshImport()
      mod.initializeFirebase({ apiKey: 'test' })
      return mod
    }

    it('onAuthChange registers callback', async () => {
      const mod = await initModule()
      const cb = vi.fn()
      mod.onAuthChange(cb)
      expect(mockOnAuthStateChanged).toHaveBeenCalledWith(expect.anything(), cb)
    })

    it('getCurrentUser returns null when no user', async () => {
      const mod = await initModule()
      mockAuthInstance.currentUser = null
      const user = await mod.getCurrentUser()
      expect(user).toBeNull()
    })

    it('getIdToken returns null when no user', async () => {
      const mod = await initModule()
      mockAuthInstance.currentUser = null
      const token = await mod.getIdToken()
      expect(token).toBeNull()
    })

    it('getIdToken returns token when user exists', async () => {
      const mod = await initModule()
      mockAuthInstance.currentUser = { getIdToken: vi.fn().mockResolvedValue('the-token') }
      const token = await mod.getIdToken()
      expect(token).toBe('the-token')
    })
  })
})

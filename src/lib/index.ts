// Logger & sanitization
export {
  createLogger,
  setLoggerBackend,
  sanitizeToken,
  sanitizeEmail,
  sanitizeUserId,
  sanitizeObject,
  authLogger,
  apiLogger,
  dbLogger,
  chatLogger,
} from './logger.js'
export type { LoggerBackend, LoggerBackendFactory } from './logger.js'

// Firebase wrappers
export { initFirebaseAdmin } from './firebase-admin.js'
export {
  initializeFirebase,
  getFirebaseApp,
  getFirebaseAuth,
  signIn,
  signUp,
  signInAnonymously,
  upgradeAnonymousAccount,
  upgradeAnonymousWithPopup,
  resetPassword,
  logout,
  onAuthChange,
  getCurrentUser,
  getIdToken,
} from './firebase-client.js'
export type { User, UserCredential, Auth } from './firebase-client.js'

// Auth
export {
  getServerSession,
  isAuthenticated,
  createSessionCookie,
  revokeSession,
  isRealUser,
  isRealUserServer,
  requireAuth,
  requireAdmin,
  isAdmin,
} from './auth/index.js'

// Utilities
export { formatExactTime, getRelativeTime } from './format-time.js'
export { linkifyText } from './linkify.js'
export { generateUUID } from './uuid.js'
export {
  checkRateLimit,
  createRateLimitResponse,
  getRateLimitIdentifier,
} from './rate-limiter.js'
export type { RateLimitConfig, RateLimitResult } from './rate-limiter.js'

// @prmichaelsen/agentbase-core
// Shared service infrastructure for agentbase projects

// Services
export { BaseService } from './services/base.service.js'
export type { Logger } from './services/base.service.js'
export { ConfirmationTokenService } from './services/confirmation-token.service.js'
export type { PendingAction } from './services/confirmation-token.service.js'

// Types
export type { AuthUser, ServerSession, AuthResult } from './types/index.js'

// Lib — re-export everything
export {
  // Logger
  createLogger,
  sanitizeToken,
  sanitizeEmail,
  sanitizeUserId,
  sanitizeObject,
  authLogger,
  apiLogger,
  dbLogger,
  chatLogger,
  // Firebase
  initFirebaseAdmin,
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
  // Auth
  getServerSession,
  isAuthenticated,
  createSessionCookie,
  revokeSession,
  isRealUser,
  isRealUserServer,
  requireAuth,
  requireAdmin,
  isAdmin,
  // Utilities
  formatExactTime,
  getRelativeTime,
  linkifyText,
  generateUUID,
  checkRateLimit,
  createRateLimitResponse,
  getRateLimitIdentifier,
} from './lib/index.js'

export type { User, UserCredential, Auth } from './lib/index.js'
export type { RateLimitConfig, RateLimitResult } from './lib/index.js'

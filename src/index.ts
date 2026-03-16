// @prmichaelsen/agentbase-core
// Shared service infrastructure for agentbase projects

// Services
export { BaseService } from './services/base.service.js'
export type { Logger } from './services/base.service.js'
export { ConfirmationTokenService } from './services/confirmation-token.service.js'
export type { PendingAction } from './services/confirmation-token.service.js'

// Types
export type { AuthUser, ServerSession, AuthResult } from './types/index.js'
export type { Ok, Err, Result } from './types/index.js'
export { ok, err, isOk, isErr, mapOk, mapErr, andThen, getOrElse, tryCatch, tryCatchAsync } from './types/index.js'

// Errors
export {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  RateLimitError,
  ExternalError,
  InternalError,
  isAppError,
  errorToStatusCode,
} from './errors/index.js'
export type { ErrorKind } from './errors/index.js'

// Lib — re-export everything
export {
  // Logger
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
export type { LoggerBackend, LoggerBackendFactory } from './lib/index.js'

// Config
export { loadConfig, validateConfig } from './config/index.js'
export type { AgentbaseConfig, FirebaseAdminConfig, FirebaseClientConfig, AuthConfig } from './config/index.js'

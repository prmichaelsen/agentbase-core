import { randomBytes } from 'node:crypto'

/**
 * A pending action stored against a confirmation token.
 * Encodes the exact operation parameters to prevent tampering.
 */
export interface PendingAction {
  type: string
  userId: string
  params: Record<string, unknown>
  summary: string
  createdAt: number
}

export interface IConfirmationTokenService {
  generateToken(action: PendingAction): string
  consumeToken(token: string, userId: string): PendingAction | null
}

const DEFAULT_TTL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Confirmation Token Service
 *
 * In-memory token store for two-step confirmation flows.
 * Mutating tools generate a preview + token; a confirm step consumes the token to execute.
 * Tokens are single-use, user-scoped, and expire after TTL.
 */
export class ConfirmationTokenService implements IConfirmationTokenService {
  private pending = new Map<string, PendingAction>()
  private ttlMs: number

  constructor(ttlMs: number = DEFAULT_TTL_MS) {
    this.ttlMs = ttlMs
  }

  /**
   * Generate a confirmation token for a pending action.
   * Returns a 32-char hex string.
   */
  generateToken(action: PendingAction): string {
    this.cleanup()
    const token = randomBytes(16).toString('hex')
    this.pending.set(token, action)
    return token
  }

  /**
   * Consume a confirmation token.
   * Returns the pending action if valid, null otherwise.
   * Tokens are single-use — consumed on retrieval.
   * Validates userId matches the original initiator.
   */
  consumeToken(token: string, userId: string): PendingAction | null {
    const action = this.pending.get(token)
    if (!action) return null

    // Always delete — single use
    this.pending.delete(token)

    // Check TTL
    if (Date.now() - action.createdAt > this.ttlMs) {
      return null
    }

    // Validate userId matches
    if (action.userId !== userId) {
      return null
    }

    return action
  }

  /**
   * Lazy cleanup of expired tokens.
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [token, action] of this.pending) {
      if (now - action.createdAt > this.ttlMs) {
        this.pending.delete(token)
      }
    }
  }
}

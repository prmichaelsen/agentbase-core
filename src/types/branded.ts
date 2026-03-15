// src/types/branded.ts
// Pattern: Shared Types (core-sdk.types-shared.md)
// Ported from remember-core

/**
 * Brand utility — creates nominal types from structural ones.
 * Prevents accidental mixing of same-shaped but semantically different values.
 */
type Brand<T, B extends string> = T & { readonly __brand: B }

/** A Firebase user ID */
export type UserId = Brand<string, 'UserId'>
/** A session identifier */
export type SessionId = Brand<string, 'SessionId'>
/** A confirmation token */
export type TokenId = Brand<string, 'TokenId'>
/** An email address */
export type EmailAddress = Brand<string, 'EmailAddress'>
/** A Unix timestamp in milliseconds */
export type Timestamp = Brand<number, 'Timestamp'>

export function toUserId(s: string): UserId { return s as UserId }
export function toSessionId(s: string): SessionId { return s as SessionId }
export function toTokenId(s: string): TokenId { return s as TokenId }
export function toEmailAddress(s: string): EmailAddress { return s as EmailAddress }
export function toTimestamp(n: number): Timestamp { return n as Timestamp }

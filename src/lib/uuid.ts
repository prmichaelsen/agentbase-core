/**
 * UUID Generator Utility
 *
 * Browser-compatible UUID generation.
 * Uses Web Crypto API if available, falls back to simple implementation.
 */

/**
 * Generate a UUID v4
 * Uses crypto.randomUUID() if available, otherwise uses a fallback
 */
export function generateUUID(): string {
  // Try Web Crypto API first
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

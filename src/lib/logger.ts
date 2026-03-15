import { createHash } from 'crypto';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

/**
 * Sanitization utilities for secure logging
 */

/**
 * Sanitize tokens by returning only a hash prefix
 * Prevents token exposure while maintaining debuggability
 */
export function sanitizeToken(token: string | undefined | null): string {
  if (!token) return '[empty]';
  const hash = createHash('sha256').update(token).digest('hex');
  return `${hash.substring(0, 8)}...`;
}

/**
 * Sanitize email addresses
 * Shows first 2 chars of local part + domain
 */
export function sanitizeEmail(email: string | undefined | null): string {
  if (!email) return '[empty]';
  const [local, domain] = email.split('@');
  if (!domain) return '[invalid]';
  return `${local.substring(0, 2)}***@${domain}`;
}

/**
 * Sanitize user IDs
 * Shows only first 8 characters with prefix
 */
export function sanitizeUserId(userId: string | undefined | null): string {
  if (!userId) return '[empty]';
  return `user_${userId.substring(0, 8)}`;
}

/**
 * Sanitize objects by redacting sensitive fields
 * Automatically redacts fields containing: token, password, secret, key, authorization
 */
export function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  const sensitive = ['token', 'password', 'secret', 'key', 'authorization', 'credential'];
  const result: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const lowerKey = key.toLowerCase();

    // Check if key contains sensitive terms
    if (sensitive.some(s => lowerKey.includes(s))) {
      result[key] = '[REDACTED]';
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursively sanitize nested objects
      result[key] = sanitizeObject(obj[key]);
    } else {
      result[key] = obj[key];
    }
  }

  return result;
}

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, data?: LogContext) {
    // Sanitize data before logging
    const sanitizedData = data ? sanitizeObject(data) : undefined;

    const isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

    switch (level) {
      case 'debug':
        if (isDevelopment) console.debug(`[${this.context}]`, message, sanitizedData || '');
        break;
      case 'info':
        console.log(`[${this.context}]`, message, sanitizedData || '');
        break;
      case 'warn':
        console.warn(`[${this.context}]`, message, sanitizedData || '');
        break;
      case 'error':
        console.error(`[${this.context}]`, message, sanitizedData || '');
        break;
    }
  }

  debug(message: string, data?: LogContext) {
    this.log('debug', message, data);
  }

  info(message: string, data?: LogContext) {
    this.log('info', message, data);
  }

  warn(message: string, data?: LogContext) {
    this.log('warn', message, data);
  }

  error(message: string, error?: Error | any, data?: LogContext) {
    const isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

    this.log('error', message, {
      ...data,
      error: error?.message || error,
      stack: isDevelopment ? error?.stack : undefined,
    });
  }
}

export function createLogger(context: string): Logger {
  return new Logger(context);
}

// Pre-configured loggers for common contexts
export const authLogger = createLogger('Auth');
export const apiLogger = createLogger('API');
export const dbLogger = createLogger('Database');
export const chatLogger = createLogger('Chat');

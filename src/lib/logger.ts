import { createHash } from 'crypto';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

/**
 * Backend interface for pluggable logger implementations.
 * Consumers can provide pino, winston, or any logger that satisfies this shape.
 */
export interface LoggerBackend {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

/**
 * Factory that creates a LoggerBackend for a given context name.
 * Use this to integrate structured loggers like pino:
 *
 * @example
 * ```ts
 * import pino from 'pino';
 * const root = pino();
 * setLoggerBackend((context) => root.child({ context }));
 * ```
 */
export type LoggerBackendFactory = (context: string) => LoggerBackend;

let _backendFactory: LoggerBackendFactory | null = null;

/**
 * Set a custom logger backend factory.
 * All existing and future loggers created via createLogger() will use this backend.
 * Pass `null` to reset to the default console-based logger.
 */
export function setLoggerBackend(factory: LoggerBackendFactory | null): void {
  _backendFactory = factory;
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

  private getBackend(): LoggerBackend | null {
    return _backendFactory ? _backendFactory(this.context) : null;
  }

  private log(level: LogLevel, message: string, data?: LogContext) {
    const sanitizedData = data ? sanitizeObject(data) : undefined;

    const backend = this.getBackend();
    if (backend) {
      backend[level](message, sanitizedData);
      return;
    }

    // Default console-based logging
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
    const sanitizedData = {
      ...data,
      error: error?.message || error,
      ...(typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'
        ? { stack: error?.stack }
        : {}),
    };

    this.log('error', message, sanitizedData);
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

import { AppError, isAppError } from '../../errors/index.js'

/**
 * Convert an error to an HTTP Response.
 * Use in route handlers to catch typed errors from guards/services.
 */
export function handleAuthError(err: unknown): Response {
  if (isAppError(err)) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: err.statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Internal server error' }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

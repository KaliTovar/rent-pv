/**
 * Environment-aware logging utility
 * Prevents debug logs from leaking to production
 *
 * SECURITY: Never pass these to any logger in production:
 * - data.session, access_token, refresh_token
 * - cookies, request headers
 * - Full user objects (use user.id only)
 * - API keys, secrets, credentials
 */

const isDev = process.env.NODE_ENV !== 'production'

export const log = (...args: unknown[]) => {
  if (isDev) console.log(...args)
}

export const warn = (...args: unknown[]) => {
  if (isDev) console.warn(...args)
}

export const error = (...args: unknown[]) => {
  // Logs in prod for debugging - callers must not pass sensitive data
  console.error(...args)
}

export const debug = (label: string, data: unknown) => {
  if (isDev) console.log(`[DEBUG] ${label}:`, data)
}

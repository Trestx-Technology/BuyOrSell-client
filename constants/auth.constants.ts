/**
 * Authentication token constants
 * Centralized token names used across the application
 */
export const AUTH_TOKEN_NAMES = {
  ACCESS_TOKEN: "buyorsell_access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export const AUTH_STORE_CONFIG = {
  STORE_NAME: "buyorsell-auth-store",
  USER_ID_COOKIE: "buyorsell_user_id",
  SESSION_MAX_AGE: 604800, // 1 week
} as const;


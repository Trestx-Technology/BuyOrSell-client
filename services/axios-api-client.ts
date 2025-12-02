import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestHeaders,
} from 'axios';
import { LocalStorageService } from '@/services/local-storage';
import ApiErrorHandler from './errorHandler';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/stores/authStore';

// ============================================================================
// TYPES
// ============================================================================

interface DecodedToken {
  exp: number; // expiry time in seconds since epoch
}

// ============================================================================
// GLOBALS
// ============================================================================

// Single-flight promise for refresh to prevent races and request hangs
let refreshPromise: Promise<string> | null = null;

// Flag to prevent multiple redirects
let isRedirecting = false;

// Consider tokens expiring within this window as expired to avoid 401 races
const EXP_SKEW_MS = 30_000; // 30s

// Refresh token API timeout (10 seconds)
const REFRESH_TIMEOUT_MS = 20_000;

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Checks if a JWT token is expired or will expire soon
 * @param token - The JWT token to check
 * @param skewMs - Time in milliseconds before expiry to consider as expired (default: 30s)
 * @returns true if token is expired or will expire within the skew window
 */
function isTokenExpired(
  token: string | null,
  skewMs: number = EXP_SKEW_MS,
): boolean {
  if (!token) {
    console.warn('[Token Check] No token provided');
    return true;
  }
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    const expMs = exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expMs - now;
    const isExpired = now >= expMs - Math.max(0, skewMs);
    
    // Only log if token is expired or close to expiry (within 5 minutes)
    if (isExpired || timeUntilExpiry < 5 * 60 * 1000) {
      console.log('[Token Check]', {
        isExpired,
        timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + 's',
        expiryDate: new Date(expMs).toISOString(),
        skewMs,
      });
    }
    
    return isExpired;
  } catch (error) {
    console.error('[Token Check] Failed to decode token:', error);
    return true;
  }
}

/**
 * Builds a login URL with redirect query parameter
 * @returns Login URL with current path as redirect parameter
 */
function getLoginUrlWithRedirect(): string {
  if (typeof window === 'undefined') {
    return '/login';
  }
  const currentPath = window.location.pathname + window.location.search;
  const redirectUrl = encodeURIComponent(currentPath);
  return `/login?redirect=${redirectUrl}`;
}

/**
 * Handles logout and redirect (prevents multiple redirects)
 */
async function handleLogoutAndRedirect(): Promise<void> {
  if (typeof window === 'undefined' || isRedirecting) {
    return;
  }
  
  isRedirecting = true;
  
  // Clear Zustand auth store
  try {
    const { clearSession } = useAuthStore.getState();
    await clearSession();
  } catch (error) {
    // If clearing store fails, still clear localStorage
    console.error('Error clearing auth store:', error);
    LocalStorageService.clear();
  }
  
  // Use setTimeout to allow current request to complete
  setTimeout(() => {
    window.location.href = getLoginUrlWithRedirect();
  }, 100);
}

/**
 * Sets the Authorization header with Bearer token
 * @param config - Axios request config
 * @param token - JWT access token
 */
function setAuthHeader(config: InternalAxiosRequestConfig, token: string) {
  if (!config.headers) {
    config.headers = {} as unknown as AxiosRequestHeaders;
  }
  const headers = config.headers as AxiosRequestHeaders & {
    set?: (k: string, v: string) => void;
  };
  if (headers && typeof headers.set === 'function') {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    headers.Authorization = `Bearer ${token}`;
  }
}

/**
 * Creates a separate axios instance for refresh token calls
 * This avoids circular dependency and infinite loops
 */
function createRefreshAxiosInstance() {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: REFRESH_TIMEOUT_MS,
  });
}

/**
 * Calls the refresh token API using a separate axios instance
 * This prevents circular dependency issues
 */
async function callRefreshTokenAPI(refreshToken: string): Promise<{
  statusCode?: number;
  timestamp?: string;
  data?: { accessToken?: string; refreshToken?: string; user?: unknown };
}> {
  const refreshAxios = createRefreshAxiosInstance();
  const response = await refreshAxios.post('/auth/refresh-token', {
    refreshToken,
  });
  return response.data;
}

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

// Request timeout (30 seconds)
const REQUEST_TIMEOUT_MS = 30_000;

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: REQUEST_TIMEOUT_MS, // Add timeout to prevent hanging requests
  transformRequest: [
    (data: unknown): string | unknown => {
      // Skip transformation for FormData to preserve binary content
      if (data instanceof FormData) {
        return data;
      }
      return data;
    },
    ...(axios.defaults.transformRequest as Array<(data: unknown) => unknown>),
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as Array<
      (data: unknown) => unknown
    >),
    (data: unknown): unknown => {
      return data;
    },
  ],
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const token = LocalStorageService.get<string>('buyorsell_access_token');

    // Case: expired or invalid access token -> refresh using single shared promise
    if (token && isTokenExpired(token)) {
      // Try to get refresh token - check both LocalStorageService and direct localStorage
      let refreshToken = LocalStorageService.get<string>("refresh_token");
      
      // Fallback: try direct localStorage access if LocalStorageService returns null
      if (!refreshToken && typeof window !== 'undefined') {
        const rawRefreshToken = localStorage.getItem("refresh_token");
        if (rawRefreshToken) {
          try {
            // Try to parse as JSON first (in case it was stored via LocalStorageService)
            refreshToken = JSON.parse(rawRefreshToken) as string;
          } catch {
            // If parsing fails, use the raw value (might be stored as plain string)
            refreshToken = rawRefreshToken;
          }
        }
      }

      if (!refreshToken) {
        console.error('[Axios Interceptor] No refresh token found in localStorage');
        void handleLogoutAndRedirect();
        return Promise.reject(new Error('No refresh token'));
      }

      // Check if refresh token is also expired
      const isRefreshExpired = isTokenExpired(refreshToken, 0);
      if (isRefreshExpired) {
        console.error('[Axios Interceptor] Refresh token is expired', {
          tokenLength: refreshToken.length,
          tokenPreview: refreshToken.substring(0, 20) + '...',
        });
        void handleLogoutAndRedirect();
        return Promise.reject(new Error('Refresh token expired'));
      }

      if (!refreshPromise) {
        // Start refresh with timeout protection
        refreshPromise = Promise.race([
          callRefreshTokenAPI(refreshToken)
            .then((res: {
              statusCode?: number;
              timestamp?: string;
              data?: { accessToken?: string; refreshToken?: string; user?: unknown };
            }) => {
              // Response structure from refreshToken: { statusCode, timestamp, data: { accessToken, refreshToken, user } }
              const responseData = res?.data;
              const newToken = responseData?.accessToken;
              const newRefresh = responseData?.refreshToken;
              
              if (!newToken) {
                console.error('[Axios Interceptor] No access token in refresh response', res);
                throw new Error('No access token in refresh response');
              }
              
              console.log('[Axios Interceptor] Token refresh successful');
              LocalStorageService.set('buyorsell_access_token', newToken);
              if (newRefresh) {
                LocalStorageService.set('refresh_token', newRefresh);
              }
              
              // Reset redirect flag on successful refresh
              isRedirecting = false;
              
              return newToken;
            })
            .catch((err) => {
              console.error('[Axios Interceptor] Refresh token API call failed:', err);
              throw err;
            }),
          new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error('Refresh token request timeout')), REFRESH_TIMEOUT_MS)
          ),
        ])
          .catch((err: Error) => {
            // Clear refresh promise immediately on error to prevent hanging
            refreshPromise = null;
            console.error('[Axios Interceptor] Refresh token flow failed:', err.message);
            // On refresh failure, clear and redirect; propagate rejection to callers
            void handleLogoutAndRedirect();
            throw err;
          })
          .finally(() => {
            // Ensure promise is cleared even if there's an unexpected error
            refreshPromise = null;
          });
      }

      try {
        const newToken = await refreshPromise;
        if (newToken) {
          setAuthHeader(config, newToken);
        }
      } catch (err) {
        // If refresh fails, reject the request
        return Promise.reject(err);
      }
    }

    // Normal case: token present and not expired
    if (token && !isTokenExpired(token)) {
      setAuthHeader(config, token);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<never> => {
    const status = error.response?.status;
    const errorCode = error.code;

    // Special handling for authentication
    // Don't show errors on login page
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      return Promise.reject(error);
    }

    // Handle network errors and timeouts that could cause infinite loops
    if (!error.response) {
      // Network error - check if it's a timeout or connection issue
      if (
        errorCode === 'ECONNABORTED' ||
        errorCode === 'ETIMEDOUT' ||
        errorCode === 'ENOTFOUND' ||
        errorCode === 'ECONNREFUSED' ||
        error.message?.includes('timeout') ||
        error.message?.includes('Network Error')
      ) {
        // Clear any pending refresh promise to prevent loops
        refreshPromise = null;
        
        // Check if we're already on the no-internet page to prevent redirect loops
        if (typeof window !== 'undefined' && window.location.pathname !== '/no-internet') {
          // Redirect to no-internet page for connection issues
          window.location.href = '/no-internet';
          return Promise.reject(error);
        }
      }
    }

    if (status === 401) {
      // Prevent multiple redirects
      if (!isRedirecting) {
        void handleLogoutAndRedirect();
        toast.error('Session expired. Please log in again.');
      }
      return Promise.reject(error);
    }

    // Handle all other errors using the error handler
    const errorResponse = ApiErrorHandler.handle(error);

    // Display toast notification with the error message (but not for network errors that redirect)
    if (typeof window !== 'undefined' && window.location.pathname !== '/no-internet') {
      toast.error(errorResponse.message);
    }

    // Return a rejected promise with the structured error object
    // This allows consumers to handle errors gracefully while still
    // maintaining the error flow with Promise.reject
    return Promise.reject(errorResponse);
  },
);

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
import { AUTH_TOKEN_NAMES } from '@/constants/auth.constants';
import { CookieService } from '@/services/cookie-service';

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
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:48',message:'isTokenExpired entry',data:{hasToken:!!token,skewMs},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion
  if (!token) {
    console.warn('No token provided');
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:54',message:'isTokenExpired no token',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    return true;
  }
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    const expMs = exp * 1000;
    const now = Date.now();
    const timeUntilExpiry = expMs - now;
    const isExpired = now >= expMs - Math.max(0, skewMs);
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:61',message:'isTokenExpired result',data:{isExpired,timeUntilExpiry:Math.round(timeUntilExpiry/1000),expiryDate:new Date(expMs).toISOString(),skewMs},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    
    // Only log if token is expired or close to expiry (within 5 minutes)
    if (isExpired || timeUntilExpiry < 5 * 60 * 1000) {
      console.debug('Token check result', {
        isExpired,
        timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + 's',
        expiryDate: new Date(expMs).toISOString(),
        skewMs,
      });
    }
    
    return isExpired;
  } catch (error) {
    console.error('Failed to decode token', error);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:75',message:'isTokenExpired decode error',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
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
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:96',message:'handleLogoutAndRedirect entry',data:{isRedirecting,hasWindow:typeof window!=='undefined',pathname:typeof window!=='undefined'?window.location.pathname:'N/A'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  if (typeof window === 'undefined' || isRedirecting) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:98',message:'handleLogoutAndRedirect early return',data:{reason:typeof window==='undefined'?'no window':'already redirecting'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    return;
  }
  
  isRedirecting = true;
  
  // Clear Zustand auth store
  try {
    const { clearSession } = useAuthStore.getState();
    await clearSession();
    // Clear cookie using client-side CookieService
    CookieService.remove(AUTH_TOKEN_NAMES.ACCESS_TOKEN, { path: '/' });
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:107',message:'handleLogoutAndRedirect cleared session',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
  } catch (error) {
    // If clearing store fails, still clear localStorage and cookies
    console.error('Error clearing auth store', error);
    LocalStorageService.clear();
    CookieService.remove(AUTH_TOKEN_NAMES.ACCESS_TOKEN, { path: '/' });
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:111',message:'handleLogoutAndRedirect error clearing',data:{error:String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
  }
  
  // Use setTimeout to allow current request to complete
  setTimeout(() => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:116',message:'handleLogoutAndRedirect redirecting',data:{redirectUrl:getLoginUrlWithRedirect()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
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
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:154',message:'callRefreshTokenAPI entry',data:{refreshTokenLength:refreshToken.length,refreshTokenExpired:isTokenExpired(refreshToken,0)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  const refreshAxios = createRefreshAxiosInstance();
  const startTime = Date.now();
  try {
    const response = await refreshAxios.post('/auth/refresh-token', {
      refreshToken,
    });
    const duration = Date.now() - startTime;
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:163',message:'callRefreshTokenAPI success',data:{duration,statusCode:response.status,hasAccessToken:!!response.data?.data?.accessToken,hasRefreshToken:!!response.data?.data?.refreshToken},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return response.data;
  } catch (error) {
    const duration = Date.now() - startTime;
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:168',message:'callRefreshTokenAPI error',data:{duration,errorCode:(error as AxiosError).code,status:(error as AxiosError).response?.status,message:(error as Error).message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    throw error;
  }
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
    const token = LocalStorageService.get<string>(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:200',message:'request interceptor entry',data:{hasToken:!!token,url:config.url,method:config.method,refreshPromiseExists:!!refreshPromise},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Case: expired or invalid access token -> refresh using single shared promise
    if (token && isTokenExpired(token)) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:207',message:'token expired, attempting refresh',data:{url:config.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      // Try to get refresh token - check both LocalStorageService and direct localStorage
      let refreshToken = LocalStorageService.get<string>(AUTH_TOKEN_NAMES.REFRESH_TOKEN);
      
      // Fallback: try direct localStorage access if LocalStorageService returns null
      if (!refreshToken && typeof window !== 'undefined') {
        const rawRefreshToken = localStorage.getItem(AUTH_TOKEN_NAMES.REFRESH_TOKEN);
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
        console.error('No refresh token found in localStorage', { url: config.url });
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:225',message:'no refresh token found',data:{url:config.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        void handleLogoutAndRedirect();
        return Promise.reject(new Error('No refresh token'));
      }

      // Check if refresh token is also expired
      const isRefreshExpired = isTokenExpired(refreshToken, 0);
      if (isRefreshExpired) {
        console.error('Refresh token is expired', {
          tokenLength: refreshToken.length,
          tokenPreview: refreshToken.substring(0, 20) + '...',
          url: config.url,
        });
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:233',message:'refresh token expired',data:{url:config.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        void handleLogoutAndRedirect();
        return Promise.reject(new Error('Refresh token expired'));
      }

      if (!refreshPromise) {
        // Start refresh with timeout protection
        refreshPromise = Promise.race([
          callRefreshTokenAPI(refreshToken)
            .then(async (res: {
              statusCode?: number;
              timestamp?: string;
              data?: { accessToken?: string; refreshToken?: string; user?: unknown };
            }) => {
              // Response structure from refreshToken: { statusCode, timestamp, data: { accessToken, refreshToken, user } }
              const responseData = res?.data;
              const newToken = responseData?.accessToken;
              const newRefresh = responseData?.refreshToken;
              
              if (!newToken) {
                console.error('No access token in refresh response', { response: res });
                throw new Error('No access token in refresh response');
              }
              
              console.info('Token refresh successful', { hasNewRefresh: !!newRefresh });
              LocalStorageService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, newToken);
              if (newRefresh) {
                LocalStorageService.set(AUTH_TOKEN_NAMES.REFRESH_TOKEN, newRefresh);
              }
              
              // Update cookie with new access token using client-side CookieService
              try {
                const maxAge = Number(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE) || 86400; // Default to 24 hours
                CookieService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, newToken, {
                  maxAge,
                  path: '/',
                  secure: true,
                  sameSite: 'lax',
                });
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:323',message:'cookie updated after refresh',data:{newTokenLength:newToken.length,maxAge},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                // #endregion
              } catch (cookieError) {
                console.error('Failed to update cookie after token refresh', cookieError);
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:328',message:'cookie update failed after refresh',data:{error:String(cookieError)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
                // #endregion
                // Don't throw - token refresh succeeded, cookie update failure is non-critical
              }
              
              // #region agent log
              fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:261',message:'token refresh successful',data:{newTokenLength:newToken.length,hasNewRefresh:!!newRefresh,newTokenExpired:isTokenExpired(newToken)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
              // #endregion
              
              // Reset redirect flag on successful refresh
              isRedirecting = false;
              
              return newToken;
            })
            .catch((err) => {
              console.error('Refresh token API call failed', err);
              throw err;
            }),
          new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error('Refresh token request timeout')), REFRESH_TIMEOUT_MS)
          ),
        ])
          .catch((err: Error) => {
            // Clear refresh promise immediately on error to prevent hanging
            refreshPromise = null;
            console.error('Refresh token flow failed', err, { message: err.message });
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

    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:323',message:'response interceptor error',data:{status,errorCode,hasResponse:!!error.response,message:error.message,pathname:typeof window!=='undefined'?window.location.pathname:'N/A'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

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
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:343',message:'network error detected',data:{errorCode,pathname:typeof window!=='undefined'?window.location.pathname:'N/A'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
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
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/4c125430-28cc-47b1-938e-921a1c6e152f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'axios-api-client.ts:356',message:'401 unauthorized',data:{isRedirecting,pathname:typeof window!=='undefined'?window.location.pathname:'N/A'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
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

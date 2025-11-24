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
import { refreshToken as refreshTokenAPI } from '@/app/api/auth/auth.services';

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

// Consider tokens expiring within this window as expired to avoid 401 races
const EXP_SKEW_MS = 30_000; // 30s

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
  if (!token) return true;
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    const expMs = exp * 1000;
    return Date.now() >= expMs - Math.max(0, skewMs);
  } catch {
    return true;
  }
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

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
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
      // No refresh token available -> hard logout and reject to avoid hanging the request
      const refreshToken = LocalStorageService.get<string>('refreshToken');

      if (!refreshToken) {
        if (typeof window !== 'undefined') {
          LocalStorageService.clear();
          window.location.href = '/login';
        }
        return Promise.reject(new Error('No refresh token'));
      }

      if (!refreshPromise) {
        // Start refresh
        refreshPromise = refreshTokenAPI(refreshToken)
          .then((res: {
            statusCode?: number;
            timestamp?: string;
            data?: { accessToken?: string; refreshToken?: string; user?: unknown };
          }) => {
            // Response structure from refreshToken: { statusCode, timestamp, data: { accessToken, refreshToken, user } }
            // Since refreshToken returns response.data, res is: { statusCode, timestamp, data: {...} }
            const responseData = res?.data;
            const newToken = responseData?.accessToken;
            const newRefresh = responseData?.refreshToken;
            
            if (!newToken) {
              throw new Error('No access token in refresh response');
            }
            
            LocalStorageService.set('buyorsell_access_token', newToken);
            if (newRefresh) {
              LocalStorageService.set('refreshToken', newRefresh);
            }
            
            return newToken;
          })
          .catch((err: Error) => {
            // On refresh failure, clear and redirect; propagate rejection to callers
            if (typeof window !== 'undefined') {
              LocalStorageService.clear();
              window.location.href = '/login';
            }
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        setAuthHeader(config, newToken);
      }

    }

    // Normal case: token present and not expired
    if (token) {
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

    // Special handling for authentication
    // Don't show errors on login page
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      return Promise.reject(error);
    }

    if (status === 401) {
      if (typeof window !== 'undefined') {
        LocalStorageService.clear();
        window.location.href = '/login';
        toast.error('Session expired. Please log in again.');
      }
      return Promise.reject(error);
    }

    // Handle all other errors using the error handler
    const errorResponse = ApiErrorHandler.handle(error);

    // Display toast notification with the error message
    if (typeof window !== 'undefined') {
      toast.error(errorResponse.message);
    }

    // Return a rejected promise with the structured error object
    // This allows consumers to handle errors gracefully while still
    // maintaining the error flow with Promise.reject
    return Promise.reject(errorResponse);
  },
);

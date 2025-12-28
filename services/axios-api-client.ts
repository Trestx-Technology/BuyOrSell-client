import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestHeaders,
} from "axios";
import { LocalStorageService } from "@/services/local-storage";
import ApiErrorHandler from "./errorHandler";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/stores/authStore";
import { AUTH_TOKEN_NAMES } from "@/constants/auth.constants";
import { CookieService } from "@/services/cookie-service";
import { isPublicEndpoint } from "@/constants/routes.constants";

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
  skewMs: number = EXP_SKEW_MS
): boolean {
  if (!token) {
    console.warn("No token provided");
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
      console.debug("Token check result", {
        isExpired,
        timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + "s",
        expiryDate: new Date(expMs).toISOString(),
        skewMs,
      });
    }

    return isExpired;
  } catch (error) {
    console.error("Failed to decode token", error);
    return true;
  }
}

/**
 * Builds a login URL with redirect query parameter
 * @returns Login URL with current path as redirect parameter
 */
function getLoginUrlWithRedirect(): string {
  if (typeof window === "undefined") {
    return "/login";
  }
  const currentPath = window.location.pathname + window.location.search;
  const redirectUrl = encodeURIComponent(currentPath);
  return `/login?redirect=${redirectUrl}`;
}

/**
 * Handles logout and redirect (prevents multiple redirects)
 */
async function handleLogoutAndRedirect(): Promise<void> {
  if (typeof window === "undefined" || isRedirecting) {
    return;
  }

  isRedirecting = true;

  // Clear Zustand auth store
  try {
    const { clearSession } = useAuthStore.getState();
    await clearSession();
    // Clear cookie using client-side CookieService
    CookieService.remove(AUTH_TOKEN_NAMES.ACCESS_TOKEN, { path: "/" });
  } catch (error) {
    // If clearing store fails, still clear localStorage and cookies
    console.error("Error clearing auth store", error);
    LocalStorageService.clear();
    CookieService.remove(AUTH_TOKEN_NAMES.ACCESS_TOKEN, { path: "/" });
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
  if (headers && typeof headers.set === "function") {
    headers.set("Authorization", `Bearer ${token}`);
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
  const startTime = Date.now();
  try {
    const response = await refreshAxios.post("/auth/refresh-token", {
      refreshToken,
    });
    return response.data;
  } catch (error) {
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
    ...(axios.defaults.transformResponse as Array<(data: unknown) => unknown>),
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
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    // CRITICAL FIX: Skip all token logic for public endpoints
    if (isPublicEndpoint(config.url)) {
      console.debug("Skipping auth for public endpoint:", config.url);

      // Still add emirate parameter if needed
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const emirate = urlParams.get("emirate");
        if (emirate && !config.params?.emirate) {
          config.params = { ...config.params, emirate };
        }
      }

      return config;
    }

    const token = LocalStorageService.get<string>(
      AUTH_TOKEN_NAMES.ACCESS_TOKEN
    );

    // Case: expired or invalid access token -> refresh using single shared promise
    if (token && isTokenExpired(token)) {
      // Try to get refresh token - check both LocalStorageService and direct localStorage
      let refreshToken = LocalStorageService.get<string>(
        AUTH_TOKEN_NAMES.REFRESH_TOKEN
      );

      // Fallback: try direct localStorage access if LocalStorageService returns null
      if (!refreshToken && typeof window !== "undefined") {
        const rawRefreshToken = localStorage.getItem(
          AUTH_TOKEN_NAMES.REFRESH_TOKEN
        );
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
        console.error("No refresh token found in localStorage", {
          url: config.url,
        });
        void handleLogoutAndRedirect();
        return Promise.reject(new Error("No refresh token"));
      }

      // Check if refresh token is also expired
      const isRefreshExpired = isTokenExpired(refreshToken, 0);
      if (isRefreshExpired) {
        console.error("Refresh token is expired", {
          tokenLength: refreshToken.length,
          tokenPreview: refreshToken.substring(0, 20) + "...",
          url: config.url,
        });
        void handleLogoutAndRedirect();
        return Promise.reject(new Error("Refresh token expired"));
      }

      if (!refreshPromise) {
        refreshPromise = Promise.race([
          callRefreshTokenAPI(refreshToken)
            .then(
              async (res: {
                statusCode?: number;
                timestamp?: string;
                data?: {
                  accessToken?: string;
                  refreshToken?: string;
                  user?: unknown;
                };
              }) => {
                const responseData = res?.data;
                const newToken = responseData?.accessToken;
                const newRefresh = responseData?.refreshToken;

                if (!newToken) {
                  console.error("No access token in refresh response", {
                    response: res,
                  });
                  throw new Error("No access token in refresh response");
                }

                console.info("Token refresh successful", {
                  hasNewRefresh: !!newRefresh,
                });
                LocalStorageService.set(
                  AUTH_TOKEN_NAMES.ACCESS_TOKEN,
                  newToken
                );
                if (newRefresh) {
                  LocalStorageService.set(
                    AUTH_TOKEN_NAMES.REFRESH_TOKEN,
                    newRefresh
                  );
                }

                try {
                  const maxAge =
                    Number(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE) || 86400;
                  CookieService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, newToken, {
                    maxAge,
                    path: "/",
                    secure: true,
                    sameSite: "lax",
                  });
                } catch (cookieError) {
                  console.error(
                    "Failed to update cookie after token refresh",
                    cookieError
                  );
                }

                isRedirecting = false;
                return newToken;
              }
            )
            .catch((err) => {
              console.error("Refresh token API call failed", err);
              throw err;
            }),
          new Promise<string>((_, reject) =>
            setTimeout(
              () => reject(new Error("Refresh token request timeout")),
              REFRESH_TIMEOUT_MS
            )
          ),
        ])
          .catch((err: Error) => {
            refreshPromise = null;
            console.error("Refresh token flow failed", err, {
              message: err.message,
            });
            void handleLogoutAndRedirect();
            throw err;
          })
          .finally(() => {
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

    // Automatically add emirate query parameter from URL to all requests
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const emirate = urlParams.get("emirate");

      if (emirate) {
        if (!config.params) {
          config.params = {};
        }
        if (!config.params.emirate) {
          config.params.emirate = emirate;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
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

    // Get the request URL to check if it's a public endpoint
    const requestUrl = error.config?.url;
    const isPublic = isPublicEndpoint(requestUrl);

    // Don't show errors or redirect on login page
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/login"
    ) {
      return Promise.reject(error);
    }

    // Handle network errors and timeouts
    if (!error.response) {
      if (
        errorCode === "ECONNABORTED" ||
        errorCode === "ETIMEDOUT" ||
        errorCode === "ENOTFOUND" ||
        errorCode === "ECONNREFUSED" ||
        error.message?.includes("timeout") ||
        error.message?.includes("Network Error")
      ) {
        refreshPromise = null;

        if (typeof window !== "undefined") {
          const pathname = window.location.pathname;
          const isNoInternetPage = pathname.includes("/no-internet");

          if (!isNoInternetPage) {
            const locales = ["en-US", "nl-NL", "nl", "ar"];
            const pathSegments = pathname.split("/").filter(Boolean);
            const currentLocale =
              pathSegments[0] && locales.includes(pathSegments[0])
                ? pathSegments[0]
                : "en-US";

            window.location.href = `/${currentLocale}/no-internet`;
            return Promise.reject(error);
          }
        }
      }
    }

    // CRITICAL FIX: Only redirect to login for 401 on protected endpoints
    if (status === 401 && !isPublic) {
      if (!isRedirecting) {
        void handleLogoutAndRedirect();
        toast.error("Session expired. Please log in again.");
      }
      return Promise.reject(error);
    }

    // For 401 on public endpoints, just return the error without redirecting
    if (status === 401 && isPublic) {
      console.warn("401 error on public endpoint:", requestUrl);
      return Promise.reject(error);
    }

    // Handle all other errors using the error handler
    const errorResponse = ApiErrorHandler.handle(error);

    if (
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/no-internet")
    ) {
      toast.error(errorResponse.message);
    }

    return Promise.reject(errorResponse);
  }
);

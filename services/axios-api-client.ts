import axios, {
  type AxiosError,
  type AxiosRequestHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { AUTH_TOKEN_NAMES } from "@/constants/auth.constants";
import { isPublicEndpoint } from "@/constants/routes.constants";
import ApiErrorHandler from "./errorHandler";
import { LocalStorageService } from "@/services/local-storage";
import { useAuthStore } from "@/stores/authStore";
import { CookieService } from "@/services/cookie-service";
import { authQueries } from "@/app/api/auth";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean;
  }
}

// ============================================================================
// TYPES
// ============================================================================

interface DecodedToken {
  exp: number;
}

interface RefreshTokenResponse {
  statusCode?: number;
  timestamp?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: unknown;
  };
}

// ============================================================================
// GLOBALS
// ============================================================================

let refreshPromise: Promise<string> | null = null;
let isRedirecting = false;

const EXP_SKEW_MS = 30_000; // 30s buffer before expiry
const REFRESH_TIMEOUT_MS = 30_000;
const REQUEST_TIMEOUT_MS = 60_000;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// ============================================================================
// HELPERS
// ============================================================================

function isTokenExpired(
  token: string | null,
  skewMs: number = EXP_SKEW_MS,
): boolean {
  if (!token) return true;

  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    const expMs = exp * 1000;
    const now = Date.now();
    return now >= expMs - Math.max(0, skewMs);
  } catch (error) {
    console.error("[Token Check] Failed to decode token:", error);
    return true;
  }
}

function getLoginUrlWithRedirect(): string {
  if (typeof window === "undefined") return "/login";

  const currentPath = window.location.pathname + window.location.search;
  const redirectUrl = encodeURIComponent(currentPath);
  return `/login?redirect=${redirectUrl}`;
}

async function handleLogoutAndRedirect(): Promise<void> {
  if (typeof window === "undefined" || isRedirecting) return;

  isRedirecting = true;

  try {
    const { clearSession } = useAuthStore.getState();
    await clearSession();
    CookieService.remove(AUTH_TOKEN_NAMES.ACCESS_TOKEN, { path: "/" });
  } catch (error) {
    console.error("Error clearing auth store:", error);
    LocalStorageService.clear();
    CookieService.remove(AUTH_TOKEN_NAMES.ACCESS_TOKEN, { path: "/" });
  }

  setTimeout(() => {
    window.location.href = getLoginUrlWithRedirect();
  }, 100);
}

function setAuthHeader(
  config: InternalAxiosRequestConfig,
  token: string,
): void {
  if (!config.headers) {
    config.headers = {} as unknown as AxiosRequestHeaders;
  }
  const headers = config.headers as AxiosRequestHeaders & {
    set?: (k: string, v: string) => void;
  };

  if (typeof headers.set === "function") {
    headers.set("Authorization", `Bearer ${token}`);
  } else {
    headers.Authorization = `Bearer ${token}`;
  }
}

function createRefreshAxiosInstance() {
  return axios.create({
    baseURL: BACKEND_URL,
    timeout: REFRESH_TIMEOUT_MS,
  });
}

function getRefreshToken(): string | null {
  let refreshToken = LocalStorageService.get<string>(
    AUTH_TOKEN_NAMES.REFRESH_TOKEN,
  );

  // Fallback: try direct localStorage access
  if (!refreshToken && typeof window !== "undefined") {
    const rawRefreshToken = localStorage.getItem(
      AUTH_TOKEN_NAMES.REFRESH_TOKEN,
    );
    if (rawRefreshToken) {
      try {
        refreshToken = JSON.parse(rawRefreshToken) as string;
      } catch {
        refreshToken = rawRefreshToken;
      }
    }
  }

  return refreshToken;
}

async function callRefreshTokenAPI(
  refreshToken: string,
  userId?: string,
): Promise<RefreshTokenResponse> {
  const refreshAxios = createRefreshAxiosInstance();

  try {
    const response = await refreshAxios.post(
      authQueries.refreshToken.endpoint,
      {
        refreshToken,
        userId,
      },
    );
    return response.data;
  } catch (error) {
    console.error("[Refresh Token] API call failed:", error);
    throw error;
  }
}
async function executeRefreshFlow(refreshToken: string): Promise<string> {
  const user = LocalStorageService.get<{ _id: string }>("user");
  const userId = user?._id;

  const refreshCall = callRefreshTokenAPI(refreshToken, userId).then((res) => {
    const newToken = res?.data?.accessToken;
    const newRefresh = res?.data?.refreshToken;

    if (!newToken) {
      throw new Error("No access token in refresh response");
    }

    console.log("[Token Refresh] Successful");
    LocalStorageService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, newToken);

    if (newRefresh) {
      LocalStorageService.set(AUTH_TOKEN_NAMES.REFRESH_TOKEN, newRefresh);
    }

    // Also set cookie to maintain consistency
    try {
      const maxAge = Number(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE) || 86400;
      CookieService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, newToken, {
        maxAge,
        path: "/",
        secure: true,
        sameSite: "lax",
      });
    } catch (e) {
      console.error("Failed to set cookie after refresh", e);
    }

    isRedirecting = false;
    return newToken;
  });

  const timeout = new Promise<string>((_, reject) =>
    setTimeout(
      () => reject(new Error("Refresh token request timeout")),
      REFRESH_TIMEOUT_MS,
    ),
  );

  return Promise.race([refreshCall, timeout]);
}

function isConnectionError(error: AxiosError): boolean {
  const errorCode = error.code;
  return (
    errorCode === "ECONNABORTED" ||
    errorCode === "ETIMEDOUT" ||
    errorCode === "ENOTFOUND" ||
    errorCode === "ECONNREFUSED" ||
    error.message?.includes("timeout") ||
    error.message?.includes("Network Error")
  );
}

function redirectToNoInternet(): void {
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname;
  if (pathname.includes("/no-internet")) return;

  const locales = ["en-US", "nl-NL", "nl", "ar"];
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentLocale =
    pathSegments[0] && locales.includes(pathSegments[0])
      ? pathSegments[0]
      : "en-US";

  window.location.href = `/${currentLocale}/no-internet`;
}

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: REQUEST_TIMEOUT_MS,
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
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    // 1. Skip auth for public endpoints
    if (isPublicEndpoint(config.url)) {
      // Still add emirate if present
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const emirate = urlParams.get("emirate");
        if (emirate && !config.params?.emirate) {
          config.params = { ...config.params, emirate };
        }
      }
      return config;
    }

    // 2. Auth logic
    let token = LocalStorageService.get<string>(AUTH_TOKEN_NAMES.ACCESS_TOKEN);

    // Check if we need to refresh: No token OR Token is expired
    if (!token || isTokenExpired(token)) {
      const refreshToken = getRefreshToken();
      const isRefreshValid = refreshToken && !isTokenExpired(refreshToken, 0);

      if (isRefreshValid) {
        if (!refreshPromise) {
          refreshPromise = executeRefreshFlow(refreshToken!)
            .catch((err) => {
              console.error(
                "[Request Interceptor] Refresh flow failed:",
                err.message,
              );
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
            token = newToken;
          }
        } catch (err) {
          return Promise.reject(err);
        }
      } else if (token && isTokenExpired(token)) {
        // Only force logout if we had an expired token and no valid refresh token
        // If we had NO token at all, we might be a guest user, so don't force logout
        console.error(
          "[Request Interceptor] Session expired (No valid refresh token)",
        );
        void handleLogoutAndRedirect();
        return Promise.reject(new Error("Session expired"));
      }
    }

    if (token && !isTokenExpired(token)) {
      setAuthHeader(config, token);
    }

    // 3. Add emirate param globally (if not already handled)
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
  (error: unknown) => Promise.reject(error),
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<never> => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;
    const isPublic = isPublicEndpoint(requestUrl);

    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/login"
    ) {
      return Promise.reject(error);
    }

    if (!error.response && isConnectionError(error)) {
      refreshPromise = null;
      redirectToNoInternet();
      return Promise.reject(error);
    }

    // Only redirect for 401 on protected endpoints
    if (status === 401 && !isPublic) {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // If we already retried, give up and logout
      if (originalRequest._retry) {
        if (!isRedirecting) {
          void handleLogoutAndRedirect();
          toast.error("Session expired. Please log in again.");
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        if (!isRedirecting) {
          void handleLogoutAndRedirect();
        }
        return Promise.reject(error);
      }

      try {
        if (!refreshPromise) {
          refreshPromise = executeRefreshFlow(refreshToken)
            .catch((refreshErr) => {
              // If refresh fails, we must logout
              if (!isRedirecting) {
                void handleLogoutAndRedirect();
              }
              throw refreshErr;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        // Update verify header with new token
        setAuthHeader(originalRequest, newToken);

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed (already handled in catch above, but strictly returning rejection here)
        return Promise.reject(refreshError);
      }
    }

    // For 401 on public endpoints, just return the error without redirecting
    if (status === 401 && isPublic) {
      console.warn("401 error on public endpoint:", requestUrl);
      return Promise.reject(error);
    }

    const errorResponse = ApiErrorHandler.handle(error);

    // Check if the request config has the skipErrorToast flag
    const skipToast = error.config?.skipErrorToast;

    if (
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/no-internet") &&
      !skipToast
    ) {
      toast.error(errorResponse.message);
    }

    return Promise.reject(errorResponse);
  },
);



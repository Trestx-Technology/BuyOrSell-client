import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LocalStorageService } from "@/services/local-storage";
import { CookieService } from "@/services/cookie-service";
import {
  AUTH_TOKEN_NAMES,
  AUTH_STORE_CONFIG,
} from "@/constants/auth.constants";

// ============================================================================
// TYPES
// ============================================================================

export interface UserRole {
  name: string;
  description: string;
  permissions: Record<string, unknown>;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

const { STORE_NAME, USER_ID_COOKIE, SESSION_MAX_AGE } = AUTH_STORE_CONFIG;

export interface SessionUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo?: string;
  countryCode?: string;
  status: string;
  hashedPassword: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: UserRole;
  socialType: string;
  documents: unknown[];
  blockedReason: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  loggedIn?: boolean;
  deviceKey?: string;
  image?: string;
  isSeller?: boolean;
  gender?: "MALE" | "FEMALE" | "OTHER";
  lastActiveAt?: string;
  emaratiStatus?: "PENDING" | "VERIFIED" | "REJECTED" | "NOT_SET";
  recentlyViewed?: Array<{
    adId: string;
    viewedAt: string;
    _id: string;
  }>;
}

export interface AuthSession {
  user: SessionUser | null;
}

export interface AuthStore {
  // Session State
  session: AuthSession;
  isAuthenticated: boolean;

  // Actions
  setSession: (
    accessToken: string,
    refreshToken: string,
    user: SessionUser,
  ) => Promise<void>;
  clearSession: () => Promise<void>;
  updateUser: (user: Partial<SessionUser>) => void;
  refreshTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const initialSession: AuthSession = {
  user: null,
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      session: initialSession,
      isAuthenticated: false,

      // Set Session (Login)
      setSession: async (accessToken, refreshToken, user) => {
        // Normalize user data to match SessionUser structure
        const userData = user as SessionUser & {
          id?: string;
          verifyEmail?: boolean;
          phoneNo?: string;
          countryCode?: string;
          image?: string;
          isSeller?: boolean;
          gender?: "MALE" | "FEMALE" | "OTHER";
          lastActiveAt?: string;
          emaratiStatus?: "PENDING" | "VERIFIED" | "REJECTED" | "NOT_SET";
          recentlyViewed?: Array<{
            adId: string;
            viewedAt: string;
            _id: string;
          }>;
        };

        const sessionUser: SessionUser = {
          _id: userData._id || userData.id || "",
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNo: userData.phoneNo,
          countryCode: userData.countryCode,
          status: userData.status || "CREATED",
          hashedPassword: userData.hashedPassword || "",
          emailVerified:
            userData.emailVerified ?? userData.verifyEmail ?? false,
          phoneVerified: userData.phoneVerified ?? false,
          role: userData.role || {},
          socialType: userData.socialType || "",
          documents: userData.documents || [],
          blockedReason: userData.blockedReason || [],
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString(),
          __v: userData.__v || 0,
          loggedIn: userData.loggedIn ?? true,
          deviceKey: userData.deviceKey || undefined,
          image: userData.image,
          isSeller: userData.isSeller,
          gender: userData.gender,
          lastActiveAt: userData.lastActiveAt,
          emaratiStatus: userData.emaratiStatus,
          recentlyViewed: userData.recentlyViewed,
        };

        // Store in Zustand state
        set({
          session: {
            user: sessionUser,
          },
          isAuthenticated: true,
        });

        // Set cookies using client-side CookieService
        CookieService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, accessToken, {
          maxAge: SESSION_MAX_AGE,
          path: "/",
          secure: true,
          sameSite: "lax",
        });
        CookieService.set(AUTH_TOKEN_NAMES.REFRESH_TOKEN, refreshToken, {
          maxAge: SESSION_MAX_AGE,
          path: "/",
          secure: true,
          sameSite: "lax",
        });
        CookieService.set(USER_ID_COOKIE, sessionUser._id, {
          maxAge: SESSION_MAX_AGE,
          path: "/",
          secure: true,
          sameSite: "lax",
        });
      },

      // Clear Session (Logout)
      clearSession: async () => {
        // Clear Zustand state
        set({
          session: initialSession,
          isAuthenticated: false,
        });

        // Clear subscriptions
        const { useSubscriptionStore } =
          await import("@/stores/subscriptionStore");
        useSubscriptionStore.getState().clearSubscriptions();

        // Clear cookies using client-side CookieService
        CookieService.remove(AUTH_TOKEN_NAMES.ACCESS_TOKEN, { path: "/" });
        CookieService.remove(AUTH_TOKEN_NAMES.REFRESH_TOKEN, { path: "/" });
        CookieService.remove(USER_ID_COOKIE, { path: "/" });
      },

      // Update User Data
      updateUser: (updatedUser) => {
        const currentSession = get().session;
        if (currentSession.user) {
          set({
            session: {
              ...currentSession,
              user: {
                ...currentSession.user,
                ...updatedUser,
              },
            },
          });
        }
      },

      // Refresh Tokens
      refreshTokens: async (accessToken, refreshToken) => {
        // Update cookie using client-side CookieService
        CookieService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, accessToken, {
          maxAge: SESSION_MAX_AGE,
          path: "/",
          secure: true,
          sameSite: "lax",
        });
        if (refreshToken) {
          CookieService.set(AUTH_TOKEN_NAMES.REFRESH_TOKEN, refreshToken, {
            maxAge: SESSION_MAX_AGE,
            path: "/",
            secure: true,
            sameSite: "lax",
          });
        }
      },
    }),
    {
      name: STORE_NAME,
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      onRehydrateStorage: () => (state) => {
        if (state?.session?.user?._id) {
          CookieService.set(USER_ID_COOKIE, state.session.user._id, {
            maxAge: SESSION_MAX_AGE,
            path: "/",
            secure: true,
            sameSite: "lax",
          });
        }
      },
      partialize: (state) => ({
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

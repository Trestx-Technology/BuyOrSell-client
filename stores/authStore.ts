import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LocalStorageService } from '@/services/local-storage';
import { CookieService } from '@/services/cookie-service';
import { AUTH_TOKEN_NAMES } from '@/constants/auth.constants';

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

export interface SessionUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
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
}

export interface AuthSession {
  accessToken: string | null;
  refreshToken: string | null;
  user: SessionUser | null;
}

export interface AuthStore {
  // Session State
  session: AuthSession;
  isAuthenticated: boolean;

  // Actions
  setSession: (accessToken: string, refreshToken: string, user: SessionUser) => Promise<void>;
  clearSession: () => Promise<void>;
  updateUser: (user: Partial<SessionUser>) => void;
  refreshTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const initialSession: AuthSession = {
  accessToken: null,
  refreshToken: null,
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
        const sessionUser: SessionUser = {
          _id: (user as SessionUser)._id || (user as { id?: string }).id || '',
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: (user as SessionUser).status || 'CREATED',
          hashedPassword: (user as SessionUser).hashedPassword || '',
          emailVerified: (user as SessionUser).emailVerified ?? (user as { verifyEmail?: boolean }).verifyEmail ?? false,
          phoneVerified: (user as SessionUser).phoneVerified ?? false,
          role: (user as SessionUser).role || {
            name: 'USER',
            description: 'User role',
            permissions: {},
            _id: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          socialType: (user as SessionUser).socialType || '',
          documents: (user as SessionUser).documents || [],
          blockedReason: (user as SessionUser).blockedReason || [],
          createdAt: (user as SessionUser).createdAt || new Date().toISOString(),
          updatedAt: (user as SessionUser).updatedAt || new Date().toISOString(),
          __v: (user as SessionUser).__v || 0,
          loggedIn: (user as SessionUser).loggedIn ?? true,
          deviceKey: (user as SessionUser).deviceKey || (user as { deviceKey?: string | null }).deviceKey || undefined,
        };

        // Store in Zustand state
        set({
          session: {
            accessToken,
            refreshToken,
            user: sessionUser,
          },
          isAuthenticated: true,
        });

        // Also store in localStorage for backward compatibility
        LocalStorageService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, accessToken);
        LocalStorageService.set(AUTH_TOKEN_NAMES.REFRESH_TOKEN, refreshToken);
        LocalStorageService.set('user', sessionUser);

        // Set cookie using client-side CookieService
        const maxAge = Number(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE) || 86400; // Default to 24 hours
        CookieService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, accessToken, {
          maxAge,
          path: '/',
          secure: true,
          sameSite: 'lax',
        });
      },

      // Clear Session (Logout)
      clearSession: async () => {
        // Clear Zustand state
        set({
          session: initialSession,
          isAuthenticated: false,
        });

        // Clear localStorage
        LocalStorageService.clear();

        // Clear cookie using client-side CookieService
        CookieService.remove(AUTH_TOKEN_NAMES.ACCESS_TOKEN, { path: '/' });
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
          
          // Also update localStorage
          LocalStorageService.set('user', {
            ...currentSession.user,
            ...updatedUser,
          });
        }
      },

      // Refresh Tokens
      refreshTokens: async (accessToken, refreshToken) => {
        const currentSession = get().session;
        
        set({
          session: {
            ...currentSession,
            accessToken,
            ...(refreshToken && { refreshToken }),
          },
        });

        // Update localStorage
        LocalStorageService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, accessToken);
        if (refreshToken) {
          LocalStorageService.set(AUTH_TOKEN_NAMES.REFRESH_TOKEN, refreshToken);
        }

        // Update cookie using client-side CookieService
        const maxAge = Number(process.env.NEXT_PUBLIC_COOKIE_MAX_AGE) || 86400; // Default to 24 hours
        CookieService.set(AUTH_TOKEN_NAMES.ACCESS_TOKEN, accessToken, {
          maxAge,
          path: '/',
          secure: true,
          sameSite: 'lax',
        });
      },
    }),
    {
      name: 'buyorsell-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);


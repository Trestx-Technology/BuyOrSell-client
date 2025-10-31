import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { setCookies, removeCookies } from '@/actions/cookies.action';
import { LocalStorageService } from '@/services/local-storage';

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
        LocalStorageService.set('dealdome_access_token', accessToken);
        LocalStorageService.set('refresh_token', refreshToken);
        LocalStorageService.set('user', sessionUser);

        // Set httpOnly cookie for server-side access
        await setCookies(accessToken);
      },

      // Clear Session (Logout)
      clearSession: async () => {
        // Clear Zustand state
        set({
          session: initialSession,
          isAuthenticated: false,
        });

        // Clear localStorage
        LocalStorageService.clear()

        // Clear httpOnly cookie
        await removeCookies();
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
        LocalStorageService.set('dealdome_access_token', accessToken);
        if (refreshToken) {
          LocalStorageService.set('refresh_token', refreshToken);
        }

        // Update httpOnly cookie
        await setCookies(accessToken);
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


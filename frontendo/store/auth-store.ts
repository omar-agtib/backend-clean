import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string; // ✅ Changed from _id to match backend
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  reset: () => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isHydrated: false,

      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      login: (user, token) => {
        console.log("🔐 Login - Setting auth state:", {
          user,
          token: token.substring(0, 20) + "...",
        });
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        console.log("🚪 Logout - Clearing auth state");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      reset: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // ✅ REMOVED isHydrated from here
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("💾 Auth store rehydrated:", {
            hasToken: !!state.token,
            hasUser: !!state.user,
            isAuthenticated: state.isAuthenticated,
          });
          state.isHydrated = true;
        }
      },
    },
  ),
);

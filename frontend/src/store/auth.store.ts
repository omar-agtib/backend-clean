// src/store/auth.store.ts
import { create } from "zustand";
import { token as tokenStore } from "../lib/token";
import { http } from "../lib/http";

export type AuthUser = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;

  isBootstrapping: boolean;

  setAuth: (payload: { token: string; user: AuthUser }) => void;
  setUser: (user: AuthUser | null) => void;

  logout: () => void;

  // Optional helper: fetch /auth/me if exists
  bootstrapFromToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: tokenStore.get(),
  user: null,

  isBootstrapping: false,

  setAuth: ({ token, user }) => {
    tokenStore.set(token);
    set({ token, user });
  },

  setUser: (user) => set({ user }),

  logout: () => {
    tokenStore.clear();
    set({ token: null, user: null });
  },

  bootstrapFromToken: async () => {
    const t = get().token || tokenStore.get();
    if (!t) return;

    set({ isBootstrapping: true });

    try {
      // ✅ If you have GET /api/auth/me this will work
      // If you DON'T have it, just don't call bootstrapFromToken() anywhere.
      const { data } = await http.get<AuthUser>("/auth/me");
      set({ user: data });
    } catch {
      // If token is invalid, cleanup
      tokenStore.clear();
      set({ token: null, user: null });
    } finally {
      set({ isBootstrapping: false });
    }
  },
}));

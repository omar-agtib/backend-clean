// src/store/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role?: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;

  setAuth: (p: { token: string; user: AuthUser }) => void;
  setUser: (user: AuthUser | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: ({ token, user }) => set({ token, user }),
      setUser: (user) => set({ user }),
      clear: () => set({ token: null, user: null }),
    }),
    {
      name: "chantier.auth",
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
);

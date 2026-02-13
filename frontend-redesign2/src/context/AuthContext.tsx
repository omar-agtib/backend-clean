import React, { createContext, useContext, useMemo } from "react";
import { token } from "../lib/token";
import { useMe } from "../features/auth/hooks/useMe";

type AuthUser = {
  _id: string;
  email: string;
  name: string;
  role: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthed: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useMe();

  const value = useMemo<AuthContextType>(() => {
    return {
      user: data ?? null,
      isLoading,
      isAuthed: !!token.get() && !!data,
      logout: () => token.clear(),
    };
  }, [data, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

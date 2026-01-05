// src/features/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/auth.api";
import { token as tokenStorage } from "../../../lib/token";
import { useAuthStore } from "../../../store/auth.store";

function normalizeJwt(t: string) {
  return (t || "").replace(/^Bearer\s+/i, "").trim();
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      const raw = normalizeJwt(res.accessToken);

      // ✅ store token in localStorage (source of truth)
      tokenStorage.set(raw);

      // ✅ store user + token in zustand
      setAuth({
        token: raw,
        user: {
          _id: res.user.id, // normalize to _id for app usage
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
        },
      });
    },
  });
}

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authStore } from "@/store/auth-store";
import { uiStore } from "@/store/ui-store";
import * as authApi from "@/lib/api/auth";

export function useAuth() {
  const store = authStore();
  const { addNotification } = uiStore();
  const [isReady, setIsReady] = useState(false);

  // Wait for zustand persist to hydrate
  useEffect(() => {
    setIsReady(store.isHydrated);
  }, [store.isHydrated]);

  // ---------------- Login ----------------
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      console.log("✅ Login API success:", data);
      // ✅ Use accessToken from backend
      store.login(data.user, data.accessToken);
      addNotification({ type: "success", message: "Logged in successfully" });
    },
    onError: (error: any) => {
      console.error("❌ Login API error:", error);
      const message = error.response?.data?.message || "Login failed";
      store.setError(message);
      addNotification({ type: "error", message });
    },
  });

  const login = useCallback(
    (email: string, password: string) => {
      store.setError(null);
      return new Promise<void>((resolve, reject) => {
        loginMutation.mutate(
          { email, password },
          {
            onSuccess: () => resolve(),
            onError: (err) => reject(err),
          },
        );
      });
    },
    [store, loginMutation],
  );

  // ---------------- Register ----------------
  const registerMutation = useMutation({
    mutationFn: ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => authApi.register(email, password, name),
    onSuccess: (data) => {
      console.log("✅ Register API success:", data);
      // ✅ Use accessToken from backend
      store.login(data.user, data.accessToken);
      addNotification({
        type: "success",
        message: "Account created successfully",
      });
    },
    onError: (error: any) => {
      console.error("❌ Register API error:", error);
      const message = error.response?.data?.message || "Registration failed";
      store.setError(message);
      addNotification({ type: "error", message });
    },
  });

  const register = useCallback(
    (email: string, password: string, name: string) => {
      store.setError(null);
      return new Promise<void>((resolve, reject) => {
        registerMutation.mutate(
          { email, password, name },
          {
            onSuccess: () => resolve(),
            onError: (err) => reject(err),
          },
        );
      });
    },
    [store, registerMutation],
  );

  // ---------------- Logout ----------------
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      store.logout();
      addNotification({ type: "success", message: "Logged out successfully" });
    },
    onError: () => {
      store.logout();
      addNotification({ type: "info", message: "Logged out" });
    },
  });

  const logout = useCallback(() => {
    return logoutMutation.mutate();
  }, [logoutMutation]);

  return {
    ...store,
    login,
    register,
    logout,
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
    isReady,
  };
}

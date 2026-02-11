// src/features/auth/hooks/useMe.ts
import { useQuery } from "@tanstack/react-query";
import { token } from "../../../lib/token";
import { authKeys } from "../api/authKeys";
import { meApi } from "../api/auth.api";
import { useAuthStore } from "../../../store/auth.store";

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: meApi,
    enabled: !!token.get(),
    retry: false,
    onSuccess: (user) => {
      setUser(user);
    },
    onError: () => {
      token.clear();
      clear();
    },
  });
}

// src/features/auth/hooks/useLogout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutApi } from "../api/auth.api";
import { useAuthStore } from "../../../store/auth.store";
import { authKeys } from "../api/authKeys";

export function useLogout() {
  const qc = useQueryClient();
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: logoutApi,
    onSettled: async () => {
      clear();
      await qc.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

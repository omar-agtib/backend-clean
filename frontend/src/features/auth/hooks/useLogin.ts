import { useMutation, useQueryClient } from "@tanstack/react-query";
import { token } from "../../../lib/token";
import { authKeys } from "../api/authKeys";
import { loginApi, type LoginDto } from "../api/auth.api";

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: LoginDto) => loginApi(dto),
    onSuccess: async (res) => {
      token.set(res.accessToken); // ← Changed from res.token to res.accessToken

      // Wait for next tick to ensure localStorage is flushed
      await new Promise((resolve) => setTimeout(resolve, 0));

      // refresh "me" after login
      await qc.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}

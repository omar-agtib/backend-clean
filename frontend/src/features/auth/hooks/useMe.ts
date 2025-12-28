import { useQuery } from "@tanstack/react-query";
import { token } from "../../../lib/token";
import { authKeys } from "../api/authKeys";
import { meApi } from "../api/auth.api";

export function useMe() {
  const hasToken = !!token.get();

  return useQuery({
    queryKey: authKeys.me(),
    queryFn: meApi,
    enabled: hasToken,
    retry: false,
  });
}

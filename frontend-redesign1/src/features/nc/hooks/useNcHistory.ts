// src/features/nc/hooks/useNcHistory.ts
import { useQuery } from "@tanstack/react-query";
import { getNcHistory } from "../api/ncHistory.api";
import { ncKeys } from "../api/ncKeys";

export function useNcHistory(ncId?: string | null, open?: boolean) {
  return useQuery({
    queryKey: ncId ? ncKeys.history(ncId) : ncKeys.all,
    queryFn: () => getNcHistory(ncId as string),
    enabled: !!ncId && !!open, // load only when modal open
  });
}

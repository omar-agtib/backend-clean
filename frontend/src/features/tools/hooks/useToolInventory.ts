// src/features/tools/hooks/useToolInventory.ts
import { useQuery } from "@tanstack/react-query";
import { listToolsApi } from "../api/tools.api";
import { toolKeys } from "../api/toolKeys";

export function useToolInventory() {
  return useQuery({
    queryKey: toolKeys.inventory(),
    queryFn: listToolsApi,
  });
}

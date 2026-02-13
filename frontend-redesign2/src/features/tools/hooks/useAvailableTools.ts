// src/features/tools/hooks/useAvailableTools.ts
import { useQuery } from "@tanstack/react-query";
import { listAvailableToolsApi } from "../api/tools.api";
import { toolKeys } from "../api/toolKeys";

export function useAvailableTools() {
  return useQuery({
    queryKey: toolKeys.available(),
    queryFn: listAvailableToolsApi,
  });
}

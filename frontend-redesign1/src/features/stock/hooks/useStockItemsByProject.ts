// src/features/stock/hooks/useStockItemsByProject.ts
import { useQuery } from "@tanstack/react-query";
import { listStockItemsByProject } from "../api/stock.api";
import { stockKeys } from "../api/stockKeys";

export function useStockItemsByProject(projectId?: string | null) {
  return useQuery({
    queryKey: projectId ? stockKeys.itemsByProject(projectId) : stockKeys.all,
    queryFn: () => listStockItemsByProject(projectId as string),
    enabled: !!projectId,
  });
}

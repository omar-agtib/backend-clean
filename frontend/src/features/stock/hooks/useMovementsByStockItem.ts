// src/features/stock/hooks/useMovementsByStockItem.ts
import { useQuery } from "@tanstack/react-query";
import { listMovementsByStockItem } from "../api/stock.api";
import { stockKeys } from "../api/stockKeys";

export function useMovementsByStockItem(stockItemId?: string | null) {
  return useQuery({
    queryKey: stockItemId
      ? stockKeys.movementsByItem(stockItemId)
      : stockKeys.all,
    queryFn: () => listMovementsByStockItem(stockItemId as string),
    enabled: !!stockItemId,
  });
}

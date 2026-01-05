// src/features/stock/hooks/useStockMovements.ts
import { useQuery } from "@tanstack/react-query";
import { listStockMovements } from "../api/stock.api";
import { stockKeys } from "../api/stockKeys";

export function useStockMovements(productId?: string | null) {
  return useQuery({
    queryKey: stockKeys.movements(productId),
    queryFn: () => listStockMovements({ productId }),
  });
}

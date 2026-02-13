// src/features/stock/hooks/useAdjustStock.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adjustStock, type AdjustStockDto } from "../api/stock.api";
import { stockKeys } from "../api/stockKeys";

export function useAdjustStock(projectId: string, stockItemId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: AdjustStockDto) => adjustStock(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: stockKeys.itemsByProject(projectId),
      });
      if (stockItemId) {
        await qc.invalidateQueries({
          queryKey: stockKeys.movementsByItem(stockItemId),
        });
      }
      await qc.invalidateQueries({
        queryKey: stockKeys.movementsByProject(projectId),
      });
    },
  });
}

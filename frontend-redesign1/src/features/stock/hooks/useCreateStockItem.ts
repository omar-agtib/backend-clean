// src/features/stock/hooks/useCreateStockItem.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStockItem, type CreateStockItemDto } from "../api/stock.api";
import { stockKeys } from "../api/stockKeys";

export function useCreateStockItem(projectId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateStockItemDto) => createStockItem(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: stockKeys.itemsByProject(projectId),
      });
    },
  });
}

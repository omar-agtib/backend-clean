// src/features/stock/hooks/useCreateStockMovement.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createStockMovement,
  type CreateStockMovementDto,
} from "../api/stock.api";
import { stockKeys } from "../api/stockKeys";

export function useCreateStockMovement(productId?: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateStockMovementDto) => createStockMovement(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: stockKeys.movements(productId) });
    },
  });
}

// src/features/stock/hooks/useCreateProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, type CreateProductDto } from "../api/products.api";
import { productKeys } from "../api/productKeys";

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProductDto) => createProduct(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
}

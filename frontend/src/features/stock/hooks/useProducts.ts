// src/features/stock/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "../api/products.api";
import { productKeys } from "../api/productKeys";

export function useProducts() {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: listProducts,
  });
}

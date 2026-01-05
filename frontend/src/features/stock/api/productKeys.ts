// src/features/stock/api/productKeys.ts
export const productKeys = {
  all: ["products"] as const,
  list: () => ["products", "list"] as const,
};

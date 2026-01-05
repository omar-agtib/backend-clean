// src/features/stock/api/stockKeys.ts
export const stockKeys = {
  all: ["stock"] as const,
  itemsByProject: (projectId: string) =>
    ["stock", "project", projectId, "items"] as const,
  movementsByProject: (projectId: string) =>
    ["stock", "project", projectId, "movements"] as const,
  oneItem: (stockItemId: string) => ["stock", "item", stockItemId] as const,
  movementsByItem: (stockItemId: string) =>
    ["stock", "item", stockItemId, "movements"] as const,
};

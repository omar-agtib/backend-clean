// src/features/nc/api/ncKeys.ts
export const ncKeys = {
  all: ["nc"] as const,
  project: (projectId: string) => ["nc", "project", projectId] as const,
  history: (ncId: string) => ["nc", "history", ncId] as const,
};

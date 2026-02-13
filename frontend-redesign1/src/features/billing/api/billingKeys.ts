// src/features/billing/api/billingKeys.ts
export const billingKeys = {
  all: ["billing"] as const,
  project: (projectId: string) =>
    [...billingKeys.all, "project", projectId] as const,
  list: (projectId: string) =>
    [...billingKeys.project(projectId), "list"] as const,
  summary: (projectId: string) =>
    [...billingKeys.project(projectId), "summary"] as const,
};

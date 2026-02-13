// src/features/progress/api/progressKeys.ts
export const progressKeys = {
  milestonesByProject: (projectId: string) =>
    ["progress", "milestones", "project", projectId] as const,

  summaryByProject: (projectId: string) =>
    ["progress", "summary", "project", projectId] as const,
};

// src/features/tools/api/toolKeys.ts
export const toolKeys = {
  all: ["tools"] as const,

  inventory: () => ["tools", "inventory"] as const,
  available: () => ["tools", "available"] as const,

  assignmentsByProject: (projectId: string) =>
    ["tools", "project", projectId, "assignments"] as const,

  activeAssignedByProject: (projectId: string) =>
    ["tools", "project", projectId, "assigned"] as const,

  maintenanceByProject: (projectId: string) =>
    ["tools", "project", projectId, "maintenance"] as const,
};

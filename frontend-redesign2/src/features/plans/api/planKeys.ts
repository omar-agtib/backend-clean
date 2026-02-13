export const planKeys = {
  all: ["plans"] as const,
  project: (projectId: string) => ["plans", "project", projectId] as const,
  one: (planId: string) => ["plans", "one", planId] as const,
  versions: (planId: string) => ["plans", "versions", planId] as const,
};

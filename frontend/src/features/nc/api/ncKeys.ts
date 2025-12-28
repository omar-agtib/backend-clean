export const ncKeys = {
  all: ["nc"] as const,
  project: (projectId: string) => ["nc", "project", projectId] as const,
  one: (ncId: string) => ["nc", "one", ncId] as const,
  history: (ncId: string) => ["nc", "history", ncId] as const,
};

export const dashboardKeys = {
  all: ["dashboard"] as const,

  overview: () => [...dashboardKeys.all, "overview"] as const,

  project: (projectId: string) =>
    [...dashboardKeys.all, "project", projectId] as const,
};

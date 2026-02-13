export const projectsKeys = {
  all: ["projects"] as const,
  mine: () => [...projectsKeys.all, "mine"] as const,
};

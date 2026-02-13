const KEY = "activeProjectId";

export const activeProject = {
  get(): string | null {
    return localStorage.getItem(KEY);
  },

  set(projectId: string) {
    localStorage.setItem(KEY, projectId);
  },

  clear() {
    localStorage.removeItem(KEY);
  },
};

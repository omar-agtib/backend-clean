import { create } from "zustand";
import { persist } from "zustand/middleware";

type ActiveProject = { id: string; name: string } | null;

type ProjectState = {
  activeProject: ActiveProject;
  activeProjectId: string | null;
  activeProjectName: string | null;

  setActiveProject: (p: { id: string; name: string }) => void;
  clearActiveProject: () => void;
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      activeProject: null,
      activeProjectId: null,
      activeProjectName: null,

      setActiveProject: (p) =>
        set({
          activeProject: p,
          activeProjectId: p.id,
          activeProjectName: p.name,
        }),

      clearActiveProject: () =>
        set({
          activeProject: null,
          activeProjectId: null,
          activeProjectName: null,
        }),
    }),
    {
      name: "chantier.activeProject",
      partialize: (s) => ({
        activeProject: s.activeProject,
        activeProjectId: s.activeProjectId,
        activeProjectName: s.activeProjectName,
      }),
    }
  )
);

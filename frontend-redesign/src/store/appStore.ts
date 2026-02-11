import { create } from "zustand";
import { persist } from "zustand/middleware";

type AppState = {
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeProjectId: null,
      setActiveProjectId: (id) => set({ activeProjectId: id }),
    }),
    { name: "chantier_app" }
  )
);

// src/store/toast.store.ts
import { create } from "zustand";

export type Toast = {
  id: string;
  title: string;
  message?: string;
  kind?: "info" | "success" | "error";
};

type ToastState = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) =>
    set((s) => {
      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
      return { toasts: [{ ...t, id }, ...s.toasts].slice(0, 4) };
    }),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

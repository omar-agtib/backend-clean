// src/components/ToastHost.tsx
import { useEffect } from "react";
import { useToastStore } from "../store/toast.store";

export default function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    const timers = toasts.map((t) =>
      window.setTimeout(() => remove(t.id), 3500)
    );
    return () => timers.forEach((x) => window.clearTimeout(x));
  }, [toasts, remove]);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 w-[360px] max-w-[92vw]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded-2xl border shadow-sm bg-white p-4",
            t.kind === "success"
              ? "border-emerald-200"
              : t.kind === "error"
              ? "border-red-200"
              : "border-slate-200",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-slate-900">{t.title}</div>
              {t.message ? (
                <div className="text-sm text-slate-600 mt-1">{t.message}</div>
              ) : null}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="rounded-xl px-2 py-1 text-sm bg-slate-100 hover:bg-slate-200"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

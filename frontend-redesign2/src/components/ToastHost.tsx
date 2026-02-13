import { useEffect } from "react";
import { useToastStore } from "../store/toast.store";

function kindBadge(kind?: "info" | "success" | "error") {
  if (kind === "success") return "success";
  if (kind === "error") return "danger";
  return "info";
}

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
    <div className="fixed right-4 top-4 z-[9999] grid gap-3 w-[min(420px,calc(100vw-2rem))]">
      {toasts.map((t) => (
        <div key={t.id} className="card p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="chip">{kindBadge(t.kind)}</span>
                <div className="text-sm font-extrabold truncate">{t.title}</div>
              </div>
              {t.message ? (
                <div className="text-sm text-mutedForeground mt-2 break-words">
                  {t.message}
                </div>
              ) : null}
            </div>

            <button
              onClick={() => remove(t.id)}
              className="btn-ghost px-3 py-2"
              aria-label="Close toast"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

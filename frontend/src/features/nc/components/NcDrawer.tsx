// src/features/nc/components/NcDrawer.tsx
import { useTranslation } from "react-i18next";
import { useNcHistory } from "../hooks/useNcHistory";
import type { Nc } from "../api/nc.api";

function Pill({ text }: { text: string }) {
  return (
    <span className="chip border border-border bg-muted text-foreground">
      {text}
    </span>
  );
}

function resolveAssignedLabel(nc: Nc) {
  const a = (nc as any)?.assignedTo;
  if (!a) return "—";

  if (typeof a === "object") return a.name || a.email || a._id || "—";
  if (typeof a === "string") return a;

  return "—";
}

export default function NcDrawer({
  open,
  nc,
  onClose,
  onAssignClick,
  onStatusClick,
}: {
  open: boolean;
  nc: Nc | null;
  onClose: () => void;
  onAssignClick: () => void;
  onStatusClick: () => void;
}) {
  const { t } = useTranslation();
  const history = useNcHistory(nc?._id, open);

  if (!open || !nc) return null;

  const assignedLabel = resolveAssignedLabel(nc);

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-card shadow-2xl border-l border-border p-6 overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-extrabold text-foreground truncate">
              {nc.title}
            </div>
            <div className="text-sm text-mutedForeground mt-1">
              {nc.description || t("nc.drawer.noDescription")}
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <Pill text={`${t("nc.drawer.status")}: ${nc.status}`} />
              <Pill text={`${t("nc.drawer.priority")}: ${nc.priority}`} />
              <Pill text={`${t("nc.drawer.assigned")}: ${assignedLabel}`} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost px-3 py-2"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 flex gap-2 flex-wrap">
          <button onClick={onAssignClick} className="btn-primary" type="button">
            {t("nc.drawer.assign")}
          </button>
          <button onClick={onStatusClick} className="btn-outline" type="button">
            {t("nc.drawer.changeStatus")}
          </button>
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <div className="text-sm font-extrabold text-foreground">
            {t("nc.drawer.history")}
          </div>

          {history.isLoading ? (
            <div className="mt-3 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-2xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : history.isError ? (
            <div className="mt-3 rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
              <div className="font-bold text-danger">{t("common.error")}</div>
              <div className="text-mutedForeground mt-1 break-words">
                {(history.error as any)?.response?.data?.message ||
                  (history.error as Error).message}
              </div>
            </div>
          ) : (history.data?.length || 0) === 0 ? (
            <div className="mt-3 text-sm text-mutedForeground">
              {t("nc.drawer.noHistory")}
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {history.data!.map((h) => {
                const actor =
                  typeof h.userId === "object" && h.userId
                    ? h.userId.name || h.userId.email || h.userId._id
                    : typeof h.userId === "string"
                    ? h.userId
                    : "—";

                return (
                  <div key={h._id} className="card p-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="font-extrabold text-foreground">
                        {h.action}
                      </div>
                      <div className="text-xs text-mutedForeground">
                        {new Date(h.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-1 text-sm text-mutedForeground">
                      {t("nc.drawer.by")}:{" "}
                      <span className="font-semibold text-foreground">
                        {actor}
                      </span>
                    </div>

                    {(h.fromStatus || h.toStatus) && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {h.fromStatus && (
                          <Pill
                            text={`${t("nc.drawer.from")}: ${h.fromStatus}`}
                          />
                        )}
                        {h.toStatus && (
                          <Pill text={`${t("nc.drawer.to")}: ${h.toStatus}`} />
                        )}
                      </div>
                    )}

                    {h.comment && (
                      <div className="mt-2 text-sm text-mutedForeground">
                        “{h.comment}”
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

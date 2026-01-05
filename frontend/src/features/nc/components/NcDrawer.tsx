// src/features/nc/components/NcDrawer.tsx
import { useNcHistory } from "../hooks/useNcHistory";
import type { Nc } from "../api/nc.api";

function Pill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border bg-slate-50 border-slate-200 text-slate-700">
      {text}
    </span>
  );
}

function resolveAssignedLabel(nc: Nc) {
  const a = (nc as any)?.assignedTo;

  if (!a) return "—";

  // populated object
  if (typeof a === "object") {
    return a.name || a.email || a._id || "—";
  }

  // fallback string id
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
  const history = useNcHistory(nc?._id, open);

  if (!open || !nc) return null;

  const assignedLabel = resolveAssignedLabel(nc);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl border-l border-slate-200 p-6 overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-extrabold text-slate-900 truncate">
              {nc.title}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              {nc.description || "No description"}
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Pill text={`Status: ${nc.status}`} />
              <Pill text={`Priority: ${nc.priority}`} />
              <Pill text={`Assigned: ${assignedLabel}`} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
          >
            Close
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onAssignClick}
            className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white"
          >
            Assign
          </button>
          <button
            onClick={onStatusClick}
            className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
          >
            Change Status
          </button>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <div className="text-sm font-bold text-slate-900">History</div>

          {history.isLoading ? (
            <div className="mt-3 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : history.isError ? (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {(history.error as any)?.response?.data?.message ||
                (history.error as Error).message}
            </div>
          ) : (history.data?.length || 0) === 0 ? (
            <div className="mt-3 text-sm text-slate-600">No history yet.</div>
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
                  <div
                    key={h._id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-900">
                        {h.action}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(h.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-1 text-sm text-slate-700">
                      By: <span className="font-medium">{actor}</span>
                    </div>

                    {(h.fromStatus || h.toStatus) && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {h.fromStatus && (
                          <Pill text={`From: ${h.fromStatus}`} />
                        )}
                        {h.toStatus && <Pill text={`To: ${h.toStatus}`} />}
                      </div>
                    )}

                    {h.comment && (
                      <div className="mt-2 text-sm text-slate-600">
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

// src/features/nc/components/NcHistoryModal.tsx
import { useNcHistory } from "../hooks/useNcHistory";
import type { NcHistoryItem } from "../api/ncHistory.api";

function actionLabel(a: NcHistoryItem["action"]) {
  switch (a) {
    case "CREATED":
      return "Created";
    case "ASSIGNED":
      return "Assigned";
    case "STATUS_CHANGED":
      return "Status changed";
    case "RESOLVED":
      return "Resolved";
    case "VALIDATED":
      return "Validated";
    case "REJECTED":
      return "Rejected";
    default:
      return a;
  }
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function who(u: NcHistoryItem["userId"]) {
  if (!u) return "—";
  if (typeof u === "string") return u;
  return u.name || u.email || u._id;
}

export default function NcHistoryModal({
  ncId,
  title,
  open,
  onClose,
}: {
  ncId: string | null;
  title?: string;
  open: boolean;
  onClose: () => void;
}) {
  const q = useNcHistory(ncId, open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-xl">
        <div className="p-5 border-b border-slate-200 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-extrabold text-slate-900 truncate">
              History
            </div>
            <div className="text-sm text-slate-500 truncate">
              {title ? `NC · ${title}` : ncId}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
          >
            Close
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-auto">
          {q.isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          )}

          {q.isError && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {(q.error as any)?.response?.data?.message ||
                (q.error as Error).message}
            </div>
          )}

          {q.data && q.data.length === 0 && (
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
              <div className="font-semibold text-slate-900">No history yet</div>
              <div className="text-sm text-slate-600 mt-1">
                Actions will appear here as the NC changes.
              </div>
            </div>
          )}

          {q.data && q.data.length > 0 && (
            <div className="space-y-3">
              {q.data.map((h, idx) => (
                <div key={h._id} className="flex gap-3">
                  {/* timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-slate-900 mt-2" />
                    {idx !== q.data!.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 my-2" />
                    )}
                  </div>

                  <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-slate-900">
                        {actionLabel(h.action)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {fmtDate(h.createdAt)}
                      </div>
                    </div>

                    <div className="text-sm text-slate-700 mt-1">
                      <span className="text-slate-500">By:</span>{" "}
                      <span className="font-medium">{who(h.userId)}</span>
                    </div>

                    {(h.fromStatus || h.toStatus) && (
                      <div className="text-sm text-slate-700 mt-1">
                        <span className="text-slate-500">Status:</span>{" "}
                        <span className="font-medium">
                          {h.fromStatus || "—"}
                        </span>{" "}
                        →{" "}
                        <span className="font-medium">{h.toStatus || "—"}</span>
                      </div>
                    )}

                    {h.comment && (
                      <div className="mt-2 text-sm text-slate-700 rounded-xl bg-slate-50 border border-slate-200 p-3">
                        {h.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => q.refetch()}
            className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

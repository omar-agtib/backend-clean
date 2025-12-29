// src/features/nc/components/NcCard.tsx
import type { Nc } from "../api/nc.api";

function badge(status: string) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border";
  if (status === "OPEN") return `${base} bg-red-50 border-red-200 text-red-800`;
  if (status === "IN_PROGRESS")
    return `${base} bg-amber-50 border-amber-200 text-amber-800`;
  if (status === "RESOLVED")
    return `${base} bg-blue-50 border-blue-200 text-blue-800`;
  if (status === "VALIDATED")
    return `${base} bg-emerald-50 border-emerald-200 text-emerald-800`;
  return `${base} bg-slate-50 border-slate-200 text-slate-800`;
}

export default function NcCard({
  nc,
  onOpen,
  assignedLabel,
}: {
  nc: Nc;
  onOpen: () => void;
  assignedLabel?: string;
}) {
  return (
    <button
      onClick={onOpen}
      className="text-left w-full rounded-2xl bg-white border border-slate-200 shadow-sm p-4 hover:border-slate-300 hover:shadow transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 truncate">
            {nc.title}
          </div>
          <div className="text-sm text-slate-600 mt-1 line-clamp-2">
            {nc.description || "No description"}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-2">
          <span className={badge(nc.status)}>{nc.status}</span>
          <div className="text-xs text-slate-500">{nc.priority}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div>
          Assigned:{" "}
          <span className="text-slate-700 font-medium">
            {assignedLabel || "—"}
          </span>
        </div>
        <div>{new Date(nc.updatedAt).toLocaleString()}</div>
      </div>
    </button>
  );
}

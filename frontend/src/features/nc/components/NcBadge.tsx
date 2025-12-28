import type { NcPriority, NcStatus } from "../api/nc.api";

export function NcStatusBadge({ status }: { status: NcStatus }) {
  const cls =
    status === "OPEN"
      ? "bg-red-50 text-red-700 border-red-200"
      : status === "IN_PROGRESS"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : status === "RESOLVED"
      ? "bg-blue-50 text-blue-800 border-blue-200"
      : "bg-emerald-50 text-emerald-800 border-emerald-200";

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-lg border ${cls}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function NcPriorityBadge({ priority }: { priority: NcPriority }) {
  const cls =
    priority === "LOW"
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : priority === "MEDIUM"
      ? "bg-indigo-50 text-indigo-800 border-indigo-200"
      : priority === "HIGH"
      ? "bg-orange-50 text-orange-800 border-orange-200"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-lg border ${cls}`}
    >
      {priority}
    </span>
  );
}

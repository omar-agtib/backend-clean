// src/features/nc/components/NcBadge.tsx
import type { NcPriority, NcStatus } from "../api/nc.api";

export function StatusBadge({ status }: { status: NcStatus }) {
  const cls =
    status === "OPEN"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : status === "IN_PROGRESS"
      ? "bg-blue-50 text-blue-800 border-blue-200"
      : status === "RESOLVED"
      ? "bg-purple-50 text-purple-800 border-purple-200"
      : "bg-emerald-50 text-emerald-800 border-emerald-200";

  const label =
    status === "IN_PROGRESS" ? "IN PROGRESS" : status.replace("_", " ");

  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-lg border ${cls}`}
    >
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: NcPriority }) {
  const cls =
    priority === "LOW"
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : priority === "MEDIUM"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : priority === "HIGH"
      ? "bg-orange-50 text-orange-800 border-orange-200"
      : "bg-red-50 text-red-800 border-red-200";

  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-lg border ${cls}`}
    >
      {priority}
    </span>
  );
}

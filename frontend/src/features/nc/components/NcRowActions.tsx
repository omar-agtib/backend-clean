import { useState } from "react";
import type { NC, NcStatus } from "../api/nc.api";

const nextStatuses: Record<NcStatus, NcStatus[]> = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["VALIDATED", "IN_PROGRESS"],
  VALIDATED: [],
};

export default function NcRowActions({
  nc,
  onAssign,
  onStatus,
  busy,
}: {
  nc: NC;
  onAssign: (assignedTo: string) => void;
  onStatus: (status: NcStatus, comment?: string) => void;
  busy?: boolean;
}) {
  const [assigneeId, setAssigneeId] = useState("");
  const [comment, setComment] = useState("");

  const statusChoices = nextStatuses[nc.status] || [];

  return (
    <div className="space-y-2">
      {/* Assign */}
      <div className="flex items-center gap-2">
        <input
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          placeholder="assignedTo userId"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
        <button
          onClick={() => assigneeId.trim() && onAssign(assigneeId.trim())}
          disabled={busy || !assigneeId.trim()}
          className="shrink-0 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm font-semibold disabled:opacity-60"
        >
          Assign
        </button>
      </div>

      {/* Status */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="comment (optional)"
          className="flex-1 min-w-[220px] rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />

        {statusChoices.length === 0 ? (
          <span className="text-sm text-slate-500">No further actions</span>
        ) : (
          statusChoices.map((s) => (
            <button
              key={s}
              onClick={() => onStatus(s, comment.trim() || undefined)}
              disabled={busy}
              className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
            >
              Set {s.replace("_", " ")}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// src/features/nc/components/NcAssignModal.tsx
import { useMemo, useState } from "react";
import type { ProjectMember } from "../../projects/hooks/useProjectMembers";

export default function NcAssignModal({
  open,
  onClose,
  members,
  onAssign,
  isPending,
  errorMessage,
}: {
  open: boolean;
  onClose: () => void;
  members: ProjectMember[];
  onAssign: (userId: string) => void;
  isPending?: boolean;
  errorMessage?: string;
}) {
  const [selected, setSelected] = useState("");

  const canAssign = useMemo(() => !!selected, [selected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Assign NC
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Pick a member (shows userId + role for now)
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Member</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="">Select member...</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.userId} — {m.role}
                </option>
              ))}
            </select>
          </div>

          {errorMessage ? (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={() => onAssign(selected)}
              disabled={!canAssign || isPending}
              className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
            >
              {isPending ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

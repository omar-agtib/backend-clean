// src/features/nc/components/NcStatusModal.tsx
import { useMemo, useState } from "react";
import type { NcStatus } from "../api/nc.api";

export default function NcStatusModal({
  open,
  onClose,
  current,
  onChange,
  isPending,
  errorMessage,
}: {
  open: boolean;
  onClose: () => void;
  current: NcStatus;
  onChange: (status: NcStatus, comment?: string) => void;
  isPending?: boolean;
  errorMessage?: string;
}) {
  const [status, setStatus] = useState<NcStatus>(current);
  const [comment, setComment] = useState("");

  const canSubmit = useMemo(() => !!status, [status]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Change Status
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Allowed transitions are enforced by backend
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
            <label className="text-sm font-medium text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as NcStatus)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="VALIDATED">VALIDATED</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 w-full min-h-[90px] rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Reason / note..."
            />
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
              onClick={() => onChange(status, comment.trim() || undefined)}
              disabled={!canSubmit || isPending}
              className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

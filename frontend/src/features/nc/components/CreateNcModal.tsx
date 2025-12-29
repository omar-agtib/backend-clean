// src/features/nc/components/NcCreateModal.tsx
import { useMemo, useState } from "react";
import type { NcPriority } from "../api/nc.api";

export default function NcCreateModal({
  open,
  onClose,
  onCreate,
  isPending,
  errorMessage,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (p: {
    title: string;
    description?: string;
    priority?: NcPriority;
  }) => void;
  isPending?: boolean;
  errorMessage?: string;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<NcPriority>("MEDIUM");

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-extrabold text-slate-900">New NC</div>
            <div className="text-sm text-slate-500 mt-1">
              Create a non-conformity item
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
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Ex: Wrong material delivered"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full min-h-[90px] rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="More context..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as NcPriority)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
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
              onClick={() =>
                onCreate({
                  title: title.trim(),
                  description: description.trim() || undefined,
                  priority,
                })
              }
              disabled={!canSubmit || isPending}
              className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

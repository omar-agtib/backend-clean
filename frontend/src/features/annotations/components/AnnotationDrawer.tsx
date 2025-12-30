// src/features/annotations/components/AnnotationDrawer.tsx
import { useEffect, useMemo, useState } from "react";
import type { Annotation } from "../api/annotations.api";

export default function AnnotationDrawer({
  open,
  annotation,
  onClose,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  errorMessage,
}: {
  open: boolean;
  annotation: Annotation | null;
  onClose: () => void;
  onSave: (content: string) => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  errorMessage?: string;
}) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (open && annotation) setContent(annotation.content || "");
  }, [open, annotation]);

  const title = useMemo(() => {
    if (!annotation) return "Pin";
    const p = (annotation.geometry as any)?.page;
    return p ? `Pin (page ${p})` : "Pin";
  }, [annotation]);

  if (!open || !annotation) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white border-l border-slate-200 shadow-xl p-5 overflow-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold text-slate-900">{title}</div>
            <div className="text-xs text-slate-500 mt-1">
              Edit note, save or delete.
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-900"
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Note (optional)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 w-full min-h-[120px] rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Write something…"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-60"
              type="button"
              title="Delete pin"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>

            <button
              onClick={() => onSave(content)}
              disabled={isSaving}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              type="button"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

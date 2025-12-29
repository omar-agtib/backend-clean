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

  // ✅ actions injected from PlanPreview (so drawer stays dumb)
  onSave: (nextContent: string) => void;
  onDelete: () => void;

  isSaving?: boolean;
  isDeleting?: boolean;
  errorMessage?: string | null;
}) {
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(annotation?.content ? String(annotation.content) : "");
  }, [annotation?._id]);

  const geom: any = annotation?.geometry || {};

  const canSave = useMemo(() => {
    if (!annotation) return false;
    const current = annotation.content ? String(annotation.content) : "";
    return content.trim() !== current.trim();
  }, [annotation, content]);

  if (!open || !annotation) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative h-full w-full max-w-md bg-white border-l border-slate-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Annotation
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {annotation.type} ·{" "}
              {new Date(annotation.createdAt).toLocaleString()}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Content editor */}
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500">Content</div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-2 w-full min-h-[120px] rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Write note..."
            />

            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                onClick={() => onDelete()}
                disabled={!!isDeleting}
                className="rounded-xl px-4 py-2 text-sm font-semibold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 disabled:opacity-60"
                type="button"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>

              <button
                onClick={() => onSave(content)}
                disabled={!canSave || !!isSaving}
                className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
                type="button"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>

            {errorMessage ? (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {!errorMessage ? (
              <div className="mt-3 text-xs text-slate-400">
                Tip: drag pin to move · right click pin to delete
              </div>
            ) : null}
          </div>

          {/* Geometry info */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-500">Position</div>
            <div className="mt-2 text-sm text-slate-900">
              page: <span className="font-semibold">{geom.page ?? "?"}</span>
              <br />
              x: <span className="font-semibold">{fmt(geom.xPct)}</span>
              <br />
              y: <span className="font-semibold">{fmt(geom.yPct)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function fmt(v: any) {
  if (typeof v !== "number") return "—";
  return (v * 100).toFixed(1) + "%";
}

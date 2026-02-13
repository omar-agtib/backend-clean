import type { Annotation } from "../../annotations/api/annotations.api";

export default function AnnotationDrawer({
  open,
  annotation,
  onClose,
}: {
  open: boolean;
  annotation: Annotation | null;
  onClose: () => void;
}) {
  if (!open || !annotation) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl border-l border-slate-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Annotation
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Page {annotation.page} · x={annotation.x.toFixed(2)} y=
              {annotation.y.toFixed(2)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="text-sm font-semibold text-slate-900">
            {annotation.title || "No title"}
          </div>
          <div className="text-sm text-slate-600 whitespace-pre-wrap">
            {annotation.message || "No message"}
          </div>

          <div className="pt-3 text-xs text-slate-400">
            Created: {new Date(annotation.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

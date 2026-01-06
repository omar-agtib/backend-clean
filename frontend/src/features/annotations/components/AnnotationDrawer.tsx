// src/features/annotations/components/AnnotationDrawer.tsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (open && annotation) setContent(annotation.content || "");
  }, [open, annotation]);

  const title = useMemo(() => {
    if (!annotation) return t("annotations.drawer.pin");
    const p = (annotation.geometry as any)?.page;
    return p
      ? t("annotations.drawer.pinWithPage", { n: p })
      : t("annotations.drawer.pin");
  }, [annotation, t]);

  if (!open || !annotation) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl p-5 overflow-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-extrabold text-foreground">
              {title}
            </div>
            <div className="text-xs text-mutedForeground mt-1">
              {t("annotations.drawer.subtitle")}
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-ghost px-3 py-2"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground">
              {t("annotations.drawer.note")}
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input mt-2 min-h-[140px]"
              placeholder={t("annotations.drawer.notePh")}
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
              <div className="font-bold text-danger">{t("common.error")}</div>
              <div className="text-mutedForeground mt-1 break-words">
                {errorMessage}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="btn-danger disabled:opacity-60"
              type="button"
              title={t("annotations.drawer.deleteTitle")}
            >
              {isDeleting
                ? t("annotations.drawer.deleting")
                : t("common.delete")}
            </button>

            <button
              onClick={() => onSave(content)}
              disabled={isSaving}
              className="btn-primary disabled:opacity-60"
              type="button"
            >
              {isSaving ? t("annotations.drawer.saving") : t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

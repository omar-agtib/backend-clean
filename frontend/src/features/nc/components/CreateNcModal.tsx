// src/features/nc/components/NcCreateModal.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<NcPriority>("MEDIUM");

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-lg card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-extrabold">{t("nc.create.title")}</div>
            <div className="text-sm text-mutedForeground mt-1">
              {t("nc.create.subtitle")}
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

        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm font-semibold">
              {t("nc.create.fields.title")}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input mt-2"
              placeholder={t("nc.create.fields.titlePh")}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              {t("nc.create.fields.description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input mt-2 min-h-[110px]"
              placeholder={t("nc.create.fields.descriptionPh")}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              {t("nc.create.fields.priority")}
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as NcPriority)}
              className="input mt-2 bg-card"
            >
              <option value="LOW">{t("nc.priority.LOW")}</option>
              <option value="MEDIUM">{t("nc.priority.MEDIUM")}</option>
              <option value="HIGH">{t("nc.priority.HIGH")}</option>
              <option value="CRITICAL">{t("nc.priority.CRITICAL")}</option>
            </select>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
              <div className="font-bold text-danger">{t("common.error")}</div>
              <div className="text-mutedForeground mt-1 break-words">
                {errorMessage}
              </div>
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="btn-outline" type="button">
              {t("common.cancel")}
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
              className="btn-primary disabled:opacity-60"
              type="button"
            >
              {isPending ? t("nc.create.creating") : t("nc.create.create")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/features/nc/components/NcStatusModal.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const [status, setStatus] = useState<NcStatus>(current);
  const [comment, setComment] = useState("");

  const canSubmit = useMemo(() => !!status, [status]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-lg card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-extrabold">{t("nc.status.title")}</div>
            <div className="text-sm text-mutedForeground mt-1">
              {t("nc.status.subtitle")}
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
              {t("nc.status.field")}
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as NcStatus)}
              className="input mt-2 bg-card"
            >
              <option value="OPEN">{t("nc.status.values.OPEN")}</option>
              <option value="IN_PROGRESS">
                {t("nc.status.values.IN_PROGRESS")}
              </option>
              <option value="RESOLVED">{t("nc.status.values.RESOLVED")}</option>
              <option value="VALIDATED">
                {t("nc.status.values.VALIDATED")}
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">
              {t("nc.status.comment")}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input mt-2 min-h-[110px]"
              placeholder={t("nc.status.commentPh")}
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

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="btn-outline" type="button">
              {t("common.cancel")}
            </button>
            <button
              onClick={() => onChange(status, comment.trim() || undefined)}
              disabled={!canSubmit || isPending}
              className="btn-primary disabled:opacity-60"
              type="button"
            >
              {isPending ? t("nc.status.saving") : t("nc.status.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

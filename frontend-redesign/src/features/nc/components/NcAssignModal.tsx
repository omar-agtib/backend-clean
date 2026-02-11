// src/features/nc/components/NcAssignModal.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type MemberForSelect = {
  userId: string;
  label: string;
  role: string;
};

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
  members: MemberForSelect[];
  onAssign: (userId: string) => void;
  isPending?: boolean;
  errorMessage?: string;
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("");

  const canAssign = useMemo(() => !!selected, [selected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-lg card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-extrabold">{t("nc.assign.title")}</div>
            <div className="text-sm text-mutedForeground mt-1">
              {t("nc.assign.subtitle")}
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
              {t("nc.assign.member")}
            </label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="input mt-2 bg-card"
            >
              <option value="">{t("nc.assign.selectMember")}</option>
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.label} — {m.role}
                </option>
              ))}
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
              onClick={() => onAssign(selected)}
              disabled={!canAssign || isPending}
              className="btn-primary disabled:opacity-60"
              type="button"
            >
              {isPending ? t("nc.assign.assigning") : t("nc.assign.assign")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

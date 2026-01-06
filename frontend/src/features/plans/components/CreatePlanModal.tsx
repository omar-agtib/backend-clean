import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CreatePlanModal({
  projectId,
  onClose,
  onCreate,
  isPending,
  errorMessage,
}: {
  projectId: string;
  onClose: () => void;
  onCreate: (dto: {
    projectId: string;
    name: string;
    description?: string;
  }) => void;
  isPending: boolean;
  errorMessage?: string | null;
}) {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = useMemo(() => !!name.trim(), [name]);

  function submit() {
    if (!canSubmit) return;
    onCreate({
      projectId,
      name: name.trim(),
      description: description.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-extrabold">
              {t("plans.modal.createTitle")}
            </div>
            <div className="text-sm text-mutedForeground mt-1">
              {t("plans.modal.createSubtitle")}
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
              {t("plans.modal.name")}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input mt-2"
              placeholder={t("plans.modal.namePh")}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">
              {t("plans.modal.description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input mt-2 min-h-[110px]"
              placeholder={t("plans.modal.descriptionPh")}
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
              onClick={submit}
              disabled={!canSubmit || isPending}
              className="btn-primary disabled:opacity-60"
              type="button"
            >
              {isPending ? t("plans.modal.creating") : t("plans.modal.create")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/features/stock/components/CreateProductModal.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CreateProductModal({
  onClose,
  onCreate,
  isPending,
  errorMessage,
}: {
  onClose: () => void;
  onCreate: (dto: { name: string; sku?: string; unit?: string }) => void;
  isPending: boolean;
  errorMessage: string | null;
}) {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("");

  const canSubmit = useMemo(
    () => name.trim().length >= 2 && !isPending,
    [name, isPending]
  );

  function submit() {
    if (!canSubmit) return;
    onCreate({
      name: name.trim(),
      sku: sku.trim() || undefined,
      unit: unit.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-extrabold">
              {t("stock.modal.productTitle")}
            </div>
            <div className="text-sm text-mutedForeground mt-1">
              {t("stock.modal.productSubtitle")}
            </div>
          </div>
          <button
            className="btn-ghost px-3 py-2"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm font-semibold">
              {t("stock.modal.name")}
            </label>
            <input
              className="input mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("stock.modal.namePh")}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">
                {t("stock.modal.sku")}
              </label>
              <input
                className="input mt-2"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder={t("stock.modal.skuPh")}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                {t("stock.modal.unit")}
              </label>
              <input
                className="input mt-2"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder={t("stock.modal.unitPh")}
              />
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
              <div className="font-bold text-danger">{t("common.error")}</div>
              <div className="text-mutedForeground mt-1 break-words">
                {errorMessage}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2">
            <button className="btn-outline" onClick={onClose} type="button">
              {t("common.cancel")}
            </button>
            <button
              className="btn-primary"
              onClick={submit}
              disabled={!canSubmit}
              type="button"
            >
              {isPending ? t("stock.modal.creating") : t("stock.modal.create")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

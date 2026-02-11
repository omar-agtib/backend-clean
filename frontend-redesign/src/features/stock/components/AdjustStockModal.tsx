// src/features/stock/components/AdjustStockModal.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function AdjustStockModal({
  onClose,
  onSave,
  isPending,
  errorMessage,
}: {
  onClose: () => void;
  onSave: (dto: {
    type: "IN" | "OUT";
    quantity: number;
    reason?: string;
  }) => void;
  isPending: boolean;
  errorMessage: string | null;
}) {
  const { t } = useTranslation();

  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState<string>("1");
  const [reason, setReason] = useState("");

  const qtyNumber = Number(quantity);

  const canSubmit = useMemo(
    () => !isPending && qtyNumber > 0 && Number.isFinite(qtyNumber),
    [isPending, qtyNumber]
  );

  function submit() {
    if (!canSubmit) return;
    onSave({
      type,
      quantity: qtyNumber,
      reason: reason.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-extrabold">
              {t("stock.modal.adjustTitle")}
            </div>
            <div className="text-sm text-mutedForeground mt-1">
              {t("stock.modal.adjustSubtitle")}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">
                {t("stock.modal.type")}
              </label>
              <select
                className="input mt-2"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="IN">{t("stock.in")}</option>
                <option value="OUT">{t("stock.out")}</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">
                {t("stock.modal.quantity")}
              </label>
              <input
                className="input mt-2"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                min={1}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">
              {t("stock.modal.reason")}
            </label>
            <input
              className="input mt-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("stock.modal.reasonPh")}
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
              {isPending ? t("stock.modal.saving") : t("stock.modal.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

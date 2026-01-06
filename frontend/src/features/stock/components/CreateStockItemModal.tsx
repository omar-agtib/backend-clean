// src/features/stock/components/CreateStockItemModal.tsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Product } from "../api/products.api";

export default function CreateStockItemModal({
  products,
  onClose,
  onCreate,
  isPending,
  errorMessage,
}: {
  products: Product[];
  onClose: () => void;
  onCreate: (dto: {
    productId: string;
    quantity?: number;
    location?: string;
  }) => void;
  isPending: boolean;
  errorMessage: string | null;
}) {
  const { t } = useTranslation();

  const [productId, setProductId] = useState(products[0]?._id || "");
  const [quantity, setQuantity] = useState<string>("0");
  const [location, setLocation] = useState("");

  const canSubmit = useMemo(
    () => !!productId && !isPending,
    [productId, isPending]
  );

  function submit() {
    if (!canSubmit) return;

    const q = Number(quantity);
    onCreate({
      productId,
      quantity: q > 0 ? q : undefined,
      location: location.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-extrabold">
              {t("stock.modal.itemTitle")}
            </div>
            <div className="text-sm text-mutedForeground mt-1">
              {t("stock.modal.itemSubtitle")}
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
              {t("stock.modal.product")}
            </label>
            <select
              className="input mt-2"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold">
                {t("stock.modal.quantity")}
              </label>
              <input
                className="input mt-2"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                min={0}
              />
            </div>

            <div>
              <label className="text-sm font-semibold">
                {t("stock.modal.location")}
              </label>
              <input
                className="input mt-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("stock.modal.locationPh")}
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

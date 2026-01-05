// src/features/stock/components/CreateStockItemModal.tsx
import { useMemo, useState } from "react";
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
  errorMessage?: string | null;
}) {
  const [productId, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [location, setLocation] = useState("");

  const canSubmit = useMemo(() => !!productId, [productId]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Add Stock Item
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Create a stock item inside this project
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

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Product
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Quantity (optional)
              </label>
              <input
                type="number"
                min={0}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Location (optional)
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Container A / Floor 1 ..."
              />
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!canSubmit || isPending}
              className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
              type="button"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

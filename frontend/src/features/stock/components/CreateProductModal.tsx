// src/features/stock/components/CreateProductModal.tsx
import { useMemo, useState } from "react";

export default function CreateProductModal({
  onClose,
  onCreate,
  isPending,
  errorMessage,
}: {
  onClose: () => void;
  onCreate: (dto: { name: string; sku?: string; unit?: string }) => void;
  isPending: boolean;
  errorMessage?: string | null;
}) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState("");

  const canSubmit = useMemo(() => !!name.trim(), [name]);

  function submit() {
    if (!canSubmit) return;
    onCreate({
      name: name.trim(),
      sku: sku.trim() || undefined,
      unit: unit.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Create Product
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Add a product to your stock catalog
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
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Cement 50kg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                SKU (optional)
              </label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="CEM-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Unit (optional)
              </label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="bag"
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

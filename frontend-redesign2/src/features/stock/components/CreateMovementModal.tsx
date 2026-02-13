// src/features/stock/components/CreateMovementModal.tsx
import { useMemo, useState } from "react";
import type { StockMovementType } from "../api/stock.api";

export default function CreateMovementModal({
  productName,
  onClose,
  onCreate,
  isPending,
  errorMessage,
}: {
  productName: string;
  onClose: () => void;
  onCreate: (dto: {
    type: StockMovementType;
    quantity: number;
    note?: string;
  }) => void;
  isPending: boolean;
  errorMessage?: string | null;
}) {
  const [type, setType] = useState<StockMovementType>("IN");
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState("");

  const canSubmit = useMemo(
    () => quantity > 0 && Number.isFinite(quantity),
    [quantity]
  );

  function submit() {
    if (!canSubmit) return;
    onCreate({
      type,
      quantity: Number(quantity),
      note: note.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Add Movement
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Product:{" "}
              <span className="font-semibold text-slate-900">
                {productName}
              </span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as StockMovementType)}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
                <option value="ADJUST">ADJUST</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                min={1}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full min-h-[90px] rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Supplier delivery / site usage / correction..."
            />
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
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

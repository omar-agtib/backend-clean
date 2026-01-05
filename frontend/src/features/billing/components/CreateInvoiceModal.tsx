// src/features/billing/components/CreateInvoiceModal.tsx
import { useMemo, useState } from "react";

export default function CreateInvoiceModal({
  open,
  onClose,
  onCreate,
  isPending,
  errorMessage,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (amount: number) => void;
  isPending?: boolean;
  errorMessage?: string | null;
}) {
  const [amount, setAmount] = useState<string>("");

  const amountNumber = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  const valid = Number.isFinite(amountNumber) && amountNumber > 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              Create Invoice
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Enter amount (MAD / EUR / USD — your choice)
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
            <label className="text-sm font-medium text-slate-700">Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="e.g. 15000"
              inputMode="decimal"
            />
            <div className="mt-1 text-xs text-slate-500">
              Must be a number &gt; 0
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
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              onClick={() => valid && onCreate(amountNumber)}
              disabled={!valid || isPending}
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

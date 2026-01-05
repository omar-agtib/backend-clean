// src/pages/BillingPage.tsx
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import EmptyState from "../components/EmptyState";
import { useProjectStore } from "../store/projectStore";

import { useBillingSummary } from "../features/billing/hooks/useBillingSummary";
import { useInvoicesByProject } from "../features/billing/hooks/useInvoicesByProject";
import { useCreateInvoice } from "../features/billing/hooks/useCreateInvoice";
import { usePayInvoice } from "../features/billing/hooks/usePayInvoice";
import { useCancelInvoice } from "../features/billing/hooks/useCancelInvoice";
import type { Invoice } from "../features/billing/api/billing.api";

function money(n: number) {
  // simple, no currency assumptions
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
    n
  );
}

function statusPill(status: Invoice["status"]) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-extrabold border";
  switch (status) {
    case "PAID":
      return `${base} bg-emerald-50 border-emerald-200 text-emerald-700`;
    case "SENT":
      return `${base} bg-blue-50 border-blue-200 text-blue-700`;
    case "DRAFT":
      return `${base} bg-slate-50 border-slate-200 text-slate-700`;
    case "CANCELLED":
      return `${base} bg-red-50 border-red-200 text-red-700`;
    default:
      return `${base} bg-slate-50 border-slate-200 text-slate-700`;
  }
}

export default function BillingPage() {
  const params = useParams();
  const routeProjectId = params.projectId || null;

  const storeProjectId = useProjectStore((s) => s.activeProjectId);
  const storeProjectName = useProjectStore((s) => s.activeProjectName);

  const projectId = routeProjectId || storeProjectId;
  const projectName = storeProjectName;

  const summaryQ = useBillingSummary(projectId);
  const listQ = useInvoicesByProject(projectId);

  const create = useCreateInvoice(projectId);
  const pay = usePayInvoice(projectId);
  const cancel = useCancelInvoice(projectId);

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");

  const invoices = listQ.data || [];

  const totals = summaryQ.data?.totals || { count: 0, totalAmount: 0 };
  const byStatus = summaryQ.data?.byStatus;

  const unpaidCount = useMemo(() => {
    return invoices.filter((i) => i.status === "DRAFT" || i.status === "SENT")
      .length;
  }, [invoices]);

  if (!projectId) {
    return (
      <EmptyState
        title="No project selected"
        subtitle="Open a project first."
        action={
          <Link
            to="/app/projects"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Go to Projects
          </Link>
        }
      />
    );
  }

  async function submitCreate() {
    const n = Number(amount);
    if (Number.isNaN(n) || n <= 0) return;
    await create.mutateAsync(n);
    setOpen(false);
    setAmount("");
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Billing</h1>
          <p className="text-sm text-slate-600 mt-1">
            Project ·{" "}
            <span className="font-medium text-slate-900">
              {projectName || projectId}
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
          >
            + New Invoice
          </button>

          <Link
            to={`/app/projects/${projectId}?tab=billing`}
            className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Open Workspace Tab
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600">Invoices</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {totals.count}
          </div>
          <div className="mt-1 text-xs text-slate-500">Total count</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600">Unpaid</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {unpaidCount}
          </div>
          <div className="mt-1 text-xs text-slate-500">DRAFT + SENT</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600">Total amount</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {money(totals.totalAmount)}
          </div>
          <div className="mt-1 text-xs text-slate-500">Sum of all invoices</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-600">Paid amount</div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {money(byStatus?.PAID?.totalAmount || 0)}
          </div>
          <div className="mt-1 text-xs text-slate-500">Status = PAID</div>
        </div>
      </div>

      {/* Status breakdown */}
      <SectionCard title="By status">
        {summaryQ.isLoading ? (
          <div className="h-14 rounded-2xl bg-slate-200 animate-pulse" />
        ) : summaryQ.isError ? (
          <div className="text-sm text-red-700">
            {(summaryQ.error as any)?.response?.data?.message ||
              (summaryQ.error as Error).message}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["DRAFT", "SENT", "PAID", "CANCELLED"] as const).map((s) => (
              <div
                key={s}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="text-xs font-semibold text-slate-600">{s}</div>
                <div className="mt-1 text-lg font-extrabold text-slate-900">
                  {byStatus?.[s]?.count || 0}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Amount: {money(byStatus?.[s]?.totalAmount || 0)}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Invoices list */}
      <SectionCard title="Invoices">
        {listQ.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-2xl bg-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : listQ.isError ? (
          <div className="text-sm text-red-700">
            {(listQ.error as any)?.response?.data?.message ||
              (listQ.error as Error).message}
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <div className="font-semibold text-slate-900">No invoices yet</div>
            <div className="text-sm text-slate-600 mt-1">
              Click <span className="font-semibold">+ New Invoice</span> to
              create one.
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {invoices.map((inv) => (
              <div
                key={inv._id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-extrabold text-slate-900">
                      {inv.number}
                    </div>
                    <span className={statusPill(inv.status)}>{inv.status}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Amount:{" "}
                    <span className="font-semibold">{money(inv.amount)}</span>
                    {" · "}
                    Created: {new Date(inv.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 disabled:opacity-60"
                    disabled={pay.isPending || inv.status !== "SENT"}
                    title={
                      inv.status !== "SENT"
                        ? "Only SENT invoices can be paid"
                        : "Mark paid"
                    }
                    onClick={() => pay.mutate(inv._id)}
                  >
                    {pay.isPending ? "..." : "Pay"}
                  </button>

                  <button
                    type="button"
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-900 disabled:opacity-60"
                    disabled={
                      cancel.isPending ||
                      inv.status === "PAID" ||
                      inv.status === "CANCELLED"
                    }
                    title={
                      inv.status === "PAID"
                        ? "Paid invoices cannot be cancelled"
                        : inv.status === "CANCELLED"
                        ? "Already cancelled"
                        : "Cancel invoice"
                    }
                    onClick={() => cancel.mutate(inv._id)}
                  >
                    {cancel.isPending ? "..." : "Cancel"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Create modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-extrabold text-slate-900">
                  Create Invoice
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Enter amount (number &gt; 0)
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Amount
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="1000"
                  inputMode="decimal"
                />
              </div>

              {create.isError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {(create.error as any)?.response?.data?.message ||
                    (create.error as Error).message}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCreate}
                  disabled={
                    create.isPending ||
                    Number(amount) <= 0 ||
                    Number.isNaN(Number(amount))
                  }
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-slate-900 text-white disabled:opacity-60"
                >
                  {create.isPending ? "Creating..." : "Create"}
                </button>
              </div>

              <div className="text-xs text-slate-500">
                Note: your backend currently creates invoices as{" "}
                <span className="font-semibold">SENT</span>. If you want DRAFT
                first, tell me and I’ll adjust backend service cleanly.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

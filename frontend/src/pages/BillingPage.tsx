// src/pages/BillingPage.tsx
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
    n
  );
}

function formatDate(v: any) {
  try {
    return new Date(v).toLocaleString();
  } catch {
    return String(v || "");
  }
}

function statusPill(status: Invoice["status"]) {
  const base = "chip font-extrabold border";
  switch (status) {
    case "PAID":
      return `${base} bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.25)]`;
    case "SENT":
      return `${base} bg-[hsl(var(--primary)/0.12)] border-[hsl(var(--primary)/0.25)]`;
    case "DRAFT":
      return `${base} bg-muted border-border`;
    case "CANCELLED":
      return `${base} bg-[rgba(239,68,68,0.12)] border-[rgba(239,68,68,0.25)]`;
    default:
      return `${base} bg-muted border-border`;
  }
}

export default function BillingPage() {
  const { t } = useTranslation();

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

  function renderError(err: any) {
    return (
      err?.response?.data?.message ||
      (err as Error)?.message ||
      t("common.error")
    );
  }

  if (!projectId) {
    return (
      <EmptyState
        title={t("billing.noProjectTitle")}
        subtitle={t("billing.noProjectSubtitle")}
        action={
          <Link to="/app/projects" className="btn-primary">
            {t("billing.goProjects")}
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold">{t("billing.title")}</h1>
          <p className="text-sm text-mutedForeground mt-1">
            {t("billing.project")} ·{" "}
            <span className="font-semibold text-foreground">
              {projectName || projectId}
            </span>
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setOpen(true)} className="btn-primary">
            {t("billing.newInvoice")}
          </button>

          <Link
            to={`/app/projects/${projectId}?tab=billing`}
            className="btn-outline"
          >
            {t("billing.openWorkspaceTab")}
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="text-sm font-semibold text-mutedForeground">
            {t("billing.summary.invoices")}
          </div>
          <div className="mt-2 text-3xl font-extrabold">{totals.count}</div>
          <div className="mt-1 text-xs text-mutedForeground">
            {t("billing.summary.totalCount")}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-sm font-semibold text-mutedForeground">
            {t("billing.summary.unpaid")}
          </div>
          <div className="mt-2 text-3xl font-extrabold">{unpaidCount}</div>
          <div className="mt-1 text-xs text-mutedForeground">
            {t("billing.summary.unpaidHint")}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-sm font-semibold text-mutedForeground">
            {t("billing.summary.totalAmount")}
          </div>
          <div className="mt-2 text-3xl font-extrabold">
            {money(totals.totalAmount)}
          </div>
          <div className="mt-1 text-xs text-mutedForeground">
            {t("billing.summary.sumAll")}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-sm font-semibold text-mutedForeground">
            {t("billing.summary.paidAmount")}
          </div>
          <div className="mt-2 text-3xl font-extrabold">
            {money(byStatus?.PAID?.totalAmount || 0)}
          </div>
          <div className="mt-1 text-xs text-mutedForeground">
            {t("billing.summary.paidHint")}
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <SectionCard title={t("billing.byStatusTitle")}>
        {summaryQ.isLoading ? (
          <div className="h-14 rounded-2xl bg-muted animate-pulse" />
        ) : summaryQ.isError ? (
          <div className="text-sm text-danger">
            {renderError(summaryQ.error)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["DRAFT", "SENT", "PAID", "CANCELLED"] as const).map((s) => (
              <div
                key={s}
                className="rounded-2xl border border-border bg-muted p-4"
              >
                <div className="text-xs font-extrabold text-mutedForeground">
                  {s}
                </div>
                <div className="mt-1 text-xl font-extrabold text-foreground">
                  {byStatus?.[s]?.count || 0}
                </div>
                <div className="mt-1 text-xs text-mutedForeground">
                  {t("billing.amount")}:{" "}
                  {money(byStatus?.[s]?.totalAmount || 0)}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Invoices list */}
      <SectionCard title={t("billing.invoicesTitle")}>
        {listQ.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : listQ.isError ? (
          <div className="text-sm text-danger">{renderError(listQ.error)}</div>
        ) : invoices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted p-6 text-center">
            <div className="font-extrabold text-foreground">
              {t("billing.emptyTitle")}
            </div>
            <div className="text-sm text-mutedForeground mt-1">
              {t("billing.emptySubtitle")}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {invoices.map((inv) => (
              <div
                key={inv._id}
                className="py-3 flex items-center justify-between gap-3 flex-wrap"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-extrabold text-foreground">
                      {inv.number}
                    </div>
                    <span className={statusPill(inv.status)}>{inv.status}</span>
                  </div>

                  <div className="text-xs text-mutedForeground mt-1">
                    {t("billing.amount")}:{" "}
                    <span className="font-semibold text-foreground">
                      {money(inv.amount)}
                    </span>
                    {" · "}
                    {t("billing.created")}: {formatDate(inv.createdAt)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    className="btn-outline text-xs px-3 py-2 disabled:opacity-60"
                    disabled={pay.isPending || inv.status !== "SENT"}
                    title={
                      inv.status !== "SENT"
                        ? t("billing.onlySentCanBePaid")
                        : t("billing.markPaid")
                    }
                    onClick={() => pay.mutate(inv._id)}
                  >
                    {pay.isPending ? t("common.loading") : t("billing.pay")}
                  </button>

                  <button
                    type="button"
                    className="btn-outline text-xs px-3 py-2 disabled:opacity-60"
                    disabled={
                      cancel.isPending ||
                      inv.status === "PAID" ||
                      inv.status === "CANCELLED"
                    }
                    title={
                      inv.status === "PAID"
                        ? t("billing.paidCannotCancel")
                        : inv.status === "CANCELLED"
                        ? t("billing.alreadyCancelled")
                        : t("billing.cancelInvoice")
                    }
                    onClick={() => cancel.mutate(inv._id)}
                  >
                    {cancel.isPending
                      ? t("common.loading")
                      : t("billing.cancel")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Create modal */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg card p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-lg font-extrabold">
                  {t("billing.modal.title")}
                </div>
                <div className="text-sm text-mutedForeground mt-1">
                  {t("billing.modal.subtitle")}
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="btn-ghost px-3 py-2"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div>
                <label className="text-sm font-semibold">
                  {t("billing.modal.amount")}
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input mt-2"
                  placeholder="1000"
                  inputMode="decimal"
                />
              </div>

              {create.isError ? (
                <div className="rounded-2xl border border-border bg-muted px-3 py-2 text-sm">
                  <div className="font-bold text-danger">
                    {t("common.error")}
                  </div>
                  <div className="text-mutedForeground mt-1 break-words">
                    {renderError(create.error)}
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setOpen(false)} className="btn-outline">
                  {t("common.cancel")}
                </button>
                <button
                  onClick={submitCreate}
                  disabled={
                    create.isPending ||
                    Number(amount) <= 0 ||
                    Number.isNaN(Number(amount))
                  }
                  className="btn-primary disabled:opacity-60"
                >
                  {create.isPending
                    ? t("billing.modal.creating")
                    : t("billing.modal.create")}
                </button>
              </div>

              <div className="text-xs text-mutedForeground">
                {t("billing.modal.notePrefix")}{" "}
                <span className="font-semibold text-foreground">SENT</span>.{" "}
                {t("billing.modal.noteSuffix")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

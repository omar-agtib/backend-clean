// src/features/billing/api/billing.api.ts
import { http } from "../../../lib/http";

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "CANCELLED";

export type Invoice = {
  _id: string;
  projectId: string;

  number: string;
  amount: number;

  status: InvoiceStatus;

  issuedAt?: string;
  paidAt?: string | null;
  cancelledAt?: string | null;

  createdBy?: string | null;
  paidBy?: string | null;
  cancelledBy?: string | null;

  createdAt: string;
  updatedAt: string;
};

export type BillingSummary = {
  projectId: string;
  totals: { count: number; totalAmount: number };
  byStatus: Record<InvoiceStatus, { count: number; totalAmount: number }>;
};

export async function getInvoicesByProject(projectId: string) {
  const { data } = await http.get<Invoice[]>(`/billing/project/${projectId}`);
  return data;
}

export async function getBillingSummary(projectId: string) {
  const { data } = await http.get<BillingSummary>(
    `/billing/project/${projectId}/summary`
  );
  return data;
}

export async function createInvoiceApi(input: {
  projectId: string;
  amount: number;
}) {
  const { data } = await http.post<Invoice>(`/billing`, input);
  return data;
}

export async function payInvoiceApi(invoiceId: string) {
  const { data } = await http.post<Invoice>(`/billing/${invoiceId}/pay`, {});
  return data;
}

export async function cancelInvoiceApi(invoiceId: string) {
  const { data } = await http.post<Invoice>(`/billing/${invoiceId}/cancel`, {});
  return data;
}

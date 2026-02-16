import { apiClient } from "./client";
import type { PaginatedResponse } from "@/types";

export const billingApi = {
  // ✅ Invoices - Match backend routes
  getInvoices: async (projectId: string) => {
    const response = await apiClient.get<any[]>(
      `/api/billing/project/${projectId}`,
    );
    return {
      items: response.data,
      total: response.data.length,
      page: 1,
      pageSize: response.data.length,
      totalPages: 1,
    };
  },

  getInvoice: async (invoiceId: string) => {
    const response = await apiClient.get(`/api/billing/${invoiceId}`);
    return response.data;
  },

  createInvoice: async (data: { projectId: string; amount: number }) => {
    const response = await apiClient.post("/api/billing", data);
    return response.data;
  },

  markPaid: async (invoiceId: string) => {
    const response = await apiClient.post(`/api/billing/${invoiceId}/pay`);
    return response.data;
  },

  cancelInvoice: async (invoiceId: string) => {
    const response = await apiClient.post(`/api/billing/${invoiceId}/cancel`);
    return response.data;
  },

  getSummary: async (projectId: string) => {
    const response = await apiClient.get(
      `/api/billing/project/${projectId}/summary`,
    );
    return response.data;
  },
};

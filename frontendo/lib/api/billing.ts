import { apiClient } from './client'
import type { Invoice, BillingRule, Counter } from '@/types'

export const billingApi = {
  // Invoices
  getInvoices: (projectId: string, params?: Record<string, any>) =>
    apiClient.get(`/api/projects/${projectId}/invoices`, { params }),

  getInvoice: (projectId: string, invoiceId: string) =>
    apiClient.get(`/api/projects/${projectId}/invoices/${invoiceId}`),

  createInvoice: (projectId: string, data: Partial<Invoice>) =>
    apiClient.post(`/api/projects/${projectId}/invoices`, data),

  updateInvoice: (projectId: string, invoiceId: string, data: Partial<Invoice>) =>
    apiClient.put(`/api/projects/${projectId}/invoices/${invoiceId}`, data),

  deleteInvoice: (projectId: string, invoiceId: string) =>
    apiClient.delete(`/api/projects/${projectId}/invoices/${invoiceId}`),

  downloadInvoice: (projectId: string, invoiceId: string) =>
    apiClient.get(`/api/projects/${projectId}/invoices/${invoiceId}/download`, {
      responseType: 'blob',
    }),

  // Billing Rules
  getBillingRules: (projectId: string) =>
    apiClient.get(`/api/projects/${projectId}/billing-rules`),

  createBillingRule: (projectId: string, data: Partial<BillingRule>) =>
    apiClient.post(`/api/projects/${projectId}/billing-rules`, data),

  updateBillingRule: (projectId: string, ruleId: string, data: Partial<BillingRule>) =>
    apiClient.put(`/api/projects/${projectId}/billing-rules/${ruleId}`, data),

  deleteBillingRule: (projectId: string, ruleId: string) =>
    apiClient.delete(`/api/projects/${projectId}/billing-rules/${ruleId}`),

  // Counters
  getCounters: (projectId: string) =>
    apiClient.get(`/api/projects/${projectId}/counters`),

  updateCounter: (projectId: string, counterId: string, data: Partial<Counter>) =>
    apiClient.put(`/api/projects/${projectId}/counters/${counterId}`, data),

  // Billing Summary
  getBillingSummary: (projectId: string) =>
    apiClient.get(`/api/projects/${projectId}/billing/summary`),
}

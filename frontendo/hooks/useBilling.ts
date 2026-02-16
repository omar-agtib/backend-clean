import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingApi } from "@/lib/api/billing";
import { uiStore } from "@/store/ui-store";

export const useInvoices = (projectId: string) => {
  return useQuery({
    queryKey: ["invoices", projectId],
    queryFn: () => billingApi.getInvoices(projectId),
    enabled: !!projectId,
  });
};

export const useInvoice = (invoiceId: string) => {
  return useQuery({
    queryKey: ["invoices", invoiceId],
    queryFn: () => billingApi.getInvoice(invoiceId),
    enabled: !!invoiceId,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: { projectId: string; amount: number }) =>
      billingApi.createInvoice(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices", data.projectId] });
      queryClient.invalidateQueries({
        queryKey: ["billing-summary", data.projectId],
      });
      addNotification({
        type: "success",
        message: "Invoice created successfully",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create invoice";
      addNotification({ type: "error", message });
    },
  });
};

export const useMarkPaid = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: ({
      invoiceId,
      projectId,
    }: {
      invoiceId: string;
      projectId: string;
    }) => billingApi.markPaid(invoiceId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoices", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["billing-summary", variables.projectId],
      });
      addNotification({ type: "success", message: "Invoice marked as paid" });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to mark invoice as paid";
      addNotification({ type: "error", message });
    },
  });
};

export const useCancelInvoice = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: ({
      invoiceId,
      projectId,
    }: {
      invoiceId: string;
      projectId: string;
    }) => billingApi.cancelInvoice(invoiceId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["invoices", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["billing-summary", variables.projectId],
      });
      addNotification({ type: "success", message: "Invoice cancelled" });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to cancel invoice";
      addNotification({ type: "error", message });
    },
  });
};

export const useBillingSummary = (projectId: string) => {
  return useQuery({
    queryKey: ["billing-summary", projectId],
    queryFn: () => billingApi.getSummary(projectId),
    enabled: !!projectId,
  });
};

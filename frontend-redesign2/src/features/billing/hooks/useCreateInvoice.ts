// src/features/billing/hooks/useCreateInvoice.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingKeys } from "../api/billingKeys";
import { createInvoiceApi } from "../api/billing.api";
import { useToastStore } from "../../../store/toast.store";

export function useCreateInvoice(projectId?: string | null) {
  const qc = useQueryClient();
  const push = useToastStore((s) => s.push);

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!projectId) throw new Error("projectId is required");
      return createInvoiceApi({ projectId, amount });
    },
    onSuccess: () => {
      if (projectId) {
        qc.invalidateQueries({ queryKey: billingKeys.list(projectId) });
        qc.invalidateQueries({ queryKey: billingKeys.summary(projectId) });
      }
      push({ kind: "success", title: "Invoice created" });
    },
  });
}

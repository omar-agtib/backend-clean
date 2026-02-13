// src/features/billing/hooks/usePayInvoice.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingKeys } from "../api/billingKeys";
import { payInvoiceApi } from "../api/billing.api";
import { useToastStore } from "../../../store/toast.store";

export function usePayInvoice(projectId?: string | null) {
  const qc = useQueryClient();
  const push = useToastStore((s) => s.push);

  return useMutation({
    mutationFn: payInvoiceApi,
    onSuccess: () => {
      if (projectId) {
        qc.invalidateQueries({ queryKey: billingKeys.list(projectId) });
        qc.invalidateQueries({ queryKey: billingKeys.summary(projectId) });
      }
      push({ kind: "success", title: "Invoice marked as PAID" });
    },
  });
}

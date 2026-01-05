// src/features/billing/hooks/useCancelInvoice.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billingKeys } from "../api/billingKeys";
import { cancelInvoiceApi } from "../api/billing.api";
import { useToastStore } from "../../../store/toast.store";

export function useCancelInvoice(projectId?: string | null) {
  const qc = useQueryClient();
  const push = useToastStore((s) => s.push);

  return useMutation({
    mutationFn: cancelInvoiceApi,
    onSuccess: () => {
      if (projectId) {
        qc.invalidateQueries({ queryKey: billingKeys.list(projectId) });
        qc.invalidateQueries({ queryKey: billingKeys.summary(projectId) });
      }
      push({ kind: "info", title: "Invoice cancelled" });
    },
  });
}

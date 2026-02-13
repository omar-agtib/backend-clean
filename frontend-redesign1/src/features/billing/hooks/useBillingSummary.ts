// src/features/billing/hooks/useBillingSummary.ts
import { useQuery } from "@tanstack/react-query";
import { billingKeys } from "../api/billingKeys";
import { getBillingSummary } from "../api/billing.api";

export function useBillingSummary(projectId?: string | null) {
  return useQuery({
    queryKey: projectId
      ? billingKeys.summary(projectId)
      : ["billing", "summary", "none"],
    queryFn: () => getBillingSummary(projectId as string),
    enabled: !!projectId,
  });
}

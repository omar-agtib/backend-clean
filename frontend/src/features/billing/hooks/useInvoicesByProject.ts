// src/features/billing/hooks/useInvoicesByProject.ts
import { useQuery } from "@tanstack/react-query";
import { billingKeys } from "../api/billingKeys";
import { getInvoicesByProject } from "../api/billing.api";

export function useInvoicesByProject(projectId?: string | null) {
  return useQuery({
    queryKey: projectId
      ? billingKeys.list(projectId)
      : ["billing", "list", "no-project"],
    queryFn: () => getInvoicesByProject(projectId as string),
    enabled: !!projectId,
  });
}

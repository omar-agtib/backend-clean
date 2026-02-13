import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { billingApi } from '@/lib/api/billing'

export const useInvoices = (projectId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['invoices', projectId, params],
    queryFn: () => billingApi.getInvoices(projectId, params),
    enabled: !!projectId,
  })
}

export const useInvoice = (projectId: string, invoiceId: string) => {
  return useQuery({
    queryKey: ['invoices', projectId, invoiceId],
    queryFn: () => billingApi.getInvoice(projectId, invoiceId),
    enabled: !!projectId && !!invoiceId,
  })
}

export const useCreateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      billingApi.createInvoice(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['billing-summary', variables.projectId] })
    },
  })
}

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, invoiceId, data }: { projectId: string; invoiceId: string; data: any }) =>
      billingApi.updateInvoice(projectId, invoiceId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.projectId] })
    },
  })
}

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, invoiceId }: { projectId: string; invoiceId: string }) =>
      billingApi.deleteInvoice(projectId, invoiceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices', variables.projectId] })
    },
  })
}

export const useDownloadInvoice = () => {
  return useMutation({
    mutationFn: ({ projectId, invoiceId }: { projectId: string; invoiceId: string }) =>
      billingApi.downloadInvoice(projectId, invoiceId),
  })
}

export const useBillingRules = (projectId: string) => {
  return useQuery({
    queryKey: ['billing-rules', projectId],
    queryFn: () => billingApi.getBillingRules(projectId),
    enabled: !!projectId,
  })
}

export const useCreateBillingRule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      billingApi.createBillingRule(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['billing-rules', variables.projectId] })
    },
  })
}

export const useUpdateBillingRule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, ruleId, data }: { projectId: string; ruleId: string; data: any }) =>
      billingApi.updateBillingRule(projectId, ruleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['billing-rules', variables.projectId] })
    },
  })
}

export const useDeleteBillingRule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, ruleId }: { projectId: string; ruleId: string }) =>
      billingApi.deleteBillingRule(projectId, ruleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['billing-rules', variables.projectId] })
    },
  })
}

export const useCounters = (projectId: string) => {
  return useQuery({
    queryKey: ['counters', projectId],
    queryFn: () => billingApi.getCounters(projectId),
    enabled: !!projectId,
  })
}

export const useUpdateCounter = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, counterId, data }: { projectId: string; counterId: string; data: any }) =>
      billingApi.updateCounter(projectId, counterId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['counters', variables.projectId] })
    },
  })
}

export const useBillingSummary = (projectId: string) => {
  return useQuery({
    queryKey: ['billing-summary', projectId],
    queryFn: () => billingApi.getBillingSummary(projectId),
    enabled: !!projectId,
  })
}

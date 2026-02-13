import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qualityApi } from '@/lib/api/quality'

export const useNonConformities = (projectId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['non-conformities', projectId, params],
    queryFn: () => qualityApi.getNonConformities(projectId, params),
    enabled: !!projectId,
  })
}

export const useNonConformity = (projectId: string, ncId: string) => {
  return useQuery({
    queryKey: ['non-conformities', projectId, ncId],
    queryFn: () => qualityApi.getNonConformity(projectId, ncId),
    enabled: !!projectId && !!ncId,
  })
}

export const useCreateNonConformity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      qualityApi.createNonConformity(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['non-conformities', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['quality-summary', variables.projectId] })
    },
  })
}

export const useUpdateNonConformity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, ncId, data }: { projectId: string; ncId: string; data: any }) =>
      qualityApi.updateNonConformity(projectId, ncId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['non-conformities', variables.projectId] })
    },
  })
}

export const useDeleteNonConformity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, ncId }: { projectId: string; ncId: string }) =>
      qualityApi.deleteNonConformity(projectId, ncId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['non-conformities', variables.projectId] })
    },
  })
}

export const useNCHistory = (projectId: string, ncId: string) => {
  return useQuery({
    queryKey: ['nc-history', projectId, ncId],
    queryFn: () => qualityApi.getNCHistory(projectId, ncId),
    enabled: !!projectId && !!ncId,
  })
}

export const useAddNCHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, ncId, data }: { projectId: string; ncId: string; data: any }) =>
      qualityApi.addNCHistory(projectId, ncId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['nc-history', variables.projectId, variables.ncId] })
    },
  })
}

export const useUpdateNCStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, ncId, status }: { projectId: string; ncId: string; status: string }) =>
      qualityApi.updateNCStatus(projectId, ncId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['non-conformities', variables.projectId] })
    },
  })
}

export const useResolveNC = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, ncId, resolutionData }: { projectId: string; ncId: string; resolutionData: any }) =>
      qualityApi.resolveNC(projectId, ncId, resolutionData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['non-conformities', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['quality-summary', variables.projectId] })
    },
  })
}

export const useQualitySummary = (projectId: string) => {
  return useQuery({
    queryKey: ['quality-summary', projectId],
    queryFn: () => qualityApi.getQualitySummary(projectId),
    enabled: !!projectId,
  })
}

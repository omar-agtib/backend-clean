import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { progressApi } from '@/lib/api/progress'

export const useProgress = (projectId: string) => {
  return useQuery({
    queryKey: ['progress', projectId],
    queryFn: () => progressApi.getProgress(projectId),
    enabled: !!projectId,
  })
}

export const useUpdateProgress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      progressApi.updateProgress(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['progress', variables.projectId] })
    },
  })
}

export const useMilestones = (projectId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['milestones', projectId, params],
    queryFn: () => progressApi.getMilestones(projectId, params),
    enabled: !!projectId,
  })
}

export const useMilestone = (projectId: string, milestoneId: string) => {
  return useQuery({
    queryKey: ['milestones', projectId, milestoneId],
    queryFn: () => progressApi.getMilestone(projectId, milestoneId),
    enabled: !!projectId && !!milestoneId,
  })
}

export const useCreateMilestone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      progressApi.createMilestone(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', variables.projectId] })
    },
  })
}

export const useUpdateMilestone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, milestoneId, data }: { projectId: string; milestoneId: string; data: any }) =>
      progressApi.updateMilestone(projectId, milestoneId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', variables.projectId] })
    },
  })
}

export const useCompleteMilestone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, milestoneId }: { projectId: string; milestoneId: string }) =>
      progressApi.completeMilestone(projectId, milestoneId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['progress', variables.projectId] })
    },
  })
}

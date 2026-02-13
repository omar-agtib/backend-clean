import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toolsApi } from '@/lib/api/tools'

export const useTools = (projectId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['tools', projectId, params],
    queryFn: () => toolsApi.getTools(projectId, params),
    enabled: !!projectId,
  })
}

export const useTool = (projectId: string, toolId: string) => {
  return useQuery({
    queryKey: ['tools', projectId, toolId],
    queryFn: () => toolsApi.getTool(projectId, toolId),
    enabled: !!projectId && !!toolId,
  })
}

export const useCreateTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      toolsApi.createTool(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tools', variables.projectId] })
    },
  })
}

export const useUpdateTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, toolId, data }: { projectId: string; toolId: string; data: any }) =>
      toolsApi.updateTool(projectId, toolId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tools', variables.projectId] })
    },
  })
}

export const useDeleteTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, toolId }: { projectId: string; toolId: string }) =>
      toolsApi.deleteTool(projectId, toolId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tools', variables.projectId] })
    },
  })
}

export const useToolAssignments = (projectId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['tool-assignments', projectId, params],
    queryFn: () => toolsApi.getAssignments(projectId, params),
    enabled: !!projectId,
  })
}

export const useAssignTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      toolsApi.assignTool(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tool-assignments', variables.projectId] })
    },
  })
}

export const useUnassignTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, assignmentId }: { projectId: string; assignmentId: string }) =>
      toolsApi.unassignTool(projectId, assignmentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tool-assignments', variables.projectId] })
    },
  })
}

export const useToolMaintenance = (projectId: string, toolId: string) => {
  return useQuery({
    queryKey: ['tool-maintenance', projectId, toolId],
    queryFn: () => toolsApi.getMaintenance(projectId, toolId),
    enabled: !!projectId && !!toolId,
  })
}

export const useScheduleMaintenance = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, toolId, data }: { projectId: string; toolId: string; data: any }) =>
      toolsApi.scheduleMaintenance(projectId, toolId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tool-maintenance', variables.projectId, variables.toolId] })
    },
  })
}

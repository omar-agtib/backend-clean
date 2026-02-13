import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { uiStore } from '@/store/ui-store'
import * as projectsApi from '@/lib/api/projects'

export function useProjects(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['projects', page, limit],
    queryFn: () => projectsApi.getProjects(page, limit),
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  const { addNotification } = uiStore()

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      addNotification({
        type: 'success',
        message: 'Project created successfully',
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create project'
      addNotification({
        type: 'error',
        message,
      })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  const { addNotification } = uiStore()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      projectsApi.updateProject(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.setQueryData(['projects', data._id], data)
      addNotification({
        type: 'success',
        message: 'Project updated successfully',
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update project'
      addNotification({
        type: 'error',
        message,
      })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  const { addNotification } = uiStore()

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      addNotification({
        type: 'success',
        message: 'Project deleted successfully',
      })
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete project'
      addNotification({
        type: 'error',
        message,
      })
    },
  })
}

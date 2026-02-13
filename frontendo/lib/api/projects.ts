import { apiClient } from './client'
import { Project, PaginatedResponse } from '@/types'

export async function getProjects(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Project>> {
  const response = await apiClient.get<PaginatedResponse<Project>>('/api/projects', {
    params: { page, limit },
  })
  return response.data
}

export async function getProject(id: string): Promise<Project> {
  const response = await apiClient.get<Project>(`/api/projects/${id}`)
  return response.data
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const response = await apiClient.post<Project>('/api/projects', data)
  return response.data
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const response = await apiClient.put<Project>(`/api/projects/${id}`, data)
  return response.data
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/api/projects/${id}`)
}

export async function addProjectMember(
  projectId: string,
  userId: string,
  role: string
): Promise<Project> {
  const response = await apiClient.post<Project>(
    `/api/projects/${projectId}/members`,
    { userId, role }
  )
  return response.data
}

export async function removeProjectMember(projectId: string, userId: string): Promise<Project> {
  const response = await apiClient.delete<Project>(
    `/api/projects/${projectId}/members/${userId}`
  )
  return response.data
}

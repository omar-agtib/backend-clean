import { apiClient } from './client'
import type { Milestone, Progress } from '@/types'

export const progressApi = {
  // Progress
  getProgress: (projectId: string) =>
    apiClient.get(`/api/projects/${projectId}/progress`),

  updateProgress: (projectId: string, data: Partial<Progress>) =>
    apiClient.put(`/api/projects/${projectId}/progress`, data),

  // Milestones
  getMilestones: (projectId: string, params?: Record<string, any>) =>
    apiClient.get(`/api/projects/${projectId}/milestones`, { params }),

  getMilestone: (projectId: string, milestoneId: string) =>
    apiClient.get(`/api/projects/${projectId}/milestones/${milestoneId}`),

  createMilestone: (projectId: string, data: Partial<Milestone>) =>
    apiClient.post(`/api/projects/${projectId}/milestones`, data),

  updateMilestone: (projectId: string, milestoneId: string, data: Partial<Milestone>) =>
    apiClient.put(`/api/projects/${projectId}/milestones/${milestoneId}`, data),

  deleteMilestone: (projectId: string, milestoneId: string) =>
    apiClient.delete(`/api/projects/${projectId}/milestones/${milestoneId}`),

  completeMilestone: (projectId: string, milestoneId: string) =>
    apiClient.post(`/api/projects/${projectId}/milestones/${milestoneId}/complete`, {}),
}

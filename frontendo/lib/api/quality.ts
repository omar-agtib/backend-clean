import { apiClient } from './client'
import type { NonConformity, NCHistory } from '@/types'

export const qualityApi = {
  // Non-Conformities
  getNonConformities: (projectId: string, params?: Record<string, any>) =>
    apiClient.get(`/api/projects/${projectId}/non-conformities`, { params }),

  getNonConformity: (projectId: string, ncId: string) =>
    apiClient.get(`/api/projects/${projectId}/non-conformities/${ncId}`),

  createNonConformity: (projectId: string, data: Partial<NonConformity>) =>
    apiClient.post(`/api/projects/${projectId}/non-conformities`, data),

  updateNonConformity: (projectId: string, ncId: string, data: Partial<NonConformity>) =>
    apiClient.put(`/api/projects/${projectId}/non-conformities/${ncId}`, data),

  deleteNonConformity: (projectId: string, ncId: string) =>
    apiClient.delete(`/api/projects/${projectId}/non-conformities/${ncId}`),

  // NC History
  getNCHistory: (projectId: string, ncId: string) =>
    apiClient.get(`/api/projects/${projectId}/non-conformities/${ncId}/history`),

  addNCHistory: (projectId: string, ncId: string, data: Partial<NCHistory>) =>
    apiClient.post(`/api/projects/${projectId}/non-conformities/${ncId}/history`, data),

  // Status Updates
  updateNCStatus: (projectId: string, ncId: string, status: string) =>
    apiClient.patch(`/api/projects/${projectId}/non-conformities/${ncId}/status`, { status }),

  // Resolution
  resolveNC: (projectId: string, ncId: string, resolutionData: any) =>
    apiClient.post(`/api/projects/${projectId}/non-conformities/${ncId}/resolve`, resolutionData),

  // Quality Summary
  getQualitySummary: (projectId: string) =>
    apiClient.get(`/api/projects/${projectId}/quality/summary`),
}

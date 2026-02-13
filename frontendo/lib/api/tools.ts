import { apiClient } from './client'
import type { Tool, ToolAssignment, ToolMaintenance } from '@/types'

export const toolsApi = {
  // Tools
  getTools: (projectId: string, params?: Record<string, any>) =>
    apiClient.get(`/api/projects/${projectId}/tools`, { params }),

  getTool: (projectId: string, toolId: string) =>
    apiClient.get(`/api/projects/${projectId}/tools/${toolId}`),

  createTool: (projectId: string, data: Partial<Tool>) =>
    apiClient.post(`/api/projects/${projectId}/tools`, data),

  updateTool: (projectId: string, toolId: string, data: Partial<Tool>) =>
    apiClient.put(`/api/projects/${projectId}/tools/${toolId}`, data),

  deleteTool: (projectId: string, toolId: string) =>
    apiClient.delete(`/api/projects/${projectId}/tools/${toolId}`),

  // Tool Assignments
  getAssignments: (projectId: string, params?: Record<string, any>) =>
    apiClient.get(`/api/projects/${projectId}/tool-assignments`, { params }),

  assignTool: (projectId: string, data: Partial<ToolAssignment>) =>
    apiClient.post(`/api/projects/${projectId}/tool-assignments`, data),

  updateAssignment: (projectId: string, assignmentId: string, data: Partial<ToolAssignment>) =>
    apiClient.put(`/api/projects/${projectId}/tool-assignments/${assignmentId}`, data),

  unassignTool: (projectId: string, assignmentId: string) =>
    apiClient.delete(`/api/projects/${projectId}/tool-assignments/${assignmentId}`),

  // Maintenance
  getMaintenance: (projectId: string, toolId: string) =>
    apiClient.get(`/api/projects/${projectId}/tools/${toolId}/maintenance`),

  scheduleMaintenance: (projectId: string, toolId: string, data: Partial<ToolMaintenance>) =>
    apiClient.post(`/api/projects/${projectId}/tools/${toolId}/maintenance`, data),

  completeMaintenance: (projectId: string, toolId: string, maintenanceId: string) =>
    apiClient.post(`/api/projects/${projectId}/tools/${toolId}/maintenance/${maintenanceId}/complete`, {}),
}

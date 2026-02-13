import { apiClient } from "./client";
import type {
  Tool,
  ToolAssignment,
  ToolMaintenance,
  PaginatedResponse,
} from "@/types";

export const toolsApi = {
  // ✅ Inventory Management
  getAllTools: async () => {
    const response = await apiClient.get<Tool[]>("/api/tools");
    return {
      items: response.data,
      total: response.data.length,
      page: 1,
      pageSize: response.data.length,
      totalPages: 1,
    };
  },

  getAvailableTools: async () => {
    const response = await apiClient.get<Tool[]>("/api/tools/available");
    return response.data;
  },

  createTool: async (data: { name: string; serialNumber?: string }) => {
    const response = await apiClient.post<Tool>("/api/tools", data);
    return response.data;
  },

  // ✅ Assignments
  getAssignments: async (projectId: string) => {
    const response = await apiClient.get<ToolAssignment[]>(
      `/api/tools/project/${projectId}/assignments`,
    );
    return {
      items: response.data,
      total: response.data.length,
      page: 1,
      pageSize: response.data.length,
      totalPages: 1,
    };
  },

  getActiveAssignments: async (projectId: string) => {
    const response = await apiClient.get<ToolAssignment[]>(
      `/api/tools/project/${projectId}/assigned`,
    );
    return response.data;
  },

  assignTool: async (data: {
    toolId: string;
    projectId: string;
    assignedTo: string;
  }) => {
    const response = await apiClient.post<ToolAssignment>(
      "/api/tools/assign",
      data,
    );
    return response.data;
  },

  returnTool: async (data: { toolId: string }) => {
    const response = await apiClient.post("/api/tools/return", data);
    return response.data;
  },

  // ✅ Maintenance
  getMaintenance: async (projectId: string) => {
    const response = await apiClient.get<ToolMaintenance[]>(
      `/api/tools/project/${projectId}/maintenance`,
    );
    return response.data;
  },

  startMaintenance: async (data: {
    toolId: string;
    projectId: string;
    description: string;
  }) => {
    const response = await apiClient.post<ToolMaintenance>(
      "/api/tools/maintenance/start",
      data,
    );
    return response.data;
  },

  completeMaintenance: async (data: { maintenanceId: string }) => {
    const response = await apiClient.post(
      "/api/tools/maintenance/complete",
      data,
    );
    return response.data;
  },
};

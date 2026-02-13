import { apiClient } from "./client";
import type { PaginatedResponse } from "@/types";

export const qualityApi = {
  // ✅ Non-Conformities - Match backend routes
  getNonConformities: async (projectId: string) => {
    const response = await apiClient.get<any[]>(`/api/nc/project/${projectId}`);
    return {
      items: response.data,
      total: response.data.length,
      page: 1,
      pageSize: response.data.length,
      totalPages: 1,
    };
  },

  createNC: async (data: {
    projectId: string;
    title: string;
    description?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    assignedTo?: string;
    planId?: string;
    planVersionId?: string;
    annotationId?: string;
    comment?: string;
  }) => {
    const response = await apiClient.post("/api/nc", data);
    return response.data;
  },

  assignNC: async (ncId: string, assignedTo: string) => {
    const response = await apiClient.post(`/api/nc/${ncId}/assign`, {
      assignedTo,
    });
    return response.data;
  },

  changeStatus: async (ncId: string, status: string, comment?: string) => {
    const response = await apiClient.post(`/api/nc/${ncId}/status`, {
      status,
      comment,
    });
    return response.data;
  },

  getHistory: async (ncId: string) => {
    const response = await apiClient.get(`/api/nc/${ncId}/history`);
    return response.data;
  },
};

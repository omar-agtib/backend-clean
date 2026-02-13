import { apiClient } from "./client";
import type { Milestone, PaginatedResponse } from "@/types";

export const progressApi = {
  // ✅ Summary - Match backend route
  getSummary: async (projectId: string) => {
    const response = await apiClient.get(
      `/api/progress/project/${projectId}/summary`,
    );
    return response.data;
  },

  // ✅ Milestones - Match backend routes
  getMilestones: async (projectId: string) => {
    const response = await apiClient.get<Milestone[]>(
      `/api/progress/project/${projectId}`,
    );
    // Backend returns array, wrap in pagination format
    return {
      items: response.data,
      total: response.data.length,
      page: 1,
      pageSize: response.data.length,
      totalPages: 1,
    };
  },

  createMilestone: async (data: { projectId: string; name: string }) => {
    const response = await apiClient.post<Milestone>("/api/progress", data);
    return response.data;
  },

  updateMilestone: async (milestoneId: string, progress: number) => {
    const response = await apiClient.patch<Milestone>(
      `/api/progress/milestone/${milestoneId}`,
      { progress },
    );
    return response.data;
  },

  deleteMilestone: async (milestoneId: string) => {
    const response = await apiClient.delete(
      `/api/progress/milestone/${milestoneId}`,
    );
    return response.data;
  },
};

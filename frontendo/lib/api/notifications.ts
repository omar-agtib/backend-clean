import { apiClient } from "./client";

export interface Notification {
  _id: string;
  userId: string;
  projectId?: string;
  type: string;
  title: string;
  message?: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationsApi = {
  getNotifications: async (params?: {
    projectId?: string;
    unreadOnly?: boolean;
    limit?: number;
  }) => {
    const response = await apiClient.get<Notification[]>("/api/notifications", {
      params,
    });
    return response.data;
  },

  markAsRead: async (notificationId: string) => {
    const response = await apiClient.patch<Notification>(
      `/api/notifications/${notificationId}/read`,
    );
    return response.data;
  },

  markAllAsRead: async (projectId?: string) => {
    const response = await apiClient.post("/api/notifications/read-all", {
      projectId,
    });
    return response.data;
  },
};

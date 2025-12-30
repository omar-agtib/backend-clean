// src/features/notifications/api/notifications.api.ts
import { http } from "../../../lib/http";

export type Notification = {
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
};

export async function listMyNotifications(params?: {
  projectId?: string;
  unreadOnly?: boolean;
  limit?: number;
}) {
  const { data } = await http.get<Notification[]>("/notifications", {
    params: {
      projectId: params?.projectId,
      unreadOnly: params?.unreadOnly ? "true" : undefined,
      limit: params?.limit,
    },
  });
  return data;
}

export async function markNotificationRead(notificationId: string) {
  const { data } = await http.patch<Notification>(
    `/notifications/${notificationId}/read`
  );
  return data;
}

export async function markAllNotificationsRead(projectId?: string) {
  const { data } = await http.post<{ message: string; modified: number }>(
    "/notifications/read-all",
    { projectId: projectId || undefined }
  );
  return data;
}

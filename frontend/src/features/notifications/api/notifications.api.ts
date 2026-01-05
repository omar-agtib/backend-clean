// src/features/notifications/api/notifications.api.ts
import { http } from "../../../lib/http";

export type Notification = {
  _id: string;

  userId?: string;
  projectId?: string;

  title: string;
  message?: string;

  kind?: "info" | "success" | "warning" | "error";

  isRead: boolean;

  createdAt: string;
  updatedAt: string;
};

export async function listNotifications(params?: { limit?: number }) {
  const { data } = await http.get<Notification[]>("/notifications", {
    params: { limit: params?.limit ?? 100 },
  });
  return data;
}

export async function markNotificationRead(notificationId: string) {
  const { data } = await http.patch<Notification>(
    `/notifications/${notificationId}/read`
  );
  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await http.patch<{ ok: true; updated: number }>(
    "/notifications/read-all"
  );
  return data;
}

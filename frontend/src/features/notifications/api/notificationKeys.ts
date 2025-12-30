// src/features/notifications/api/notificationKeys.ts
export const notificationKeys = {
  all: ["notifications"] as const,
  mine: (filters?: { projectId?: string; unreadOnly?: boolean }) =>
    [
      "notifications",
      "mine",
      filters?.projectId || "all",
      !!filters?.unreadOnly,
    ] as const,
};

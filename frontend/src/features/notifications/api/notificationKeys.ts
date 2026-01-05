// src/features/notifications/api/notificationKeys.ts
export const notificationKeys = {
  all: ["notifications"] as const,
  list: (limit: number) => ["notifications", "list", limit] as const,
};

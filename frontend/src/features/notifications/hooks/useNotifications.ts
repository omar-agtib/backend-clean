// src/features/notifications/hooks/useNotifications.ts
import { useQuery } from "@tanstack/react-query";
import { listNotifications } from "../api/notifications.api";
import { notificationKeys } from "../api/notificationKeys";

export function useNotifications(params?: { limit?: number }) {
  const limit = params?.limit ?? 100;

  return useQuery({
    queryKey: notificationKeys.list(limit),
    queryFn: () => listNotifications({ limit }),
  });
}

// src/features/notifications/hooks/useNotifications.ts
import { useQuery } from "@tanstack/react-query";
import { listMyNotifications } from "../api/notifications.api";
import { notificationKeys } from "../api/notificationKeys";

export function useNotifications(filters?: {
  projectId?: string;
  unreadOnly?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: notificationKeys.mine({
      projectId: filters?.projectId,
      unreadOnly: filters?.unreadOnly,
    }),
    queryFn: () => listMyNotifications(filters),
  });
}

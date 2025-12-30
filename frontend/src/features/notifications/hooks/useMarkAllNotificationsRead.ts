// src/features/notifications/hooks/useMarkAllNotificationsRead.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsRead } from "../api/notifications.api";
import { notificationKeys } from "../api/notificationKeys";

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (projectId?: string) => markAllNotificationsRead(projectId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

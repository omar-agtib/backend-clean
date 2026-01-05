// src/features/notifications/hooks/useMarkAllNotificationsRead.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsRead } from "../api/notifications.api";
import { notificationKeys } from "../api/notificationKeys";

export function useMarkAllNotificationsRead(limit = 100) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: notificationKeys.list(limit) });
    },
  });
}

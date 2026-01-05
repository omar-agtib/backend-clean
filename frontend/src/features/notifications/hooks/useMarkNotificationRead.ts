// src/features/notifications/hooks/useMarkNotificationRead.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationRead } from "../api/notifications.api";
import { notificationKeys } from "../api/notificationKeys";

export function useMarkNotificationRead(limit = 100) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationRead(notificationId),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: notificationKeys.list(limit) });
    },
  });
}

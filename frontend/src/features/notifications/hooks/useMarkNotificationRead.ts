// src/features/notifications/hooks/useMarkNotificationRead.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationRead } from "../api/notifications.api";
import { notificationKeys } from "../api/notificationKeys";

export function useMarkNotificationRead() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

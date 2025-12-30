// src/features/notifications/hooks/useNotificationsRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, joinUserRoom } from "../../../lib/ws";
import { notificationKeys } from "../api/notificationKeys";
import { useToastStore } from "../../../store/toast.store";

export function useNotificationsRealtime(userId?: string | null) {
  const qc = useQueryClient();
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    if (!userId) return;

    const s = getSocket();
    joinUserRoom(userId);

    const onNew = (n: any) => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
      push({
        kind: "info",
        title: n?.title || "New notification",
        message: n?.message || undefined,
      });
    };

    s.on("notification:new", onNew);

    return () => {
      s.off("notification:new", onNew);
    };
  }, [userId, qc, push]);
}

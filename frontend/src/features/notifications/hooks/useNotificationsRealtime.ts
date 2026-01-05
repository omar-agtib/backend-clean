// src/features/notifications/hooks/useNotificationsRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "../api/notificationKeys";
import { getSocket, joinProjectRoom } from "../../../lib/ws";
import { useToastStore } from "../../../store/toast.store";

export function useNotificationsRealtime(userId?: string | null, limit = 100) {
  const qc = useQueryClient();
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    if (!userId) return;

    const s = getSocket();

    // If your backend requires joining a user room instead, add:
    // s.emit("join:user", userId);

    const invalidate = () =>
      qc.invalidateQueries({ queryKey: notificationKeys.list(limit) });

    const onCreated = (n: any) => {
      invalidate();
      push({
        kind: "info",
        title: n?.title || "New notification",
        message: n?.message || undefined,
      });
    };

    const onRead = () => invalidate();
    const onReadAll = () => invalidate();

    s.on("notification:created", onCreated);
    s.on("notification:read", onRead);
    s.on("notification:readAll", onReadAll);

    return () => {
      s.off("notification:created", onCreated);
      s.off("notification:read", onRead);
      s.off("notification:readAll", onReadAll);
    };
  }, [userId, limit, qc, push]);
}

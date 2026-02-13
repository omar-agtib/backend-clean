// src/features/progress/hooks/useProgressRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, joinProjectRoom } from "../../../lib/ws";
import { progressKeys } from "../api/progressKeys";
import { useToastStore } from "../../../store/toast.store";

export function useProgressRealtime(projectId?: string | null) {
  const qc = useQueryClient();
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    if (!projectId) return;

    const s = getSocket();
    joinProjectRoom(projectId);

    const invalidate = () => {
      qc.invalidateQueries({
        queryKey: progressKeys.milestonesByProject(projectId),
      });
      qc.invalidateQueries({
        queryKey: progressKeys.summaryByProject(projectId),
      });
    };

    const onCreated = (m: any) => {
      invalidate();
      push({
        kind: "success",
        title: "Milestone created",
        message: m?.name || undefined,
      });
    };

    const onUpdated = (m: any) => {
      invalidate();
      push({
        kind: "info",
        title: "Milestone updated",
        message: m?.name ? `${m.name} → ${m.progress}%` : undefined,
      });
    };

    const onDeleted = (p: any) => {
      invalidate();
      push({
        kind: "info",
        title: "Milestone deleted",
      });
    };

    // ✅ must match backend event names
    s.on("milestone:created", onCreated);
    s.on("milestone:updated", onUpdated);
    s.on("milestone:deleted", onDeleted);

    return () => {
      s.off("milestone:created", onCreated);
      s.off("milestone:updated", onUpdated);
      s.off("milestone:deleted", onDeleted);
    };
  }, [projectId, qc, push]);
}

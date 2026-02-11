// src/features/annotations/hooks/useAnnotationsRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { annotationKeys } from "../api/annotationKeys";
import { getSocket, joinProjectRoom } from "../../../lib/ws";
import { useToastStore } from "../../../store/toast.store";

export function useAnnotationsRealtime(
  projectId?: string | null,
  planVersionId?: string | null
) {
  const qc = useQueryClient();
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    if (!projectId || !planVersionId) return;

    const s = getSocket();
    joinProjectRoom(projectId);

    const invalidate = () =>
      qc.invalidateQueries({ queryKey: annotationKeys.version(planVersionId) });

    const onAdded = (a: any) => {
      if (String(a?.planVersionId) !== String(planVersionId)) return;
      invalidate();
      push({
        kind: "success",
        title: "New pin added",
        message: a?.content || undefined,
      });
    };

    const onUpdated = (a: any) => {
      if (String(a?.planVersionId) !== String(planVersionId)) return;
      invalidate();
      push({
        kind: "info",
        title: "Pin updated",
        message: a?.content || undefined,
      });
    };

    const onDeleted = (payload: any) => {
      // backend sends: { annotationId }
      // We can't know planVersionId from this event, so just refresh current version.
      invalidate();
      push({ kind: "info", title: "Pin deleted" });
    };

    s.on("annotation:added", onAdded);
    s.on("annotation:updated", onUpdated);
    s.on("annotation:deleted", onDeleted);

    return () => {
      s.off("annotation:added", onAdded);
      s.off("annotation:updated", onUpdated);
      s.off("annotation:deleted", onDeleted);
    };
  }, [projectId, planVersionId, qc, push]);
}

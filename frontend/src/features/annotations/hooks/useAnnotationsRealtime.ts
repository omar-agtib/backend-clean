// src/features/annotations/hooks/useAnnotationsRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, joinProjectRoom } from "../../../lib/ws";
import { annotationKeys } from "../api/annotationKeys";
import { useToastStore } from "../../../store/toast.store";

export function useAnnotationsRealtime(planVersionId?: string | null) {
  const qc = useQueryClient();
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    if (!planVersionId) return;

    const s = getSocket();

    // If your ws requires joining project room, you can still call it.
    // But we only have planVersionId here; it’s ok to skip join.
    // If you have projectId available, call joinProjectRoom(projectId).

    const onAdded = (a: any) => {
      if (String(a?.planVersionId) !== String(planVersionId)) return;
      qc.invalidateQueries({ queryKey: annotationKeys.version(planVersionId) });
      push({
        kind: "success",
        title: "New pin added",
        message: a?.content || undefined,
      });
    };

    const onUpdated = (a: any) => {
      if (String(a?.planVersionId) !== String(planVersionId)) return;
      qc.invalidateQueries({ queryKey: annotationKeys.version(planVersionId) });
      push({ kind: "info", title: "Pin updated" });
    };

    const onDeleted = (p: any) => {
      // deleted payload is { annotationId }
      qc.invalidateQueries({ queryKey: annotationKeys.version(planVersionId) });
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
  }, [planVersionId, qc, push]);
}

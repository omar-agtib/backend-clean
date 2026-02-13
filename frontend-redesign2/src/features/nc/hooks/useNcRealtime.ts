// src/features/nc/hooks/useNcRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, joinProjectRoom } from "../../../lib/ws";
import { ncKeys } from "../api/ncKeys";
import { useToastStore } from "../../../store/toast.store";

export function useNcRealtime(projectId?: string | null) {
  const qc = useQueryClient();
  const push = useToastStore((s) => s.push);

  useEffect(() => {
    if (!projectId) return;

    const s = getSocket();
    joinProjectRoom(projectId);

    const onCreated = (nc: any) => {
      qc.invalidateQueries({ queryKey: ncKeys.project(projectId) });
      push({
        kind: "success",
        title: "New NC created",
        message: nc?.title ? String(nc.title) : undefined,
      });
    };

    const onUpdated = (nc: any) => {
      qc.invalidateQueries({ queryKey: ncKeys.project(projectId) });
      push({
        kind: "info",
        title: "NC updated",
        message: nc?.title ? String(nc.title) : undefined,
      });
    };

    const onValidated = (nc: any) => {
      qc.invalidateQueries({ queryKey: ncKeys.project(projectId) });
      push({
        kind: "success",
        title: "NC validated ✅",
        message: nc?.title ? String(nc.title) : undefined,
      });
    };

    s.on("nc:created", onCreated);
    s.on("nc:updated", onUpdated);
    s.on("nc:validated", onValidated);

    return () => {
      s.off("nc:created", onCreated);
      s.off("nc:updated", onUpdated);
      s.off("nc:validated", onValidated);
    };
  }, [projectId, qc, push]);
}

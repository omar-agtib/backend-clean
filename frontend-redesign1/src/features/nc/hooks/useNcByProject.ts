// src/features/nc/hooks/useNcByProject.ts
import { useQuery } from "@tanstack/react-query";
import { listNcByProject } from "../api/nc.api";
import { ncKeys } from "../api/ncKeys";

export function useNcByProject(projectId?: string | null) {
  return useQuery({
    queryKey: projectId ? ncKeys.project(projectId) : ncKeys.all,
    queryFn: () => listNcByProject(projectId as string),
    enabled: !!projectId,
  });
}

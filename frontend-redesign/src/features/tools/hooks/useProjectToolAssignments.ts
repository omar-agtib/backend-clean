// src/features/tools/hooks/useProjectToolAssignments.ts
import { useQuery } from "@tanstack/react-query";
import {
  listActiveAssignedByProjectApi,
  listAssignmentsByProjectApi,
} from "../api/tools.api";
import { toolKeys } from "../api/toolKeys";

export function useActiveAssignedTools(projectId?: string | null) {
  return useQuery({
    queryKey: projectId
      ? toolKeys.activeAssignedByProject(projectId)
      : toolKeys.all,
    queryFn: () => listActiveAssignedByProjectApi(projectId as string),
    enabled: !!projectId,
  });
}

export function useAssignmentsHistory(projectId?: string | null) {
  return useQuery({
    queryKey: projectId
      ? toolKeys.assignmentsByProject(projectId)
      : toolKeys.all,
    queryFn: () => listAssignmentsByProjectApi(projectId as string),
    enabled: !!projectId,
  });
}

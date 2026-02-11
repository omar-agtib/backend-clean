// src/features/projects/hooks/useProjectMembers.ts
import { useQuery } from "@tanstack/react-query";
import { getProject } from "../api/projectMembers.api";

export function useProjectMembers(projectId?: string | null) {
  const q = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId as string),
    enabled: !!projectId,
  });

  const members =
    q.data?.members?.map((m) => ({
      role: m.role,
      // userId is populated object now
      user:
        typeof m.userId === "string"
          ? { _id: m.userId, name: m.userId, email: "", role: "" }
          : m.userId,
    })) || [];

  const membersMap = members.reduce<Record<string, string>>((acc, m) => {
    acc[m.user._id] = m.user.name || m.user.email || m.user._id;
    return acc;
  }, {});

  return {
    ...q,
    members,
    membersMap, // ✅ id -> name
  };
}

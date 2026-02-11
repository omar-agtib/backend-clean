import { useQuery } from "@tanstack/react-query";
import { projectsKeys } from "../api/projectKeys";
import { getMyProjects } from "../api/project.api";

export function useMyProjects() {
  return useQuery({
    queryKey: projectsKeys.mine(),
    queryFn: getMyProjects,
  });
}

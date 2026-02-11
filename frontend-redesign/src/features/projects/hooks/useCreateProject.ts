import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectApi, type CreateProjectDto } from "../api/project.api";
import { projectsKeys } from "../api/projectKeys";

export function useCreateProject() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProjectDto) => createProjectApi(dto),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: projectsKeys.mine() });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { progressApi } from "@/lib/api/progress";
import { uiStore } from "@/store/ui-store";

export const useSummary = (projectId: string) => {
  return useQuery({
    queryKey: ["progress-summary", projectId],
    queryFn: () => progressApi.getSummary(projectId),
    enabled: !!projectId,
  });
};

export const useMilestones = (projectId: string) => {
  return useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => progressApi.getMilestones(projectId),
    enabled: !!projectId,
  });
};

export const useCreateMilestone = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: { projectId: string; name: string }) =>
      progressApi.createMilestone(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["progress-summary", variables.projectId],
      });
      addNotification({
        type: "success",
        message: "Milestone created successfully",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create milestone";
      addNotification({ type: "error", message });
    },
  });
};

export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: ({
      milestoneId,
      progress,
    }: {
      milestoneId: string;
      progress: number;
    }) => progressApi.updateMilestone(milestoneId, progress),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", data.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["progress-summary", data.projectId],
      });
      addNotification({ type: "success", message: "Progress updated" });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update progress";
      addNotification({ type: "error", message });
    },
  });
};

export const useDeleteMilestone = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (milestoneId: string) =>
      progressApi.deleteMilestone(milestoneId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["milestones", data.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["progress-summary", data.projectId],
      });
      addNotification({ type: "success", message: "Milestone deleted" });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete milestone";
      addNotification({ type: "error", message });
    },
  });
};

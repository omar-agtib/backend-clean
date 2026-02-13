import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qualityApi } from "@/lib/api/quality";
import { uiStore } from "@/store/ui-store";

export const useNonConformities = (projectId: string) => {
  return useQuery({
    queryKey: ["non-conformities", projectId],
    queryFn: () => qualityApi.getNonConformities(projectId),
    enabled: !!projectId,
  });
};

export const useCreateNC = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: {
      projectId: string;
      title: string;
      description?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      assignedTo?: string;
      planId?: string;
      planVersionId?: string;
      annotationId?: string;
      comment?: string;
    }) => qualityApi.createNC(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["non-conformities", data.projectId],
      });
      addNotification({ type: "success", message: "Non-conformity reported" });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create NC";
      addNotification({ type: "error", message });
    },
  });
};

export const useAssignNC = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: ({
      ncId,
      assignedTo,
      projectId,
    }: {
      ncId: string;
      assignedTo: string;
      projectId: string;
    }) => qualityApi.assignNC(ncId, assignedTo),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["non-conformities", variables.projectId],
      });
      addNotification({ type: "success", message: "NC assigned successfully" });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to assign NC";
      addNotification({ type: "error", message });
    },
  });
};

export const useChangeNCStatus = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: ({
      ncId,
      status,
      comment,
      projectId,
    }: {
      ncId: string;
      status: string;
      comment?: string;
      projectId: string;
    }) => qualityApi.changeStatus(ncId, status, comment),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["non-conformities", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["nc-history", variables.ncId],
      });
      addNotification({ type: "success", message: "Status updated" });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update status";
      addNotification({ type: "error", message });
    },
  });
};

export const useNCHistory = (ncId: string) => {
  return useQuery({
    queryKey: ["nc-history", ncId],
    queryFn: () => qualityApi.getHistory(ncId),
    enabled: !!ncId,
  });
};

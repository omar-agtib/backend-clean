import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toolsApi } from "@/lib/api/tools";
import { uiStore } from "@/store/ui-store";

// ✅ Inventory
export const useAllTools = () => {
  return useQuery({
    queryKey: ["tools-inventory"],
    queryFn: () => toolsApi.getAllTools(),
  });
};

export const useAvailableTools = () => {
  return useQuery({
    queryKey: ["tools-available"],
    queryFn: () => toolsApi.getAvailableTools(),
  });
};

export const useCreateTool = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: { name: string; serialNumber?: string }) =>
      toolsApi.createTool(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["tools-available"] });
      addNotification({
        type: "success",
        message: "Tool created successfully",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create tool";
      addNotification({ type: "error", message });
    },
  });
};

// ✅ Assignments
export const useAssignments = (projectId: string) => {
  return useQuery({
    queryKey: ["tool-assignments", projectId],
    queryFn: () => toolsApi.getAssignments(projectId),
    enabled: !!projectId,
  });
};

export const useActiveAssignments = (projectId: string) => {
  return useQuery({
    queryKey: ["tool-assignments-active", projectId],
    queryFn: () => toolsApi.getActiveAssignments(projectId),
    enabled: !!projectId,
  });
};

export const useAssignTool = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: {
      toolId: string;
      projectId: string;
      assignedTo: string;
    }) => toolsApi.assignTool(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tool-assignments", data.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["tool-assignments-active", data.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["tools-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["tools-available"] });
      addNotification({
        type: "success",
        message: "Tool assigned successfully",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to assign tool";
      addNotification({ type: "error", message });
    },
  });
};

export const useReturnTool = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: { toolId: string }) => toolsApi.returnTool(data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["tool-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["tool-assignments-active"] });
      queryClient.invalidateQueries({ queryKey: ["tools-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["tools-available"] });
      addNotification({
        type: "success",
        message: "Tool returned successfully",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to return tool";
      addNotification({ type: "error", message });
    },
  });
};

// ✅ Maintenance
export const useMaintenance = (projectId: string) => {
  return useQuery({
    queryKey: ["tool-maintenance", projectId],
    queryFn: () => toolsApi.getMaintenance(projectId),
    enabled: !!projectId,
  });
};

export const useStartMaintenance = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: {
      toolId: string;
      projectId: string;
      description: string;
    }) => toolsApi.startMaintenance(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["tool-maintenance", data.projectId],
      });
      queryClient.invalidateQueries({ queryKey: ["tools-inventory"] });
      addNotification({ type: "success", message: "Maintenance started" });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to start maintenance";
      addNotification({ type: "error", message });
    },
  });
};

export const useCompleteMaintenance = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: { maintenanceId: string }) =>
      toolsApi.completeMaintenance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tool-maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["tools-inventory"] });
      addNotification({ type: "success", message: "Maintenance completed" });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to complete maintenance";
      addNotification({ type: "error", message });
    },
  });
};

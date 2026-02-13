import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { planningApi } from "@/lib/api/planning";
import { uiStore } from "@/store/ui-store";

// ✅ Plans
export const usePlans = (projectId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["plans", projectId, params],
    queryFn: () => planningApi.getPlans(projectId, params),
    enabled: !!projectId,
  });
};

export const usePlan = (planId: string) => {
  return useQuery({
    queryKey: ["plans", planId],
    queryFn: () => planningApi.getPlan(planId),
    enabled: !!planId,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: { projectId: string; name: string }) =>
      planningApi.createPlan(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["plans", variables.projectId],
      });
      addNotification({
        type: "success",
        message: "Plan created successfully",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create plan";
      addNotification({ type: "error", message });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: Partial<any> }) =>
      planningApi.updatePlan(planId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      addNotification({
        type: "success",
        message: "Plan updated successfully",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update plan";
      addNotification({ type: "error", message });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (planId: string) => planningApi.deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      addNotification({
        type: "success",
        message: "Plan deleted successfully",
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete plan";
      addNotification({ type: "error", message });
    },
  });
};

// ✅ Plan Versions
export const usePlanVersions = (planId: string) => {
  return useQuery({
    queryKey: ["plan-versions", planId],
    queryFn: () => planningApi.getPlanVersions(planId),
    enabled: !!planId,
  });
};

export const useUploadPlanVersion = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: ({ planId, file }: { planId: string; file: File }) =>
      planningApi.uploadPlanVersion(planId, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["plan-versions", variables.planId],
      });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      addNotification({
        type: "success",
        message: "Version uploaded successfully",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to upload version";
      addNotification({ type: "error", message });
    },
  });
};

export const useDeletePlanVersion = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (versionId: string) => planningApi.deletePlanVersion(versionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan-versions"] });
      addNotification({
        type: "success",
        message: "Version deleted successfully",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete version";
      addNotification({ type: "error", message });
    },
  });
};

// ✅ Annotations
export const useAnnotations = (planVersionId: string) => {
  return useQuery({
    queryKey: ["annotations", planVersionId],
    queryFn: () => planningApi.getAnnotations(planVersionId),
    enabled: !!planVersionId,
  });
};

export const useCreateAnnotation = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: Partial<any>) => planningApi.createAnnotation(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["annotations", data.planVersionId],
      });
      addNotification({
        type: "success",
        message: "Annotation created successfully",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create annotation";
      addNotification({ type: "error", message });
    },
  });
};

export const useUpdateAnnotation = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: ({
      annotationId,
      data,
    }: {
      annotationId: string;
      data: Partial<any>;
    }) => planningApi.updateAnnotation(annotationId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["annotations", data.planVersionId],
      });
      addNotification({
        type: "success",
        message: "Annotation updated successfully",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update annotation";
      addNotification({ type: "error", message });
    },
  });
};

export const useDeleteAnnotation = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (annotationId: string) =>
      planningApi.deleteAnnotation(annotationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations"] });
      addNotification({
        type: "success",
        message: "Annotation deleted successfully",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete annotation";
      addNotification({ type: "error", message });
    },
  });
};

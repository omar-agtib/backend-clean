import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stockApi } from "@/lib/api/stock";
import { uiStore } from "@/store/ui-store";

// ✅ Products (Global Catalog)
export const useAllProducts = () => {
  return useQuery({
    queryKey: ["products-catalog"],
    queryFn: () => stockApi.getAllProducts(),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: { name: string; sku?: string; unit?: string }) =>
      stockApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-catalog"] });
      addNotification({
        type: "success",
        message: "Product created successfully",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create product";
      addNotification({ type: "error", message });
    },
  });
};

// ✅ Stock Items (Project inventory)
export const useStockByProject = (projectId: string) => {
  return useQuery({
    queryKey: ["stock-items", projectId],
    queryFn: () => stockApi.getStockByProject(projectId),
    enabled: !!projectId,
  });
};

export const useCreateStockItem = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: {
      projectId: string;
      productId: string;
      quantity?: number;
      location?: string;
    }) => stockApi.createStockItem(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["stock-items", data.projectId],
      });
      addNotification({ type: "success", message: "Stock item added" });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to add stock item";
      addNotification({ type: "error", message });
    },
  });
};

export const useAdjustStock = () => {
  const queryClient = useQueryClient();
  const { addNotification } = uiStore();

  return useMutation({
    mutationFn: (data: {
      stockItemId: string;
      projectId: string;
      type: "IN" | "OUT";
      quantity: number;
      reason: string;
    }) => stockApi.adjustStock(data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["stock-items", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["stock-movements", variables.projectId],
      });
      addNotification({
        type: "success",
        message: `Stock ${variables.type === "IN" ? "added" : "removed"}`,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to adjust stock";
      addNotification({ type: "error", message });
    },
  });
};

// ✅ Stock Movements (History)
export const useMovementsByProject = (projectId: string) => {
  return useQuery({
    queryKey: ["stock-movements", projectId],
    queryFn: () => stockApi.getMovementsByProject(projectId),
    enabled: !!projectId,
  });
};

export const useMovementsByItem = (stockItemId: string) => {
  return useQuery({
    queryKey: ["stock-movements", stockItemId],
    queryFn: () => stockApi.getMovementsByItem(stockItemId),
    enabled: !!stockItemId,
  });
};

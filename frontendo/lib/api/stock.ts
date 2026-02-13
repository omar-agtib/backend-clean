import { apiClient } from "./client";
import type { Product, StockMovement, PaginatedResponse } from "@/types";

export const stockApi = {
  // ✅ Products (Global Catalog)
  getAllProducts: async () => {
    const response = await apiClient.get<any[]>("/api/products");
    return {
      items: response.data,
      total: response.data.length,
      page: 1,
      pageSize: response.data.length,
      totalPages: 1,
    };
  },

  createProduct: async (data: {
    name: string;
    sku?: string;
    unit?: string;
  }) => {
    const response = await apiClient.post("/api/products", data);
    return response.data;
  },

  // ✅ Stock Items (Project-specific inventory)
  getStockByProject: async (projectId: string) => {
    const response = await apiClient.get<any[]>(
      `/api/stock/project/${projectId}`,
    );
    return {
      items: response.data,
      total: response.data.length,
      page: 1,
      pageSize: response.data.length,
      totalPages: 1,
    };
  },

  createStockItem: async (data: {
    projectId: string;
    productId: string;
    quantity?: number;
    location?: string;
  }) => {
    const response = await apiClient.post("/api/stock/items", data);
    return response.data;
  },

  getStockItem: async (stockItemId: string) => {
    const response = await apiClient.get(`/api/stock/items/${stockItemId}`);
    return response.data;
  },

  adjustStock: async (data: {
    stockItemId: string;
    type: "IN" | "OUT";
    quantity: number;
    reason: string;
  }) => {
    const response = await apiClient.post("/api/stock/adjust", data);
    return response.data;
  },

  // ✅ Stock Movements (History)
  getMovementsByProject: async (projectId: string) => {
    const response = await apiClient.get<StockMovement[]>(
      `/api/stock/project/${projectId}/movements`,
    );
    return response.data;
  },

  getMovementsByItem: async (stockItemId: string) => {
    const response = await apiClient.get<StockMovement[]>(
      `/api/stock/items/${stockItemId}/movements`,
    );
    return response.data;
  },
};

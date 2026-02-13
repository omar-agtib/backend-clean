// src/features/stock/api/stock.api.ts
import { http } from "../../../lib/http";

export type StockMovementType = "IN" | "OUT";

export type ProductRef = {
  _id: string;
  name: string;
  sku?: string;
  unit?: string;
};

export type StockItem = {
  _id: string;
  projectId: string;

  // backend populate("productId")
  productId: string | ProductRef;

  quantity: number;
  location?: string;

  createdAt: string;
  updatedAt: string;
};

export type StockMovement = {
  _id: string;
  projectId: string;

  // backend populate:
  // stockItemId -> StockItem, and inside it productId
  stockItemId:
    | string
    | (StockItem & {
        productId?: ProductRef | string;
      });

  type: StockMovementType;
  quantity: number;

  // backend uses reason
  reason?: string;

  // backend populate userId "name email role"
  userId?:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
        role?: string;
      };

  createdAt: string;
  updatedAt: string;
};

export type CreateStockItemDto = {
  projectId: string;
  productId: string;
  quantity?: number; // ✅ backend expects quantity
  location?: string;
};

export type AdjustStockDto = {
  stockItemId: string;
  type: StockMovementType;
  quantity: number;
  reason?: string; // ✅ backend expects reason
};

export async function createStockItem(dto: CreateStockItemDto) {
  const { data } = await http.post<StockItem>("/stock/items", dto);
  return data;
}

export async function listStockItemsByProject(projectId: string) {
  const { data } = await http.get<StockItem[]>(`/stock/project/${projectId}`);
  return data;
}

export async function listProjectMovements(projectId: string) {
  const { data } = await http.get<StockMovement[]>(
    `/stock/project/${projectId}/movements`
  );
  return data;
}

export async function getStockItem(stockItemId: string) {
  const { data } = await http.get<StockItem>(`/stock/items/${stockItemId}`);
  return data;
}

export async function listMovementsByStockItem(stockItemId: string) {
  const { data } = await http.get<StockMovement[]>(
    `/stock/items/${stockItemId}/movements`
  );
  return data;
}

export async function adjustStock(dto: AdjustStockDto) {
  const { data } = await http.post<StockItem>("/stock/adjust", dto);
  return data;
}

// src/features/stock/api/products.api.ts
import { http } from "../../../lib/http";

export type Product = {
  _id: string;
  name: string;

  sku?: string;
  unit?: string;

  createdAt: string;
  updatedAt: string;
};

export type CreateProductDto = {
  name: string;
  sku?: string;
  unit?: string;
};

export async function listProducts() {
  const { data } = await http.get<Product[]>("/products");
  return data;
}

export async function createProduct(dto: CreateProductDto) {
  const { data } = await http.post<Product>("/products", dto);
  return data;
}

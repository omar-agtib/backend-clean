import { apiClient } from './client'
import type { Product, StockItem, StockMovement } from '@/types'

export const stockApi = {
  // Products
  getProducts: (projectId: string, params?: Record<string, any>) =>
    apiClient.get(`/api/projects/${projectId}/products`, { params }),

  getProduct: (projectId: string, productId: string) =>
    apiClient.get(`/api/projects/${projectId}/products/${productId}`),

  createProduct: (projectId: string, data: Partial<Product>) =>
    apiClient.post(`/api/projects/${projectId}/products`, data),

  updateProduct: (projectId: string, productId: string, data: Partial<Product>) =>
    apiClient.put(`/api/projects/${projectId}/products/${productId}`, data),

  deleteProduct: (projectId: string, productId: string) =>
    apiClient.delete(`/api/projects/${projectId}/products/${productId}`),

  // Stock Items
  getStockItems: (projectId: string, productId: string) =>
    apiClient.get(`/api/projects/${projectId}/products/${productId}/stock-items`),

  createStockItem: (projectId: string, productId: string, data: Partial<StockItem>) =>
    apiClient.post(`/api/projects/${projectId}/products/${productId}/stock-items`, data),

  updateStockItem: (projectId: string, productId: string, itemId: string, data: Partial<StockItem>) =>
    apiClient.put(`/api/projects/${projectId}/products/${productId}/stock-items/${itemId}`, data),

  deleteStockItem: (projectId: string, productId: string, itemId: string) =>
    apiClient.delete(`/api/projects/${projectId}/products/${productId}/stock-items/${itemId}`),

  // Stock Movements
  getMovements: (projectId: string, params?: Record<string, any>) =>
    apiClient.get(`/api/projects/${projectId}/stock-movements`, { params }),

  createMovement: (projectId: string, data: Partial<StockMovement>) =>
    apiClient.post(`/api/projects/${projectId}/stock-movements`, data),

  // Stock Summary
  getStockSummary: (projectId: string) =>
    apiClient.get(`/api/projects/${projectId}/stock/summary`),
}

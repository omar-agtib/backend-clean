import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { stockApi } from '@/lib/api/stock'

export const useProducts = (projectId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['products', projectId, params],
    queryFn: () => stockApi.getProducts(projectId, params),
    enabled: !!projectId,
  })
}

export const useProduct = (projectId: string, productId: string) => {
  return useQuery({
    queryKey: ['products', projectId, productId],
    queryFn: () => stockApi.getProduct(projectId, productId),
    enabled: !!projectId && !!productId,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      stockApi.createProduct(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['stock-summary', variables.projectId] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, productId, data }: { projectId: string; productId: string; data: any }) =>
      stockApi.updateProduct(projectId, productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.projectId] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, productId }: { projectId: string; productId: string }) =>
      stockApi.deleteProduct(projectId, productId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.projectId] })
    },
  })
}

export const useStockItems = (projectId: string, productId: string) => {
  return useQuery({
    queryKey: ['stock-items', projectId, productId],
    queryFn: () => stockApi.getStockItems(projectId, productId),
    enabled: !!projectId && !!productId,
  })
}

export const useCreateStockItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, productId, data }: { projectId: string; productId: string; data: any }) =>
      stockApi.createStockItem(projectId, productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stock-items', variables.projectId, variables.productId] })
    },
  })
}

export const useStockMovements = (projectId: string, params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['stock-movements', projectId, params],
    queryFn: () => stockApi.getMovements(projectId, params),
    enabled: !!projectId,
  })
}

export const useCreateMovement = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      stockApi.createMovement(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['stock-summary', variables.projectId] })
    },
  })
}

export const useStockSummary = (projectId: string) => {
  return useQuery({
    queryKey: ['stock-summary', projectId],
    queryFn: () => stockApi.getStockSummary(projectId),
    enabled: !!projectId,
  })
}

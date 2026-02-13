'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useProducts, useStockSummary } from '@/hooks/useStock'
import { LoadingState } from '@/components/common/loading-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Search, Package } from 'lucide-react'

export default function StockPage() {
  const searchParams = useSearchParams()
  const projectId = searchParams.get('project')
  const [search, setSearch] = useState('')
  const { data: products, isLoading } = useProducts(projectId || '', { search })
  const { data: summary } = useStockSummary(projectId || '')

  if (!projectId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please select a project first</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock</h1>
          <p className="text-muted-foreground mt-2">Manage product inventory</p>
        </div>
        <Button size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {summary?.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-3xl font-bold mt-2">{summary.data.totalProducts || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-3xl font-bold mt-2">{summary.data.totalItems || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{summary.data.lowStockCount || 0}</p>
          </Card>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : products?.items && products.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.items.map((product: any) => (
            <Card key={product._id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-slate-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm"><span className="font-medium">SKU:</span> {product.sku}</p>
                    <p className="text-sm"><span className="font-medium">Stock:</span> {product.stock || 0} units</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No products found. Add one to get started.</p>
        </Card>
      )}
    </div>
  )
}

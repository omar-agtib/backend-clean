"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStockByProject, useMovementsByProject } from "@/hooks/useStock";
import { LoadingState } from "@/components/common/loading-state";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Search,
  FolderOpen,
  Package,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { StockItemCard } from "@/components/stock/stock-item-card";
import { MovementCard } from "@/components/stock/movement-card";
import { CreateProductDialog } from "@/components/stock/create-product-dialog";
import { AddStockDialog } from "@/components/stock/add-stock-dialog";
import { AdjustStockDialog } from "@/components/stock/adjust-stock-dialog";

export default function StockPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const [search, setSearch] = useState("");
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [adjustDialog, setAdjustDialog] = useState<{
    open: boolean;
    stockItemId?: string;
    stockItemName?: string;
    currentQuantity?: number;
    type?: "IN" | "OUT";
  }>({ open: false });

  const { data: stock, isLoading: stockLoading } = useStockByProject(
    projectId || "",
  );
  const { data: movements, isLoading: movementsLoading } =
    useMovementsByProject(projectId || "");

  const handleAdjust = (stockItemId: string, type: "IN" | "OUT") => {
    const item = stock?.items?.find((i: any) => i._id === stockItemId);
    setAdjustDialog({
      open: true,
      stockItemId,
      stockItemName: item?.productId?.name,
      currentQuantity: item?.quantity,
      type,
    });
  };

  const filteredStock = stock?.items?.filter((item: any) =>
    item.productId?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const lowStockItems =
    stock?.items?.filter((item: any) => item.quantity < 10) || [];
  const totalItems =
    stock?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) ||
    0;

  if (!projectId) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No Project Selected"
        description="Please select a project from the dropdown in the navbar"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stock</h1>
            <p className="text-muted-foreground mt-2">
              Manage inventory, track movements, and monitor stock levels
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateProductOpen(true)}
            >
              Add Product
            </Button>
            <Button size="lg" onClick={() => setIsAddStockOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">
                  {stock?.items?.length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Quantity</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
                <p className="text-2xl font-bold">{lowStockItems.length}</p>
              </div>
            </div>
          </Card>
        </div>

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

        <Tabs defaultValue="inventory" className="w-full">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="movements">Movements</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4 mt-6">
            {stockLoading ? (
              <LoadingState />
            ) : !filteredStock || filteredStock.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No Stock Items"
                description="Add products to this project's inventory to get started"
                action={
                  <Button onClick={() => setIsAddStockOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stock
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStock.map((item: any) => (
                  <StockItemCard
                    key={item._id}
                    item={item}
                    onAdjust={handleAdjust}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="movements" className="space-y-4 mt-6">
            {movementsLoading ? (
              <LoadingState />
            ) : !movements || movements.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="No Movements Yet"
                description="Stock movements will appear here when you add or remove inventory"
              />
            ) : (
              <div className="space-y-3">
                {movements.map((movement: any) => (
                  <MovementCard key={movement._id} movement={movement} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <CreateProductDialog
        open={isCreateProductOpen}
        onOpenChange={setIsCreateProductOpen}
      />
      <AddStockDialog
        projectId={projectId}
        open={isAddStockOpen}
        onOpenChange={setIsAddStockOpen}
      />
      <AdjustStockDialog
        projectId={projectId}
        stockItemId={adjustDialog.stockItemId}
        stockItemName={adjustDialog.stockItemName}
        currentQuantity={adjustDialog.currentQuantity}
        type={adjustDialog.type}
        open={adjustDialog.open}
        onOpenChange={(open) => setAdjustDialog({ ...adjustDialog, open })}
      />
    </>
  );
}

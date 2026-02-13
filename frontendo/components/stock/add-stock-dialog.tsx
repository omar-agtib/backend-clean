"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllProducts, useCreateStockItem } from "@/hooks/useStock";

interface AddStockDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStockDialog({
  projectId,
  open,
  onOpenChange,
}: AddStockDialogProps) {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [location, setLocation] = useState("");

  const { data: products } = useAllProducts();
  const createStockItem = useCreateStockItem();

  const handleAdd = async () => {
    if (!productId) return;

    try {
      await createStockItem.mutateAsync({
        projectId,
        productId,
        quantity: parseInt(quantity) || 0,
        location: location.trim() || undefined,
      });
      setProductId("");
      setQuantity("0");
      setLocation("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add stock:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Stock Item</DialogTitle>
          <DialogDescription>
            Add a product to this project's inventory
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product..." />
              </SelectTrigger>
              <SelectContent>
                {products?.items?.map((product: any) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name} ({product.unit || "pcs"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Initial Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="e.g., Warehouse A, Site Storage..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!productId || createStockItem.isPending}
          >
            {createStockItem.isPending ? "Adding..." : "Add to Inventory"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

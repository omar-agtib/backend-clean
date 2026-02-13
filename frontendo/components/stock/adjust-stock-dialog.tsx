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
import { Textarea } from "@/components/ui/textarea";
import { useAdjustStock } from "@/hooks/useStock";

interface AdjustStockDialogProps {
  projectId: string;
  stockItemId?: string;
  stockItemName?: string;
  currentQuantity?: number;
  type?: "IN" | "OUT";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdjustStockDialog({
  projectId,
  stockItemId,
  stockItemName,
  currentQuantity = 0,
  type = "IN",
  open,
  onOpenChange,
}: AdjustStockDialogProps) {
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const adjustStock = useAdjustStock();

  const handleAdjust = async () => {
    if (!stockItemId || !quantity || !reason.trim()) return;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) return;

    try {
      await adjustStock.mutateAsync({
        stockItemId,
        projectId,
        type,
        quantity: qty,
        reason: reason.trim(),
      });
      setQuantity("1");
      setReason("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to adjust stock:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "IN" ? "Add Stock" : "Remove Stock"}
          </DialogTitle>
          <DialogDescription>
            {stockItemName && `Adjust quantity for ${stockItemName}`}
            <br />
            Current: {currentQuantity} units
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={type === "OUT" ? currentQuantity : undefined}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Received shipment, Used in Project X..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAdjust}
            disabled={!quantity || !reason.trim() || adjustStock.isPending}
          >
            {adjustStock.isPending
              ? "Adjusting..."
              : `${type === "IN" ? "Add" : "Remove"} Stock`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

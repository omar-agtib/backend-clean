"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Minus, MapPin } from "lucide-react";

interface StockItemCardProps {
  item: any;
  onAdjust?: (stockItemId: string, type: "IN" | "OUT") => void;
}

export function StockItemCard({ item, onAdjust }: StockItemCardProps) {
  const isLowStock = item.quantity < 10; // Simple threshold

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isLowStock
              ? "bg-orange-100 dark:bg-orange-900/20"
              : "bg-blue-100 dark:bg-blue-900/20"
          }`}
        >
          <Package
            className={`h-6 w-6 ${
              isLowStock
                ? "text-orange-600 dark:text-orange-400"
                : "text-blue-600 dark:text-blue-400"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {item.productId?.name || "Unknown Product"}
              </h3>
              {item.productId?.sku && (
                <p className="text-xs text-muted-foreground mt-1">
                  SKU: {item.productId.sku}
                </p>
              )}
            </div>
            <Badge variant={isLowStock ? "destructive" : "default"}>
              {item.quantity} {item.productId?.unit || "pcs"}
            </Badge>
          </div>

          {item.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <MapPin className="h-3 w-3" />
              <span>{item.location}</span>
            </div>
          )}

          <div className="flex gap-2">
            {onAdjust && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAdjust(item._id, "IN")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAdjust(item._id, "OUT")}
                  disabled={item.quantity === 0}
                >
                  <Minus className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

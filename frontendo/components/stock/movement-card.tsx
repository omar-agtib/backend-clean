"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, User, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils/formatting";

interface MovementCardProps {
  movement: any;
}

export function MovementCard({ movement }: MovementCardProps) {
  const isIn = movement.type === "IN";

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isIn
              ? "bg-emerald-100 dark:bg-emerald-900/20"
              : "bg-red-100 dark:bg-red-900/20"
          }`}
        >
          {isIn ? (
            <ArrowUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="font-medium">
              {movement.stockItemId?.productId?.name || "Unknown Product"}
            </h4>
            <Badge variant={isIn ? "default" : "destructive"}>
              {isIn ? "+" : "-"}
              {movement.quantity}
            </Badge>
          </div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            {movement.reason && <p className="truncate">{movement.reason}</p>}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{movement.userId?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(movement.createdAt, "MMM DD, YYYY")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

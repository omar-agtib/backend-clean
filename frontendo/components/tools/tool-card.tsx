"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, User, Calendar } from "lucide-react";

interface ToolCardProps {
  tool: any;
  onAssign?: (toolId: string) => void;
  onMaintenance?: (toolId: string) => void;
}

export function ToolCard({ tool, onAssign, onMaintenance }: ToolCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Wrench className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{tool.name}</h3>
              {tool.serialNumber && (
                <p className="text-xs text-muted-foreground mt-1">
                  SN: {tool.serialNumber}
                </p>
              )}
            </div>
            <Badge className={getStatusColor(tool.status)}>{tool.status}</Badge>
          </div>

          <div className="flex gap-2 mt-3">
            {tool.status === "AVAILABLE" && onAssign && (
              <Button size="sm" onClick={() => onAssign(tool._id)}>
                Assign
              </Button>
            )}
            {tool.status === "AVAILABLE" && onMaintenance && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMaintenance(tool._id)}
              >
                Maintenance
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

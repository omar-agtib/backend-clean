"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, User, Calendar, X } from "lucide-react";
import { formatDate } from "@/lib/utils/formatting";

interface AssignmentCardProps {
  assignment: any;
  onReturn?: (toolId: string) => void;
}

export function AssignmentCard({ assignment, onReturn }: AssignmentCardProps) {
  const isActive = !assignment.returnedAt;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium">
              {assignment.toolId?.name || `Tool ${assignment.toolId}`}
            </h4>
            <div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>
                  {typeof assignment.assignedTo === "string"
                    ? assignment.assignedTo
                    : assignment.assignedTo?.name || "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  Assigned {formatDate(assignment.assignedAt, "MMM DD, YYYY")}
                </span>
              </div>
              {!isActive && assignment.returnedAt && (
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Returned {formatDate(assignment.returnedAt, "MMM DD, YYYY")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {isActive && onReturn && (
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              onReturn(assignment.toolId?._id || assignment.toolId)
            }
          >
            <X className="h-4 w-4 mr-1" />
            Return
          </Button>
        )}
      </div>
    </Card>
  );
}

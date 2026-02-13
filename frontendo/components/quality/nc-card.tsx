"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  User,
  Calendar,
  MoreVertical,
  UserPlus,
} from "lucide-react";
import { formatDate } from "@/lib/utils/formatting";

interface NCCardProps {
  nc: any;
  onAssign?: (ncId: string) => void;
  onChangeStatus?: (ncId: string, status: string) => void;
}

export function NCCard({ nc, onAssign, onChangeStatus }: NCCardProps) {
  const router = useRouter();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "HIGH":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "LOW":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "RESOLVED":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
      case "VALIDATED":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getNextStatus = (currentStatus: string) => {
    const transitions: Record<string, string[]> = {
      OPEN: ["IN_PROGRESS"],
      IN_PROGRESS: ["RESOLVED"],
      RESOLVED: ["VALIDATED", "IN_PROGRESS"],
      VALIDATED: [],
    };
    return transitions[currentStatus] || [];
  };

  const nextStatuses = getNextStatus(nc.status);

  return (
    <Card
      className={`p-4 border-l-4 hover:shadow-md transition-shadow ${
        nc.priority === "CRITICAL"
          ? "border-l-red-500"
          : nc.priority === "HIGH"
            ? "border-l-orange-500"
            : nc.priority === "MEDIUM"
              ? "border-l-yellow-500"
              : "border-l-blue-500"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3
                className="font-semibold text-lg cursor-pointer hover:text-primary"
                onClick={() => router.push(`/quality/${nc._id}`)}
              >
                {nc.title}
              </h3>
              {nc.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {nc.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!nc.assignedTo && onAssign && (
                  <DropdownMenuItem onClick={() => onAssign(nc._id)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign
                  </DropdownMenuItem>
                )}
                {nextStatuses.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() =>
                      onChangeStatus && onChangeStatus(nc._id, status)
                    }
                  >
                    Move to {status.replace("_", " ")}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={getPriorityColor(nc.priority)}>
              {nc.priority}
            </Badge>
            <Badge className={getStatusColor(nc.status)}>
              {nc.status.replace("_", " ")}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {nc.assignedTo && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>
                  {typeof nc.assignedTo === "string"
                    ? nc.assignedTo
                    : nc.assignedTo?.name || "Unknown"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(nc.createdAt, "MMM DD, YYYY")}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

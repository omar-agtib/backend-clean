"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  FileText,
  Package,
  DollarSign,
  Wrench,
  Target,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/lib/api/notifications";

interface NotificationCardProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationCard({
  notification,
  onClick,
}: NotificationCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "NC_ASSIGNED":
      case "NC_VALIDATED":
        return <AlertCircle className="h-4 w-4" />;
      case "TOOL_ASSIGNED":
        return <Wrench className="h-4 w-4" />;
      case "INVOICE_PAID":
      case "INVOICE_CANCELLED":
        return <DollarSign className="h-4 w-4" />;
      case "MILESTONE_COMPLETED":
        return <Target className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    if (type.includes("NC")) return "text-red-600 dark:text-red-400";
    if (type.includes("TOOL")) return "text-blue-600 dark:text-blue-400";
    if (type.includes("INVOICE"))
      return "text-emerald-600 dark:text-emerald-400";
    if (type.includes("MILESTONE"))
      return "text-purple-600 dark:text-purple-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div
      className={`p-3 hover:bg-muted/50 transition-colors cursor-pointer border-l-2 ${
        notification.isRead ? "border-transparent" : "border-primary"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${getColor(notification.type)}`}>
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm font-medium ${notification.isRead ? "text-muted-foreground" : ""}`}
            >
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            )}
          </div>
          {notification.message && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

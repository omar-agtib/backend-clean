import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/cn";

interface NotificationBellProps {
  unreadCount: number;
  className?: string;
}

export default function NotificationBell({
  unreadCount,
  className,
}: NotificationBellProps) {
  return (
    <Link
      to="/app/notifications"
      className={cn(
        "relative inline-flex items-center justify-center h-10 w-10 rounded-xl transition duration-200",
        "bg-card border border-border hover:bg-muted",
        "text-foreground hover:text-primary",
        className
      )}
      title={`${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}

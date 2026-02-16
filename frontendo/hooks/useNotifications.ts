import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";
import { useEffect } from "react";

export const useNotifications = (params?: {
  projectId?: string;
  unreadOnly?: boolean;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationsApi.getNotifications(params),
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
  });
};

export const useUnreadCount = () => {
  const { data: notifications } = useNotifications({ unreadOnly: true });
  return notifications?.filter((n) => !n.isRead).length || 0;
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId?: string) =>
      notificationsApi.markAllAsRead(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// WebSocket integration for real-time notifications
export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // This would connect to your WebSocket
    // For now, we'll use polling via refetchInterval in useNotifications
    // Example WebSocket integration (when you add it):
    /*
    const socket = io(process.env.NEXT_PUBLIC_WS_URL)
    
    socket.on('notification:new', (notification) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      // Optionally show toast notification
    })
    
    return () => {
      socket.disconnect()
    }
    */
  }, [queryClient]);
};

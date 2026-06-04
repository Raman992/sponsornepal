"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
  markAsRead,
  markAllAsRead,
  removeNotification,
} from "@/actions/notification.actions";

export function useNotifications(limit?: number) {
  return useQuery({
    queryKey: ["notifications", limit],
    queryFn: async () => {
      const result = await fetchNotifications(limit);
      if (!result.success) throw new Error(result.error);
      return result.notifications;
    },
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      const result = await fetchUnreadNotificationCount();
      if (!result.success) throw new Error(result.error);
      return result.count;
    },
    refetchInterval: 30000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const result = await markAsRead(notificationId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await markAllAsRead();
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useRemoveNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const result = await removeNotification(notificationId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

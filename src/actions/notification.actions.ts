"use server";

import { authService } from "@/services/auth.service";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/repositories/notification.repository";
import { revalidatePath } from "next/cache";

export async function fetchNotifications(limit?: number) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", notifications: [] };
  }

  const notifications = await getNotifications(user.id, limit || 20);
  return { success: true, notifications };
}

export async function fetchUnreadNotificationCount() {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", count: 0 };
  }

  const count = await getUnreadNotificationCount(user.id);
  return { success: true, count };
}

export async function markAsRead(notificationId: string) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await markNotificationAsRead(notificationId, user.id);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/notifications");
  return { success: true };
}

export async function markAllAsRead() {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await markAllNotificationsAsRead(user.id);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/notifications");
  return { success: true };
}

export async function removeNotification(notificationId: string) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await deleteNotification(notificationId, user.id);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/notifications");
  return { success: true };
}
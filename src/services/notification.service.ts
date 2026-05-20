import {
  getNotifications,
  getUnreadCount,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createBulkNotifications,
} from "@/repositories/notification.repository";
import type { Notification } from "@/types";

export class NotificationService {
  async getNotifications(userId: string, limit: number = 20) {
    if (!userId) {
      return [];
    }
    return getNotifications(userId, limit);
  }

  async getUnreadCount(userId: string) {
    if (!userId) {
      return 0;
    }
    return getUnreadCount(userId);
  }

  async createNotification(data: {
    user_id: string;
    title: string;
    message: string;
  }) {
    if (!data.user_id || !data.title || !data.message) {
      return { success: false, error: "All fields are required" };
    }

    return createNotification(data);
  }

  async markAsRead(notificationId: string, userId: string) {
    if (!notificationId || !userId) {
      return { success: false, error: "Notification ID and User ID are required" };
    }

    return markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId: string) {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    return markAllAsRead(userId);
  }

  async deleteNotification(notificationId: string, userId: string) {
    if (!notificationId || !userId) {
      return { success: false, error: "Notification ID and User ID are required" };
    }

    return deleteNotification(notificationId, userId);
  }

  async createBulkNotifications(
    notifications: Array<{
      user_id: string;
      title: string;
      message: string;
    }>
  ) {
    if (!notifications || notifications.length === 0) {
      return { success: false, error: "Notifications are required" };
    }

    return createBulkNotifications(notifications);
  }
}

export const notificationService = new NotificationService();

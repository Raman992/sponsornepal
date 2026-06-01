import {
  getNotifications,
  getUnreadNotificationCount,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
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
    return getUnreadNotificationCount(userId);
  }

  async createNotification(userId: string, title: string, message: string) {
    if (!userId || !title || !message) {
      return { success: false, error: "All fields are required" };
    }

    return createNotification(userId, title, message);
  }

  async markAsRead(notificationId: string, userId: string) {
    if (!notificationId || !userId) {
      return { success: false, error: "Notification ID and User ID are required" };
    }

    return markNotificationAsRead(notificationId, userId);
  }

  async markAllAsRead(userId: string) {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    return markAllNotificationsAsRead(userId);
  }

  async deleteNotification(notificationId: string, userId: string) {
    if (!notificationId || !userId) {
      return { success: false, error: "Notification ID and User ID are required" };
    }

    return deleteNotification(notificationId, userId);
  }

  async createBulkNotifications(
    notifications: Array<{
      userId: string;
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

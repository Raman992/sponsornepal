import { createClient } from "@/lib/supabase/server";
import type { Notification } from "@/types";

export async function getNotifications(
  userId: string,
  limit: number = 20
): Promise<Notification[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return (data || []) as Notification[];
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error getting unread notification count:", error);
    return 0;
  }

  return count || 0;
}

export async function createNotification(
  userId: string,
  title: string,
  message: string
): Promise<{ success: boolean; notification?: Notification; error?: string }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      message,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: error.message };
  }

  return { success: true, notification: data as Notification };
}

export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function markAllNotificationsAsRead(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteNotification(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting notification:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function createBulkNotifications(
  notifications: { userId: string; title: string; message: string }[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const insertData = notifications.map((n) => ({
    user_id: n.userId,
    title: n.title,
    message: n.message,
    is_read: false,
  }));

  const { error } = await supabase.from("notifications").insert(insertData);

  if (error) {
    console.error("Error creating bulk notifications:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
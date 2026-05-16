import { createClient } from "@/lib/supabase/server";
import type { Conversation, Message, User } from "@/types";

export async function getConversations(userId: string): Promise<Conversation[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      creator:users!conversations_creator_id_fkey(id, full_name, avatar_url, role),
      brand:users!conversations_brand_id_fkey(id, full_name, avatar_url, role)
    `)
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }

  return (data || []) as Conversation[];
}

export async function getConversation(
  conversationId: string,
  userId: string
): Promise<Conversation | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      creator:users!conversations_creator_id_fkey(id, full_name, avatar_url, role),
      brand:users!conversations_brand_id_fkey(id, full_name, avatar_url, role)
    `)
    .eq("id", conversationId)
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
    .single();

  if (error) {
    console.error("Error fetching conversation:", error);
    return null;
  }

  return data as Conversation;
}

export async function getOrCreateConversation(
  userId: string,
  otherUserId: string
): Promise<{ success: boolean; conversation?: Conversation; error?: string }> {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .or(`and(creator_id.eq.${userId},brand_id.eq.${otherUserId}),and(creator_id.eq.${otherUserId},brand_id.eq.${userId})`)
    .single();

  if (existing) {
    return { success: true, conversation: { id: existing.id } as Conversation };
  }

  const { data: creatorData } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  const { data: otherData } = await supabase
    .from("users")
    .select("role")
    .eq("id", otherUserId)
    .single();

  let creatorId = userId;
  let brandId = otherUserId;

  if (creatorData?.role === "brand" && otherData?.role === "creator") {
    creatorId = otherUserId;
    brandId = userId;
  }

  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({
      creator_id: creatorId,
      brand_id: brandId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    return { success: false, error: error.message };
  }

  return { success: true, conversation };
}

export async function getMessages(
  conversationId: string,
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:users(id, full_name, avatar_url, role)
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return (data || []) as Message[];
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<{ success: boolean; message?: Message; error?: string }> {
  const supabase = createClient();

  const { data: message, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      is_read: false,
    })
    .select(`
      *,
      sender:users(id, full_name, avatar_url, role)
    `)
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return { success: false, error: error.message };
  }

  return { success: true, message: message as Message };
}

export async function markMessagesAsRead(
  conversationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId);

  if (error) {
    console.error("Error marking messages as read:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id")
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`);

  if (!conversations || conversations.length === 0) return 0;

  const conversationIds = conversations.map((c) => c.id);

  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact" })
    .in("conversation_id", conversationIds)
    .neq("sender_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }

  return count || 0;
}

export async function getConversationByUsers(
  userId: string,
  otherUserId: string
): Promise<Conversation | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`and(creator_id.eq.${userId},brand_id.eq.${otherUserId}),and(creator_id.eq.${otherUserId},brand_id.eq.${userId})`)
    .single();

  if (error) {
    return null;
  }

  return data as Conversation;
}

export async function getLatestMessage(
  conversationId: string
): Promise<Message | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select(`
      *,
      sender:users(id, full_name, avatar_url, role)
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data as Message;
}
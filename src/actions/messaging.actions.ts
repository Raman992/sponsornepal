"use server";

import { authService } from "@/services/auth.service";
import {
  getConversations,
  getConversation,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  getLatestMessage,
} from "@/repositories/message.repository";
import { createNotification } from "@/repositories/notification.repository";
import { revalidatePath } from "next/cache";

export async function fetchConversations() {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", conversations: [] };
  }

  const conversations = await getConversations(user.id);

  const conversationsWithMessages = await Promise.all(
    conversations.map(async (conv) => {
      const otherUser = conv.creator_id === user.id ? conv.brand : conv.creator;
      const latestMessage = await getLatestMessage(conv.id);
      return { ...conv, otherUser, latestMessage };
    })
  );

  return { success: true, conversations: conversationsWithMessages };
}

export async function fetchConversation(conversationId: string) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", conversation: null };
  }

  const conversation = await getConversation(conversationId, user.id);
  if (!conversation) {
    return { success: false, error: "Conversation not found", conversation: null };
  }

  const otherUser =
    conversation.creator_id === user.id
      ? conversation.brand
      : conversation.creator;

  return { success: true, conversation: { ...conversation, otherUser } };
}

export async function fetchMessages(conversationId: string, offset?: number) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", messages: [] };
  }

  const conversation = await getConversation(conversationId, user.id);
  if (!conversation) {
    return { success: false, error: "Conversation not found", messages: [] };
  }

  await markMessagesAsRead(conversationId, user.id);

  const messages = await getMessages(conversationId, user.id, 50, offset || 0);

  revalidatePath(`/dashboard/messages/${conversationId}`);

  return { success: true, messages };
}

export async function sendNewMessage(
  conversationId: string,
  content: string
) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const conversation = await getConversation(conversationId, user.id);
  if (!conversation) {
    return { success: false, error: "Conversation not found" };
  }

  const result = await sendMessage(conversationId, user.id, content);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  const otherUserId =
    conversation.creator_id === user.id
      ? conversation.brand_id
      : conversation.creator_id;

  await createNotification(
    otherUserId,
    "New Message",
    `You have a new message from ${user.full_name || "a user"}`
  );

  revalidatePath(`/dashboard/messages/${conversationId}`);

  return { success: true, message: result.message };
}

export async function startConversation(otherUserId: string) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", conversationId: null };
  }

  if (user.id === otherUserId) {
    return { success: false, error: "Cannot start conversation with yourself", conversationId: null };
  }

  const result = await getOrCreateConversation(user.id, otherUserId);
  if (!result.success) {
    return { success: false, error: result.error, conversationId: null };
  }

  return { success: true, conversationId: result.conversation?.id };
}

export async function getUnreadMessageCount() {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", count: 0 };
  }

  const count = await getUnreadCount(user.id);
  return { success: true, count };
}

export async function getOrCreateConversationAction(otherUserId: string) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", conversationId: null };
  }

  const result = await getOrCreateConversation(user.id, otherUserId);
  if (!result.success) {
    return { success: false, error: result.error, conversationId: null };
  }

  return { success: true, conversationId: result.conversation?.id };
}
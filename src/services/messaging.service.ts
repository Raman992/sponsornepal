import {
  getConversations,
  getConversation,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  getConversationByUsers,
  getLatestMessage,
} from "@/repositories/message.repository";
import type { Conversation, Message } from "@/types";

export class MessagingService {
  async getConversations(userId: string) {
    if (!userId) {
      return [];
    }
    return getConversations(userId);
  }

  async getConversation(conversationId: string, userId: string) {
    if (!conversationId || !userId) {
      return null;
    }
    return getConversation(conversationId, userId);
  }

  async getOrCreateConversation(userId: string, otherUserId: string) {
    if (!userId || !otherUserId) {
      return { success: false, error: "Both user IDs are required" };
    }

    if (userId === otherUserId) {
      return { success: false, error: "Cannot create conversation with yourself" };
    }

    return getOrCreateConversation(userId, otherUserId);
  }

  async getMessages(
    conversationId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0
  ) {
    if (!conversationId || !userId) {
      return [];
    }
    return getMessages(conversationId, userId, limit, offset);
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    if (!conversationId || !senderId || !content) {
      return { success: false, error: "All fields are required" };
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return { success: false, error: "Message cannot be empty" };
    }

    if (trimmedContent.length > 5000) {
      return { success: false, error: "Message is too long (max 5000 characters)" };
    }

    return sendMessage(conversationId, senderId, trimmedContent);
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    if (!conversationId || !userId) {
      return { success: false, error: "Conversation ID and User ID are required" };
    }

    return markMessagesAsRead(conversationId, userId);
  }

  async getUnreadCount(userId: string) {
    if (!userId) {
      return 0;
    }
    return getUnreadCount(userId);
  }

  async getConversationByUsers(userId: string, otherUserId: string) {
    return getConversationByUsers(userId, otherUserId);
  }

  async getLatestMessage(conversationId: string) {
    return getLatestMessage(conversationId);
  }
}

export const messagingService = new MessagingService();

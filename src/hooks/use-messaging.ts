"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchConversations,
  fetchConversation,
  fetchMessages,
  sendNewMessage,
  startConversation,
  getUnreadMessageCount,
  getOrCreateConversationAction,
} from "@/actions/messaging.actions";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const result = await fetchConversations();
      if (!result.success) throw new Error(result.error);
      return result.conversations;
    },
  });
}

export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: async () => {
      const result = await fetchConversation(conversationId);
      if (!result.success) throw new Error(result.error);
      return result.conversation;
    },
    enabled: !!conversationId,
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const result = await fetchMessages(conversationId);
      if (!result.success) throw new Error(result.error);
      return result.messages;
    },
    enabled: !!conversationId,
  });
}

export function useUnreadMessageCount() {
  return useQuery({
    queryKey: ["messages", "unread"],
    queryFn: async () => {
      const result = await getUnreadMessageCount();
      if (!result.success) throw new Error(result.error);
      return result.count;
    },
    refetchInterval: 30000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => {
      const result = await sendNewMessage(conversationId, content);
      if (!result.success) throw new Error(result.error);
      return result.message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserId: string) => {
      const result = await startConversation(otherUserId);
      if (!result.success) throw new Error(result.error);
      return result.conversationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useGetOrCreateConversation() {
  return useMutation({
    mutationFn: async (otherUserId: string) => {
      const result = await getOrCreateConversationAction(otherUserId);
      if (!result.success) throw new Error(result.error);
      return result.conversationId;
    },
  });
}

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface UseRealtimeMessagesOptions {
  conversationId: string | null;
  onNewMessage: (message: any) => void;
  enabled?: boolean;
}

export function useRealtimeMessages({
  conversationId,
  onNewMessage,
  enabled = true,
}: UseRealtimeMessagesOptions) {
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!conversationId || !enabled) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          onNewMessage(payload.new);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId, enabled, supabase, onNewMessage]);
}

interface UseRealtimeNotificationsOptions {
  userId: string | null;
  onNewNotification: (notification: any) => void;
  enabled?: boolean;
}

export function useRealtimeNotifications({
  userId,
  onNewNotification,
  enabled = true,
}: UseRealtimeNotificationsOptions) {
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId || !enabled) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onNewNotification(payload.new);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, enabled, supabase, onNewNotification]);
}

interface UseRealtimeDealsOptions {
  userId: string | null;
  onDealUpdate: (deal: any) => void;
  enabled?: boolean;
}

export function useRealtimeDeals({
  userId,
  onDealUpdate,
  enabled = true,
}: UseRealtimeDealsOptions) {
  const supabase = createClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId || !enabled) {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const channel = supabase
      .channel(`deals:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deals",
          filter: `creator_id=eq.${userId}`,
        },
        (payload) => {
          onDealUpdate(payload.new);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deals",
          filter: `brand_id=eq.${userId}`,
        },
        (payload) => {
          onDealUpdate(payload.new);
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, enabled, supabase, onDealUpdate]);
}

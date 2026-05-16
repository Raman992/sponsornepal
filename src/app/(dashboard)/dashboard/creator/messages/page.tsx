"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchConversations } from "@/actions/messaging.actions";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Conversation, User as UserType } from "@/types";

interface ConversationWithMeta extends Conversation {
  otherUser: UserType | null;
  latestMessage: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
}

export default function CreatorMessagesPage() {
  const [conversations, setConversations] = useState<ConversationWithMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      const result = await fetchConversations();
      if (result.success) {
        setConversations(result.conversations as ConversationWithMeta[]);
      }
      setLoading(false);
    }
    loadConversations();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-20 bg-muted rounded-lg animate-pulse" />
        <div className="h-20 bg-muted rounded-lg animate-pulse" />
        <div className="h-20 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Your conversations with brands</p>
      </div>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Start a conversation by reaching out to brands or responding to their messages.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/dashboard/creator/messages/${conversation.id}`}
            >
              <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {conversation.otherUser?.avatar_url ? (
                      <img
                        src={conversation.otherUser.avatar_url}
                        alt={conversation.otherUser.full_name || "User"}
                      />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" />
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">
                        {conversation.otherUser?.full_name || "Brand"}
                      </h3>
                      {conversation.latestMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(conversation.latestMessage.created_at),
                            { addSuffix: true }
                          )}
                        </span>
                      )}
                    </div>
                    {conversation.latestMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.latestMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
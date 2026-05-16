"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchConversation, fetchMessages, sendNewMessage } from "@/actions/messaging.actions";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, User, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/auth-store";
import type { Message, User as UserType } from "@/types";

interface ConversationData {
  id: string;
  otherUser: UserType | null;
  creator: UserType | null;
  brand: UserType | null;
}

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { user } = useAuthStore();
  
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      const convResult = await fetchConversation(conversationId);
      if (convResult.success && convResult.conversation) {
        setConversation(convResult.conversation as ConversationData);
      }
      
      const msgResult = await fetchMessages(conversationId);
      if (msgResult.success) {
        setMessages(msgResult.messages);
      }
      
      setLoading(false);
    }
    
    if (conversationId) {
      loadData();
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const result = await sendNewMessage(conversationId, newMessage.trim());
    
    if (result.success && result.message) {
      setMessages((prev) => [...prev, result.message!]);
      setNewMessage("");
    }
    
    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversation?.otherUser) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Conversation not found</p>
        <Link href="/dashboard/creator/messages">
          <Button variant="link" className="mt-2">Back to messages</Button>
        </Link>
      </div>
    );
  }

  const otherUser = conversation.otherUser;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b bg-card">
        <Link href="/dashboard/creator/messages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Avatar className="h-10 w-10">
          {otherUser.avatar_url ? (
            <img src={otherUser.avatar_url} alt={otherUser.full_name || "User"} />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
        </Avatar>
        <div>
          <h2 className="font-semibold">{otherUser.full_name || "User"}</h2>
          <p className="text-xs text-muted-foreground capitalize">{otherUser.role}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {message.created_at &&
                      formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                      })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
            className="flex-1"
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
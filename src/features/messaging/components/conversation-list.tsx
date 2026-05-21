import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";

interface ConversationListProps {
  conversations: Array<{
    id: string;
    otherUser: {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
    latestMessage: {
      content: string;
      created_at: string;
      sender_id: string;
    } | null;
    unreadCount: number;
  }>;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
        <p className="text-sm text-muted-foreground">
          Start a conversation by reaching out to creators or brands.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => {
        const isActive = conversation.id === activeConversationId;

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={cn(
              "w-full p-4 rounded-lg transition-colors text-left",
              isActive
                ? "bg-primary/10 border-l-4 border-primary"
                : "hover:bg-accent/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={conversation.otherUser?.avatar_url || undefined}
                  />
                  <AvatarFallback>
                    {conversation.otherUser?.full_name
                      ? conversation.otherUser.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                {conversation.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold truncate">
                    {conversation.otherUser?.full_name || "User"}
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
                  <p
                    className={cn(
                      "text-sm truncate",
                      conversation.unreadCount > 0
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {conversation.latestMessage.content}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string | null;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-4">
        <div>
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isOwn = message.sender_id === currentUserId;
        const showAvatar =
          index === 0 || messages[index - 1].sender_id !== message.sender_id;

        return (
          <div
            key={message.id}
            className={cn("flex gap-3", isOwn && "flex-row-reverse")}
          >
            <div className={cn("flex-shrink-0", !showAvatar && "invisible")}>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={message.sender?.avatar_url || undefined}
                />
                <AvatarFallback>
                  {message.sender?.full_name
                    ? message.sender.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2",
                isOwn
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted rounded-tl-sm"
              )}
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
              <p
                className={cn(
                  "text-xs mt-1",
                  isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                )}
              >
                {formatDistanceToNow(new Date(message.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

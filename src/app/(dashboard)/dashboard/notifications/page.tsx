"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Trash2,
  MessageSquare,
  Handshake,
  FileText,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { toast } from "@/store/ui-store";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: "message" | "deal" | "application" | "payment" | "system";
}

const typeIcons: Record<string, React.ElementType> = {
  message: MessageSquare,
  deal: Handshake,
  application: FileText,
  payment: DollarSign,
  system: Bell,
};

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      setTimeout(() => {
        setNotifications([
          {
            id: "1",
            title: "New Message",
            message: "Tech Brand Co sent you a message about the Tech Product Launch campaign.",
            isRead: false,
            createdAt: "2024-01-16T10:30:00Z",
            type: "message",
          },
          {
            id: "2",
            title: "Application Accepted",
            message: "Your application to Fashion Brand Collaboration has been accepted!",
            isRead: false,
            createdAt: "2024-01-15T14:20:00Z",
            type: "application",
          },
          {
            id: "3",
            title: "Deal Created",
            message: "A new deal has been created for Tech Product Launch. Agreed amount: NPR 35,000.",
            isRead: true,
            createdAt: "2024-01-14T09:15:00Z",
            type: "deal",
          },
          {
            id: "4",
            title: "Payment Released",
            message: "Payment of NPR 25,000 has been released to your account.",
            isRead: true,
            createdAt: "2024-01-12T16:45:00Z",
            type: "payment",
          },
          {
            id: "5",
            title: "Profile Verified",
            message: "Congratulations! Your creator profile has been verified.",
            isRead: true,
            createdAt: "2024-01-10T11:00:00Z",
            type: "system",
          },
        ]);
        setIsLoading(false);
      }, 500);
    };

    loadNotifications();
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification deleted");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-semibold">Notifications</h1>
                <p className="text-sm text-muted-foreground">Stay updated with your activity</p>
              </div>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount} unread</Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You&apos;re all caught up! Notifications will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => {
                const Icon = typeIcons[notification.type] || Bell;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={cn(
                        "hover-lift",
                        !notification.isRead && "border-l-4 border-l-primary"
                      )}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                              !notification.isRead
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold mb-1">
                                  {notification.title}
                                  {!notification.isRead && (
                                    <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(notification.id)}
                                className="flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

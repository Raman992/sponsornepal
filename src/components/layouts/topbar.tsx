"use client";

import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 backdrop-blur px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden h-10 w-10 items-center justify-center rounded-xl hover:bg-accent transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {actions}

        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/notifications" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
          </Link>
        </Button>

        <div className="flex items-center gap-3 border-l pl-4 ml-2">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">{user?.full_name || "User"}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          
          <Link href="/dashboard/profile" className="block">
            <Avatar className="h-9 w-9 ring-2 ring-primary/10">
              <AvatarImage src={user?.avatar_url || undefined} alt={user?.full_name || "User"} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
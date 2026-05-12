"use client";

import { useState, type ReactNode } from "react";
import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import type { User, UserRole } from "@/types";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface DashboardShellProps {
  children: ReactNode;
  user: User | null;
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = user?.role || "creator";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar role={role as UserRole} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 md:max-w-md lg:max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search campaigns, creators, messages..."
                className="pl-10 w-full rounded-lg bg-muted/50 border-border/50 focus:bg-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-lg relative hidden sm:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"></span>
            </Button>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                    <AvatarImage src={user?.avatar_url || ""} alt={user?.full_name || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white font-medium">
                      {user ? getInitials(user.full_name || "U") : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.full_name || "User"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${role}`}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${role}/profile`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/${role}/settings`}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

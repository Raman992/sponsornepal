"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Briefcase,
  MessageSquare,
  Handshake,
  Bell,
  Settings,
  Users,
  FileText,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/actions/auth.actions";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const creatorNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard/creator", icon: LayoutDashboard },
  { title: "My Profile", href: "/dashboard/creator/profile", icon: User },
  { title: "Campaigns", href: "/dashboard/creator/campaigns", icon: Briefcase },
  { title: "Applications", href: "/dashboard/creator/applications", icon: FileText },
  { title: "Messages", href: "/dashboard/creator/messages", icon: MessageSquare },
  { title: "Deals", href: "/dashboard/creator/deals", icon: Handshake },
];

const brandNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard/brand", icon: LayoutDashboard },
  { title: "My Profile", href: "/dashboard/brand/profile", icon: User },
  { title: "Campaigns", href: "/dashboard/brand/campaigns", icon: Briefcase },
  { title: "Creators", href: "/dashboard/brand/creators", icon: Users },
  { title: "Messages", href: "/dashboard/brand/messages", icon: MessageSquare },
  { title: "Deals", href: "/dashboard/brand/deals", icon: Handshake },
];

const adminNavItems: NavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Campaigns", href: "/admin/campaigns", icon: Briefcase },
  { title: "Transactions", href: "/admin/transactions", icon: DollarSign },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const navItems = user?.role === "admin" 
    ? adminNavItems 
    : user?.role === "brand" 
      ? brandNavItems 
      : creatorNavItems;

  const handleSignOut = async () => {
    await signOutAction();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-all duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/sponsornepal_logo.png"
              alt="SponsorNepal"
              width={40}
              height={40}
              className="h-10 w-auto rounded-lg"
            />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold tracking-tight"
              >
                SponsorNepal
              </motion.span>
            )}
          </Link>
          
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t p-4">
          {sidebarOpen ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
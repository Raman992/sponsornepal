"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import {
  LayoutDashboard,
  User,
  FileText,
  MessageSquare,
  Briefcase,
  Settings,
  Users,
  BarChart3,
  Shield,
  X,
} from "lucide-react";

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

const creatorLinks = [
  { href: "/dashboard/creator", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/creator/profile", icon: User, label: "My Profile" },
  { href: "/dashboard/creator/campaigns", icon: FileText, label: "Browse Campaigns" },
  { href: "/dashboard/creator/applications", icon: Briefcase, label: "Applications" },
  { href: "/dashboard/creator/deals", icon: Briefcase, label: "Deals" },
  { href: "/dashboard/creator/messages", icon: MessageSquare, label: "Messages" },
  { href: "/dashboard/creator/settings", icon: Settings, label: "Settings" },
];

const brandLinks = [
  { href: "/dashboard/brand", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/brand/profile", icon: User, label: "Company Profile" },
  { href: "/dashboard/brand/campaigns", icon: FileText, label: "My Campaigns" },
  { href: "/dashboard/brand/creators", icon: Users, label: "Discover Creators" },
  { href: "/dashboard/brand/deals", icon: Briefcase, label: "Deals" },
  { href: "/dashboard/brand/messages", icon: MessageSquare, label: "Messages" },
  { href: "/dashboard/brand/settings", icon: Settings, label: "Settings" },
];

const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/creators", icon: User, label: "Creators" },
  { href: "/admin/campaigns", icon: FileText, label: "Campaigns" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const links = role === "admin" ? adminLinks : role === "brand" ? brandLinks : creatorLinks;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transition-transform duration-300 md:translate-x-0 md:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-sidebar-accent">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-semibold">SponsorNepal</span>
            </Link>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-sidebar-accent md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-accent">
            <div className="p-3 rounded-lg bg-sidebar-accent">
              <p className="text-xs text-sidebar-foreground">
                {role === "creator" && "Creator Dashboard"}
                {role === "brand" && "Brand Dashboard"}
                {role === "admin" && "Admin Panel"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
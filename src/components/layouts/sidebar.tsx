"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
  Sparkles,
  X,
  Crown,
  Zap,
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
  { href: "/dashboard/creator/deals", icon: Zap, label: "Deals" },
  { href: "/dashboard/creator/messages", icon: MessageSquare, label: "Messages" },
  { href: "/dashboard/creator/settings", icon: Settings, label: "Settings" },
];

const brandLinks = [
  { href: "/dashboard/brand", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/brand/profile", icon: User, label: "Company Profile" },
  { href: "/dashboard/brand/campaigns", icon: FileText, label: "My Campaigns" },
  { href: "/dashboard/brand/creators", icon: Users, label: "Discover Creators" },
  { href: "/dashboard/brand/deals", icon: Zap, label: "Deals" },
  { href: "/dashboard/brand/messages", icon: MessageSquare, label: "Messages" },
  { href: "/dashboard/brand/settings", icon: Settings, label: "Settings" },
];

const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/creators", icon: Crown, label: "Creators" },
  { href: "/admin/campaigns", icon: FileText, label: "Campaigns" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

const roleConfig = {
  creator: {
    links: creatorLinks,
    badge: "Creator",
    badgeColor: "from-emerald-500 to-teal-500",
    icon: Sparkles,
  },
  brand: {
    links: brandLinks,
    badge: "Brand",
    badgeColor: "from-blue-500 to-indigo-500",
    icon: Briefcase,
  },
  admin: {
    links: adminLinks,
    badge: "Admin",
    badgeColor: "from-violet-500 to-purple-500",
    icon: Crown,
  },
};

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const config = roleConfig[role] || roleConfig.creator;
  const RoleIcon = config.icon;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r border-border transition-transform duration-300 ease-out md:translate-x-0 md:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary via-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold tracking-tight">
                Sponsor<span className="text-primary">Nepal</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Menu
            </div>
            {config.links.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                      isActive
                        ? "bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg shadow-primary/25"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      isActive 
                        ? "bg-white/20" 
                        : "bg-sidebar-accent group-hover:bg-sidebar-accent/80"
                    )}>
                      <link.icon className="h-4 w-4" />
                    </div>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="p-4 rounded-xl bg-gradient-to-br from-sidebar-accent to-transparent border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.badgeColor} flex items-center justify-center shadow-lg`}>
                  <RoleIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-sidebar-foreground">{config.badge} Dashboard</p>
                  <p className="text-xs text-muted-foreground">v1.0.0</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-sidebar-accent rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-primary to-violet-500 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Profile 75% complete</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

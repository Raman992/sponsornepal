"use client";

import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./topbar";
import { Toaster } from "@/components/shared/toaster";
import { AuthLoader, Providers } from "@/providers/auth-provider";

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardShell({ children, title, description, actions }: DashboardShellProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <Providers>
      <AuthLoader>
        <div className="min-h-screen bg-background">
          <DashboardSidebar />
          
          <div
            className={cn(
              "transition-all duration-300",
              sidebarOpen ? "lg:pl-64" : "lg:pl-20"
            )}
          >
            <DashboardHeader title={title} description={description} actions={actions} />
            
            <main className="p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
          
          <Toaster />
        </div>
      </AuthLoader>
    </Providers>
  );
}

export { DashboardSidebar } from "./sidebar";
export { DashboardHeader } from "./topbar";
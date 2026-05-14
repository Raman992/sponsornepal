"use client";

import { DashboardSidebar } from "@/components/layouts/sidebar";
import { Toaster } from "@/components/shared/toaster";
import { AuthLoader, Providers } from "@/providers/auth-provider";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <main className="min-h-screen">
              {children}
            </main>
          </div>
          
          <Toaster />
        </div>
      </AuthLoader>
    </Providers>
  );
}
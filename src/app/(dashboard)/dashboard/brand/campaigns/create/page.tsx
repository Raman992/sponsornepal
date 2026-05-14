"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useUIStore } from "@/store/ui-store";
import { CampaignForm } from "@/components/forms/campaign-form";
import { cn } from "@/lib/utils";

export default function CreateCampaignPage() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-4 md:px-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/brand/campaigns">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Create New Campaign</h1>
              <p className="text-sm text-muted-foreground">Set up your campaign for creators</p>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CampaignForm />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
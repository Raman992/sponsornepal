"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Eye,
  Ban,
  Search,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { toast } from "@/store/ui-store";
import {
  getAdminCampaignsAction,
  cancelCampaignAction,
  type AdminCampaign,
} from "@/actions/admin.actions";
import Link from "next/link";

export default function AdminCampaignsPage() {
  const { sidebarOpen } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCampaigns = useCallback(async (search?: string) => {
    setIsFetching(true);
    const result = await getAdminCampaignsAction(search);
    if (result.success && result.data) {
      setCampaigns(result.data);
    }
    setIsFetching(false);
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampaigns(searchQuery || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchCampaigns]);

  const handleCancel = async (campaignId: string) => {
    setIsLoading(true);
    const result = await cancelCampaignAction(campaignId);
    if (result.success) {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, status: "cancelled" } : c))
      );
      toast.success("Campaign cancelled");
    } else {
      toast.error(result.error || "Failed to cancel campaign");
    }
    setIsLoading(false);
  };

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    open: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    completed: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

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
            <div>
              <h1 className="text-lg font-semibold">Campaign Moderation</h1>
              <p className="text-sm text-muted-foreground">Review and moderate campaigns</p>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {[
              { label: "Total Campaigns", value: campaigns.length },
              { label: "Open", value: campaigns.filter((c) => c.status === "open").length },
              { label: "In Progress", value: campaigns.filter((c) => c.status === "in_progress").length },
              { label: "Completed", value: campaigns.filter((c) => c.status === "completed").length },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Campaigns</CardTitle>
              <CardDescription>Monitor and moderate brand campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <Skeleton className="h-4 w-48 mb-2" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : campaigns.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No campaigns found</p>
              ) : (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{campaign.title}</h3>
                          <Badge className={statusColors[campaign.status]}>
                            {campaign.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">by {campaign.brand_name || "Unknown Brand"}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                          {campaign.budget && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              NPR {campaign.budget.toLocaleString()}
                            </span>
                          )}
                          {campaign.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(campaign.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/campaigns/${campaign.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        {campaign.status !== "cancelled" && campaign.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleCancel(campaign.id)}
                            disabled={isLoading}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

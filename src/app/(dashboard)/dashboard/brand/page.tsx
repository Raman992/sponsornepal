"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Users,
  FileText,
  MessageSquare,
  Handshake,
  DollarSign,
  ArrowRight,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { useBrandCampaigns, useCampaignStats } from "@/hooks/use-campaigns";
import { useActiveDeals } from "@/hooks/use-deals";
import { cn } from "@/lib/utils";

export default function BrandDashboardPage() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  const { data: campaignStats, isLoading: statsLoading } = useCampaignStats(user?.id || "");
  const { data: campaigns = [], isLoading: campaignsLoading } = useBrandCampaigns(user?.id || "");
  const { data: activeDeals = [], isLoading: dealsLoading } = useActiveDeals();

  const isLoading = statsLoading || campaignsLoading || dealsLoading;

  const stats = {
    activeCampaigns: campaignStats?.open || 0,
    totalCampaigns: campaignStats?.total || 0,
    completedCampaigns: campaignStats?.completed || 0,
    openDeals: activeDeals.length,
  };

  const recentCampaigns = (campaigns || []).slice(0, 3);

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
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div>
              <h1 className="text-lg font-semibold">Brand Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.full_name || "Brand"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild>
                <Link href="/dashboard/brand/campaigns/create">
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass" className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-neutral-500/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-neutral-600" />
                    </div>
                    <Badge variant="secondary" className="bg-neutral-500/10 text-neutral-600">Active</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">{statsLoading ? <Skeleton className="h-8 w-12" /> : stats.activeCampaigns}</div>
                    <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-neutral-500/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-neutral-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">{statsLoading ? <Skeleton className="h-8 w-12" /> : stats.totalCampaigns}</div>
                    <p className="text-sm text-muted-foreground">Total Campaigns</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass" className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">{statsLoading ? <Skeleton className="h-8 w-12" /> : stats.completedCampaigns}</div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="glass" className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Handshake className="h-6 w-6 text-amber-600" />
                    </div>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">Active</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">{dealsLoading ? <Skeleton className="h-8 w-12" /> : stats.openDeals}</div>
                    <p className="text-sm text-muted-foreground">Active Deals</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/dashboard/brand/campaigns/create">
                <Card variant="elevated" className="h-full group hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-neutral-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
                        <Plus className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Create Campaign</h3>
                        <p className="text-sm text-muted-foreground">Post new opportunity</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/creators">
                <Card variant="elevated" className="h-full group hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-500 to-neutral-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                        <Users className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Discover Creators</h3>
                        <p className="text-sm text-muted-foreground">Find perfect matches</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/dashboard/brand/deals">
                <Card variant="elevated" className="h-full group hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                        <DollarSign className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Manage Deals</h3>
                        <p className="text-sm text-muted-foreground">Track & pay creators</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">Your Campaigns</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/brand/campaigns">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignsLoading ? (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      ))}
                    </>
                  ) : recentCampaigns.length > 0 ? (
                    recentCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{campaign.title}</h4>
                          <Badge
                            variant={campaign.status === "open" ? "default" : "secondary"}
                            className={cn(
                              campaign.status === "open" && "bg-emerald-500/10 text-emerald-600",
                              campaign.status === "in_progress" && "bg-neutral-500/10 text-neutral-600",
                              campaign.status === "draft" && "bg-amber-500/10 text-amber-600"
                            )}
                          >
                            {campaign.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {campaign.budget && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              NPR {campaign.budget.toLocaleString()}
                            </span>
                          )}
                          {campaign.deadline && (
                            <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
                          )}
                        </div>
                        <Button size="sm" className="mt-3 w-full" variant="outline" asChild>
                          <Link href={`/dashboard/brand/campaigns/${campaign.id}`}>Manage</Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No campaigns yet</p>
                      <Button asChild className="mt-2">
                        <Link href="/dashboard/brand/campaigns/create">Create Campaign</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

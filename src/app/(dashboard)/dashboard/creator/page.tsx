"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  FileText,
  MessageSquare,
  Handshake,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  ArrowRight,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export default function CreatorDashboardPage() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeApplications: 0,
    activeDeals: 0,
    unreadMessages: 0,
    profileViews: 0,
  });
  const [recentApplications, setRecentApplications] = useState<{id: number; campaignTitle: string; brand: string; status: string; createdAt: string}[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<{id: number; title: string; budget: number; deadline: string; status: string}[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setTimeout(() => {
          setStats({
            activeApplications: 5,
            activeDeals: 2,
            unreadMessages: 3,
            profileViews: 145,
          });
          setRecentApplications([
            { id: 1, campaignTitle: "Tech Product Launch", brand: "Ncell", status: "pending", createdAt: "2024-01-15" },
            { id: 2, campaignTitle: "Fashion Brand Collaboration", brand: "Daraz", status: "accepted", createdAt: "2024-01-14" },
            { id: 3, campaignTitle: "Food Review Campaign", brand: "Foodmandu", status: "pending", createdAt: "2024-01-13" },
          ]);
          setActiveCampaigns([
            { id: 1, title: "Gaming Hardware Review", budget: 50000, deadline: "2024-02-01", status: "in_progress" },
            { id: 2, title: "Fitness App Promotion", budget: 30000, deadline: "2024-02-15", status: "open" },
          ]);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const initials = user?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

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
              <h1 className="text-lg font-semibold">Creator Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.full_name || "Creator"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <span className="relative">
                  <MessageSquare className="h-5 w-5" />
                  {stats.unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </span>
              </Button>
              
              <Link href="/dashboard/creator/profile">
                <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                  <AvatarImage src={user?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-neutral-600 text-white text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Link>
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
                      <FileText className="h-6 w-6 text-neutral-600" />
                    </div>
                    <Badge variant="secondary" className="bg-neutral-500/10 text-neutral-600">Active</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">{stats.activeApplications}</div>
                    <p className="text-sm text-muted-foreground">Active Applications</p>
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
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Handshake className="h-6 w-6 text-emerald-600" />
                    </div>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">Active</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">{stats.activeDeals}</div>
                    <p className="text-sm text-muted-foreground">Active Deals</p>
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
                    <div className="w-12 h-12 rounded-xl bg-neutral-500/10 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-neutral-600" />
                    </div>
                    <Badge variant="secondary" className="bg-neutral-500/10 text-neutral-600">
                      {stats.unreadMessages} new
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">{stats.unreadMessages}</div>
                    <p className="text-sm text-muted-foreground">Unread Messages</p>
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
                      <Eye className="h-6 w-6 text-amber-600" />
                    </div>
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                      +12%
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold">{stats.profileViews}</div>
                    <p className="text-sm text-muted-foreground">Profile Views</p>
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
              <Link href="/dashboard/creator/campaigns">
                <Card variant="elevated" className="h-full group hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-neutral-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
                        <Briefcase className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Browse Campaigns</h3>
                        <p className="text-sm text-muted-foreground">Find new opportunities</p>
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
              <Link href="/dashboard/creator/profile">
                <Card variant="elevated" className="h-full group hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-500 to-neutral-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                        <User className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Update Profile</h3>
                        <p className="text-sm text-muted-foreground">Improve visibility</p>
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
              <Link href="/dashboard/creator/messages">
                <Card variant="elevated" className="h-full group hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-500 to-neutral-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                        <TrendingUp className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Track Progress</h3>
                        <p className="text-sm text-muted-foreground">View analytics</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Applications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Recent Applications</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/creator/applications">
                      View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      <>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                        ))}
                      </>
                    ) : recentApplications.length > 0 ? (
                      recentApplications.map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-neutral-500/20 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{app.campaignTitle}</p>
                            <p className="text-sm text-muted-foreground">{app.brand}</p>
                          </div>
                          <Badge
                            variant={
                              app.status === "accepted"
                                ? "default"
                                : app.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {app.status}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">No applications yet</p>
                        <Button variant="link" asChild className="mt-2">
                          <Link href="/campaigns">Browse Campaigns</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Campaigns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Featured Campaigns</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/creator/campaigns">
                      Browse All <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      <>
                        {[1, 2].map((i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        ))}
                      </>
                    ) : activeCampaigns.length > 0 ? (
                      activeCampaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{campaign.title}</h4>
                            <Badge
                              variant={campaign.status === "open" ? "default" : "secondary"}
                              className="bg-emerald-500/10 text-emerald-600"
                            >
                              {campaign.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              NPR {campaign.budget.toLocaleString()}
                            </span>
                            <span>Deadline: {new Date(campaign.deadline).toLocaleDateString()}</span>
                          </div>
                          <Button size="sm" className="mt-3 w-full" variant="outline" asChild>
                            <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">No active campaigns</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
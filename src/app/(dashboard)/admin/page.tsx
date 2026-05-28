"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, DollarSign, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { getAdminStatsAction, getAdminUsersAction, type AdminStats, type AdminUser } from "@/actions/admin.actions";
import Link from "next/link";

export default function AdminDashboard() {
  const { sidebarOpen } = useUIStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [statsResult, usersResult] = await Promise.all([
      getAdminStatsAction(),
      getAdminUsersAction(),
    ]);

    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }
    if (usersResult.success && usersResult.data) {
      setRecentUsers(usersResult.data.slice(0, 5));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardSidebar />
        <div className={cn("transition-all duration-300", sidebarOpen ? "lg:pl-64" : "lg:pl-20")}>
          <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
            <div className="flex h-16 items-center px-4 md:px-6">
              <Skeleton className="h-6 w-40" />
            </div>
          </header>
          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Monitor platform health and manage users</p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button variant="outline" asChild size="sm">
                <Link href="/admin/campaigns">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View Campaigns
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-neutral-500/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-neutral-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Campaigns</p>
                      <p className="text-3xl font-bold mt-1">{stats.activeCampaigns}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-emerald-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Deals</p>
                      <p className="text-3xl font-bold mt-1">{stats.activeDeals}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-neutral-500/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-neutral-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Campaigns</p>
                      <p className="text-3xl font-bold mt-1">{stats.completedCampaigns}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-500/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-neutral-500" />
                      </div>
                      <span>Creators</span>
                    </div>
                    <span className="font-semibold">{stats.creators}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-emerald-500" />
                      </div>
                      <span>Brands</span>
                    </div>
                    <span className="font-semibold">{stats.brands}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-500/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-neutral-500" />
                      </div>
                      <span>Admins</span>
                    </div>
                    <span className="font-semibold">{stats.admins}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Users</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/users">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No users yet</p>
                  ) : (
                    recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>
                              {user.full_name?.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.full_name || "Unknown"}</div>
                            <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.is_verified && (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {user.is_suspended && (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Suspended
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  Pending Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">{stats.pendingVerifications}</div>
                <p className="text-muted-foreground text-sm">Creator verification requests pending review</p>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/admin/users">Review Requests</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Suspended Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">{stats.suspendedAccounts}</div>
                <p className="text-muted-foreground text-sm">Accounts currently suspended</p>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/admin/users">View Accounts</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle className="h-5 w-5" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2 text-emerald-600">Good</div>
                <p className="text-muted-foreground text-sm">All systems operational</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  Ban,
  CheckCircle2,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { toast } from "@/store/ui-store";
import {
  getAdminUsersAction,
  verifyUserAction,
  suspendUserAction,
  type AdminUser,
} from "@/actions/admin.actions";

export default function AdminUsersPage() {
  const { sidebarOpen } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);

  const fetchUsers = useCallback(async (search?: string) => {
    setIsFetching(true);
    const result = await getAdminUsersAction(search);
    if (result.success && result.data) {
      setUsers(result.data);
    }
    setIsFetching(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchQuery || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchUsers]);

  const handleVerify = async (userId: string) => {
    setIsLoading(true);
    const result = await verifyUserAction(userId);
    if (result.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_verified: true } : u))
      );
      toast.success("User verified successfully");
    } else {
      toast.error(result.error || "Failed to verify user");
    }
    setIsLoading(false);
  };

  const handleSuspend = async (userId: string, currentlySuspended: boolean) => {
    setIsLoading(true);
    const result = await suspendUserAction(userId, !currentlySuspended);
    if (result.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_suspended: !currentlySuspended } : u))
      );
      toast.success(currentlySuspended ? "User unsuspended" : "User suspended");
    } else {
      toast.error(result.error || "Failed to update user status");
    }
    setIsLoading(false);
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
              <h1 className="text-lg font-semibold">User Management</h1>
              <p className="text-sm text-muted-foreground">Verify and moderate users</p>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {[
              { label: "Total Users", value: users.length, icon: Users },
              { label: "Verified", value: users.filter((u) => u.is_verified).length, icon: CheckCircle2 },
              { label: "Creators", value: users.filter((u) => u.role === "creator").length, icon: Users },
              { label: "Brands", value: users.filter((u) => u.role === "brand").length, icon: Users },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage user accounts and verification status</CardDescription>
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No users found</p>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>
                            {user.full_name?.split(" ").map((n) => n[0]).join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{user.full_name || "Unknown"}</p>
                            {user.is_verified && (
                              <Badge className="bg-green-500/10 text-green-600">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {user.is_suspended && (
                              <Badge variant="destructive">
                                <Ban className="h-3 w-3 mr-1" />
                                Suspended
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground capitalize">{user.role} &middot; Joined {new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!user.is_verified && (
                          <Button
                            size="sm"
                            onClick={() => handleVerify(user.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-1" />
                                Verify
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant={user.is_suspended ? "default" : "outline"}
                          onClick={() => handleSuspend(user.id, user.is_suspended)}
                          disabled={isLoading}
                        >
                          {user.is_suspended ? "Unsuspend" : "Suspend"}
                        </Button>
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

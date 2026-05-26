"use client";

import { useState } from "react";
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
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { toast } from "@/store/ui-store";

interface User {
  id: string;
  name: string;
  email: string;
  role: "creator" | "brand" | "admin";
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { sidebarOpen } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Rajesh Hamal", email: "rajesh@example.com", role: "creator", isVerified: true, isSuspended: false, createdAt: "2024-01-10" },
    { id: "2", name: "Sita Sharma", email: "sita@example.com", role: "creator", isVerified: false, isSuspended: false, createdAt: "2024-01-12" },
    { id: "3", name: "Tech Brand Co", email: "contact@techbrand.com", role: "brand", isVerified: true, isSuspended: false, createdAt: "2024-01-08" },
    { id: "4", name: "Spam User", email: "spam@example.com", role: "creator", isVerified: false, isSuspended: true, createdAt: "2024-01-15" },
  ]);

  const handleVerify = async (userId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isVerified: true } : u))
      );
      toast.success("User verified successfully");
      setIsLoading(false);
    }, 500);
  };

  const handleSuspend = async (userId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u))
      );
      toast.success("User status updated");
      setIsLoading(false);
    }, 500);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              { label: "Verified", value: users.filter((u) => u.isVerified).length, icon: CheckCircle2 },
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
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={undefined} />
                        <AvatarFallback>
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{user.name}</p>
                          {user.isVerified && (
                            <Badge className="bg-green-500/10 text-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {user.isSuspended && (
                            <Badge variant="destructive">
                              <Ban className="h-3 w-3 mr-1" />
                              Suspended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!user.isVerified && (
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
                        variant={user.isSuspended ? "default" : "outline"}
                        onClick={() => handleSuspend(user.id)}
                        disabled={isLoading}
                      >
                        {user.isSuspended ? "Unsuspend" : "Suspend"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

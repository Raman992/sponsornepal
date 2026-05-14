"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  DollarSign,
  Briefcase,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export default function CreatorApplicationsPage() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadApplications = async () => {
      setTimeout(() => {
        setApplications([
          { id: 1, campaignTitle: "Tech Product Launch", brand: "Ncell", status: "pending", amount: 45000, deadline: "2024-02-15", appliedAt: "2024-01-10" },
          { id: 2, campaignTitle: "Fashion Brand Collaboration", brand: "Daraz", status: "accepted", amount: 35000, deadline: "2024-02-01", appliedAt: "2024-01-08" },
          { id: 3, campaignTitle: "Food Review Campaign", brand: "Foodmandu", status: "pending", amount: 25000, deadline: "2024-02-20", appliedAt: "2024-01-12" },
          { id: 4, campaignTitle: "Fitness App Promotion", brand: "FitNepal", status: "rejected", amount: 30000, deadline: "2024-01-30", appliedAt: "2024-01-05" },
          { id: 5, campaignTitle: "Gaming Tournament", brand: "NIBL", status: "completed", amount: 50000, deadline: "2024-01-20", appliedAt: "2024-01-02" },
        ]);
        setIsLoading(false);
      }, 500);
    };

    loadApplications();
  }, []);

  const filteredApplications = activeTab === "all" 
    ? applications 
    : applications.filter(app => app.status === activeTab);

  const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
    pending: { icon: Clock, color: "bg-amber-500/10 text-amber-600", label: "Pending" },
    accepted: { icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600", label: "Accepted" },
    rejected: { icon: XCircle, color: "bg-red-500/10 text-red-600", label: "Rejected" },
    completed: { icon: CheckCircle2, color: "bg-violet-500/10 text-violet-600", label: "Completed" },
  };

  const getStatusCounts = () => ({
    all: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    accepted: applications.filter(a => a.status === "accepted").length,
    completed: applications.filter(a => a.status === "completed").length,
  });

  const counts = getStatusCounts();

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
              <h1 className="text-lg font-semibold">My Applications</h1>
              <p className="text-sm text-muted-foreground">Track your campaign applications</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/creator/campaigns">
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Campaigns
              </Link>
            </Button>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {[
              { key: "all", label: "Total" },
              { key: "pending", label: "Pending" },
              { key: "accepted", label: "Accepted" },
              { key: "completed", label: "Completed" },
            ].map((stat, index) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="hover-lift">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold">{counts[stat.key as keyof typeof counts]}</div>
                    <div className="text-sm text-muted-foreground">{stat.label} Applications</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Applications List */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
              <TabsTrigger value="accepted">Accepted ({counts.accepted})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({counts.completed})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6">
                      <div className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredApplications.length > 0 ? (
                <div className="space-y-4">
                  {filteredApplications.map((app, index) => {
                    const config = statusConfig[app.status];
                    const StatusIcon = config.icon;
                    
                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="hover-lift">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                                <Briefcase className="h-6 w-6 text-primary" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="font-semibold text-lg">{app.campaignTitle}</h3>
                                  <Badge className={config.color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {config.label}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm mb-3">{app.brand}</p>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    NPR {app.amount.toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Deadline: {new Date(app.deadline).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {app.status === "accepted" && (
                                  <Button size="sm">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    View Deal
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/campaigns/${app.id}`}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    Details
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No {activeTab === "all" ? "" : activeTab} applications</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeTab === "all" 
                      ? "Start applying to campaigns to see them here"
                      : `You don't have any ${activeTab} applications`
                    }
                  </p>
                  {activeTab === "all" && (
                    <Button asChild>
                      <Link href="/dashboard/creator/campaigns">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Browse Campaigns
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Users,
  Loader2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSidebar } from "@/components/layouts/sidebar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export default function BrandCampaignsPage() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCampaigns = async () => {
      setTimeout(() => {
        setCampaigns([
          { id: 1, title: "Tech Product Launch", status: "open", applications: 12, budget: 100000, deadline: "2024-02-15", description: "We're launching our latest smartphone and need tech creators to review it." },
          { id: 2, title: "Fashion Brand Collaboration", status: "in_progress", applications: 8, budget: 75000, deadline: "2024-02-01", description: "Spring collection launch - looking for fashion influencers." },
          { id: 3, title: "Food Delivery Promo", status: "draft", applications: 0, budget: 50000, deadline: "2024-02-28", description: "Promoting our new food delivery service in Kathmandu." },
          { id: 4, title: "Fitness App Launch", status: "completed", applications: 15, budget: 60000, deadline: "2024-01-15", description: "Promoting our new fitness app with workout challenges." },
          { id: 5, title: "Travel Agency Campaign", status: "open", applications: 6, budget: 80000, deadline: "2024-03-01", description: "Summer travel packages promotion campaign." },
        ]);
        setIsLoading(false);
      }, 500);
    };

    loadCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-600",
    open: "bg-emerald-500/10 text-emerald-600",
    in_progress: "bg-neutral-500/10 text-foreground",
    completed: "bg-neutral-500/10 text-foreground",
    cancelled: "bg-red-500/10 text-red-600",
  };

  const getStatusCount = (status: string) => {
    if (status === "all") return campaigns.length;
    return campaigns.filter(c => c.status === status).length;
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
        {/* Header */}
        <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div>
              <h1 className="text-lg font-semibold">Campaigns</h1>
              <p className="text-sm text-muted-foreground">Manage your brand campaigns</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/brand/campaigns/create">
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Link>
            </Button>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Campaign Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {["all", "open", "in_progress", "completed"].map((status, index) => (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  variant={status === "all" ? "elevated" : "glass"}
                  className="cursor-pointer hover-lift"
                >
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold capitalize">{status === "all" ? "Total" : status.replace("_", " ")}</div>
                    <div className="text-sm text-muted-foreground">
                      {getStatusCount(status)} {status === "all" ? "campaigns" : "campaigns"}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Campaign List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{campaign.title}</h3>
                            <Badge className={statusColors[campaign.status]}>
                              {campaign.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {campaign.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              NPR {campaign.budget.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(campaign.deadline).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {campaign.applications} applications
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/brand/campaigns/${campaign.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search" : "Create your first campaign to get started"}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/dashboard/brand/campaigns/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Link>
                </Button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
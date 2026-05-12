"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Plus, Briefcase, Users, DollarSign, 
  MessageSquare, ArrowRight, Send
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getBrandCampaignsAction, getDealStatsAction, getUnreadCountAction } from "@/actions";
import type { Campaign } from "@/types";

export default function BrandDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [dealStats, setDealStats] = useState({ active: 0, completed: 0, total_value: 0 });
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      const [campaignsRes, dealsRes, messagesRes] = await Promise.all([
        getBrandCampaignsAction(),
        getDealStatsAction(),
        getUnreadCountAction(),
      ]);

      if (campaignsRes.success && 'campaigns' in campaignsRes) setCampaigns(campaignsRes.campaigns || []);
      if (dealsRes.success && 'stats' in dealsRes && dealsRes.stats) setDealStats(dealsRes.stats);
      if (messagesRes.success && 'count' in messagesRes && messagesRes.count !== undefined) setUnreadMessages(messagesRes.count);

      setIsLoading(false);
    };
    loadDashboardData();
  }, []);

  const openCampaigns = campaigns.filter(c => c.status === 'open');

  if (isLoading) {
    return (
      <div className="space-y-6">
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
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Brand Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your campaigns and creator partnerships</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/brand/campaigns/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/creators">
              <Users className="h-4 w-4 mr-2" />
              Discover Creators
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Campaigns</p>
                  <p className="text-3xl font-bold mt-1">{campaigns.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open Campaigns</p>
                  <p className="text-3xl font-bold mt-1">{openCampaigns.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Send className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Deals</p>
                  <p className="text-3xl font-bold mt-1">{dealStats.active}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread Messages</p>
                  <p className="text-3xl font-bold mt-1">{unreadMessages}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Recent Campaigns
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/brand/campaigns">
                  View All <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No campaigns yet</p>
                  <Button asChild>
                    <Link href="/dashboard/brand/campaigns/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Campaign
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <Link
                      key={campaign.id}
                      href={`/dashboard/brand/campaigns/${campaign.id}`}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {campaign.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{campaign.applications?.length || 0} applications</span>
                          {campaign.budget && (
                            <span>NPR {campaign.budget.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          campaign.status === 'open' ? 'bg-emerald-500/10 text-emerald-600' :
                          campaign.status === 'in_progress' ? 'bg-blue-500/10 text-blue-600' :
                          'bg-gray-500/10 text-gray-500'
                        }
                      >
                        {campaign.status.replace('_', ' ')}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-semibold text-lg">
                    NPR {dealStats.total_value.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed Deals</span>
                  <span className="font-semibold text-emerald-600">{dealStats.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Deals</span>
                  <span className="font-semibold text-blue-600">{dealStats.active}</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/dashboard/brand/deals">
                  View All Deals <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/brand/campaigns/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/creators">
                  <Users className="h-4 w-4 mr-2" />
                  Find Creators
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/brand/messages">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
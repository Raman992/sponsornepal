"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  User, Briefcase, MessageSquare, DollarSign, 
  ArrowRight, FileText, Plus, Target, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCreatorProfileAction, getCreatorApplicationStatsAction, getActiveDealsCountAction, getUnreadCountAction } from "@/actions";
import type { CreatorProfile } from "@/types";

export default function CreatorDashboard() {
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [stats, setStats] = useState({ pending: 0, accepted: 0, rejected: 0, completed: 0, total: 0 });
  const [activeDeals, setActiveDeals] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      const [profileRes, statsRes, dealsRes, messagesRes] = await Promise.all([
        getCreatorProfileAction(),
        getCreatorApplicationStatsAction(),
        getActiveDealsCountAction(),
        getUnreadCountAction(),
      ]);

      if (profileRes.success && 'profile' in profileRes) setProfile(profileRes.profile as CreatorProfile | null);
      if (statsRes.success && 'stats' in statsRes && statsRes.stats) setStats(statsRes.stats);
      if (dealsRes.success && 'count' in dealsRes && dealsRes.count !== undefined) setActiveDeals(dealsRes.count);
      if (messagesRes.success && 'count' in messagesRes && messagesRes.count !== undefined) setUnreadMessages(messagesRes.count);

      setIsLoading(false);
    };
    loadDashboardData();
  }, []);

  const quickActions = [
    { label: "Browse Campaigns", href: "/campaigns", icon: Briefcase, color: "text-blue-500" },
    { label: "Update Profile", href: "/dashboard/creator/profile", icon: User, color: "text-purple-500" },
    { label: "View Messages", href: "/dashboard/creator/messages", icon: MessageSquare, color: "text-emerald-500" },
  ];

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
          <h1 className="text-3xl font-bold">Welcome back{profile?.user?.full_name ? `, ${profile.user.full_name.split(' ')[0]}` : ''}!</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your creator journey</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/creator/profile">
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/campaigns">
              <Plus className="h-4 w-4 mr-2" />
              Find Campaigns
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
                  <p className="text-sm text-muted-foreground">Active Applications</p>
                  <p className="text-3xl font-bold mt-1">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-500" />
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
                  <p className="text-sm text-muted-foreground">Active Deals</p>
                  <p className="text-3xl font-bold mt-1">{activeDeals}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-500" />
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
                  <p className="text-sm text-muted-foreground">Unread Messages</p>
                  <p className="text-3xl font-bold mt-1">{unreadMessages}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-500" />
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
                  <p className="text-sm text-muted-foreground">Completed Deals</p>
                  <p className="text-3xl font-bold mt-1">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors group"
                  >
                    <action.icon className={`h-8 w-8 mb-3 ${action.color}`} />
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {action.label}
                    </span>
                    <ArrowRight className="h-4 w-4 mt-2 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {!profile && (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">Complete Your Profile</h3>
                <p className="text-muted-foreground mb-4">
                  Add your social media handles and metrics to attract brands
                </p>
                <Button asChild>
                  <Link href="/dashboard/creator/profile">Create Profile</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Basic Info", done: !!profile?.username },
                  { label: "Social Media", done: !!(profile?.instagram_handle || profile?.tiktok_handle || profile?.youtube_channel) },
                  { label: "Followers", done: profile && (profile.instagram_followers + profile.tiktok_followers + profile.youtube_subscribers) > 0 },
                  { label: "Bio", done: !!profile?.bio },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.done ? 'bg-emerald-500' : 'bg-muted'}`}>
                      {item.done && <CheckCircle className="h-4 w-4 text-white" />}
                    </div>
                    <span className={item.done ? "" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/dashboard/creator/profile">Update Profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Application Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Applied</span>
                  <span className="font-semibold">{stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accepted</span>
                  <span className="font-semibold text-emerald-600">{stats.accepted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold text-amber-600">{stats.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rejected</span>
                  <span className="font-semibold text-red-500">{stats.rejected}</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4" asChild>
                <Link href="/dashboard/creator/applications">
                  View All Applications <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
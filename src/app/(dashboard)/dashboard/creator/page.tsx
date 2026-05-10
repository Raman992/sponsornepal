import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardAccent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MessageSquare, TrendingUp, User, ArrowRight, FileText, DollarSign, Eye, Clock, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

async function getCreatorStats(userId: string) {
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from("campaign_applications")
    .select("status")
    .eq("creator_id", userId);

  const { data: messages } = await supabase
    .from("messages")
    .select("id, is_read")
    .eq("sender_id", userId);

  const { data: deals } = await supabase
    .from("deals")
    .select("status")
    .eq("creator_id", userId);

  return {
    applications: {
      total: applications?.length || 0,
      pending: applications?.filter((a) => a.status === "pending").length || 0,
      accepted: applications?.filter((a) => a.status === "accepted").length || 0,
    },
    messages: {
      total: messages?.length || 0,
      unread: messages?.filter((m) => !m.is_read).length || 0,
    },
    deals: {
      total: deals?.length || 0,
      active: deals?.filter((d) => d.status === "active").length || 0,
      completed: deals?.filter((d) => d.status === "completed").length || 0,
    },
  };
}

const statsCards = [
  {
    title: "Applications",
    key: "applications",
    icon: Briefcase,
    color: "from-violet-500 to-purple-600",
    details: (stats: any) => `${stats.applications.pending} pending`,
  },
  {
    title: "Active Deals",
    key: "deals",
    icon: DollarSign,
    color: "from-emerald-500 to-teal-500",
    details: (stats: any) => `${stats.deals.active} active`,
  },
  {
    title: "Messages",
    key: "messages",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500",
    details: (stats: any) => `${stats.messages.unread} unread`,
  },
  {
    title: "Profile Views",
    key: "views",
    icon: Eye,
    color: "from-amber-500 to-orange-500",
    details: () => "This month",
  },
];

const quickActions = [
  { href: "/dashboard/creator/campaigns", icon: FileText, label: "Browse Campaigns", color: "bg-violet-500" },
  { href: "/dashboard/creator/applications", icon: Briefcase, label: "My Applications", color: "bg-blue-500" },
  { href: "/dashboard/creator/messages", icon: MessageSquare, label: "Messages", color: "bg-emerald-500" },
  { href: "/dashboard/creator/profile", icon: User, label: "Edit Profile", color: "bg-amber-500" },
];

export default async function CreatorDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("*, creator_profiles(*)")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "creator") {
    redirect("/dashboard/brand");
  }

  const stats = await getCreatorStats(user.id);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground mt-1">
              Here&apos;s an overview of your creator dashboard
            </p>
          </motion.div>
        </div>
        <Button className="gap-2" asChild>
          <Link href="/dashboard/creator/campaigns">
            <Sparkles className="h-4 w-4" />
            Find Campaigns
          </Link>
        </Button>
      </div>

      {/* Profile Status Alert */}
      {userData?.creator_profiles?.[0]?.username ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-emerald-700 dark:text-emerald-400">Your profile is live!</p>
              <p className="text-sm text-muted-foreground">
                Share your link:{" "}
                <code className="text-primary font-medium">/creators/{userData.creator_profiles[0].username}</code>
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/creators/${userData.creator_profiles[0].username}`}>
                View Profile
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-700 dark:text-amber-400">Complete your profile to start receiving offers</p>
              <p className="text-sm text-muted-foreground">
                Fill out your creator profile to get matched with brands
              </p>
            </div>
            <Button size="sm" asChild>
              <Link href="/dashboard/creator/profile">Set up profile</Link>
            </Button>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="elevated" className="relative overflow-hidden group hover-lift">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">
                      {stat.key === "applications" && stats.applications.total}
                      {stat.key === "deals" && stats.deals.total}
                      {stat.key === "messages" && stats.messages.total}
                      {stat.key === "views" && "0"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.details(stats)}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.href}
                  variant="outline"
                  className="justify-start gap-3 h-auto py-3"
                  asChild
                >
                  <Link href={action.href}>
                    <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm">{action.label}</span>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start by browsing campaigns or completing your profile
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href="/dashboard/creator/campaigns">
                    Browse Campaigns
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="outline" className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/25">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Pro Tip: Optimize Your Profile</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add your social media handles, showcase your portfolio, and set competitive pricing to attract more brand deals.
                </p>
                <Button size="sm" variant="gradient" asChild>
                  <Link href="/dashboard/creator/profile">Complete Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
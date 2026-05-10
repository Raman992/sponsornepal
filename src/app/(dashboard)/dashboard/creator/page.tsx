import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MessageSquare, TrendingUp, User, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

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

  const quickActions = [
    { href: "/dashboard/creator/campaigns", icon: FileText, label: "Browse Campaigns" },
    { href: "/dashboard/creator/applications", icon: Briefcase, label: "My Applications" },
    { href: "/dashboard/creator/messages", icon: MessageSquare, label: "Messages" },
    { href: "/dashboard/creator/profile", icon: User, label: "Edit Profile" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your creator dashboard
        </p>
      </div>

      {userData?.creator_profiles?.[0]?.username ? (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm">
            Your profile is live! Share your link:{" "}
            <span className="font-medium text-primary">
              /creators/{userData.creator_profiles[0].username}
            </span>
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Complete your profile to start receiving campaign offers.{" "}
            <Link href="/dashboard/creator/profile" className="underline font-medium">
              Set up profile
            </Link>
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.applications.pending} pending, {stats.applications.accepted} accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.deals.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.deals.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messages.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.messages.unread} unread
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action) => (
              <Button key={action.href} variant="outline" className="justify-start" asChild>
                <Link href={action.href}>
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
              <p className="text-sm">Start by browsing campaigns or completing your profile</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
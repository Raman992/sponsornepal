import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, MessageSquare, TrendingUp, FileText, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

async function getBrandStats(userId: string) {
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, status")
    .eq("brand_id", userId);

  const { data: applications } = await supabase
    .from("campaign_applications")
    .select("id")
    .in(
      "campaign_id",
      campaigns?.map((c) => c.id) || []
    );

  const { data: savedCreators } = await supabase
    .from("saved_creators")
    .select("id")
    .eq("brand_id", userId);

  const { data: deals } = await supabase
    .from("deals")
    .select("status")
    .eq("brand_id", userId);

  return {
    campaigns: {
      total: campaigns?.length || 0,
      active: campaigns?.filter((c) => c.status === "open" || c.status === "in_progress").length || 0,
    },
    applications: applications?.length || 0,
    savedCreators: savedCreators?.length || 0,
    deals: {
      total: deals?.length || 0,
      active: deals?.filter((d) => d.status === "active").length || 0,
    },
  };
}

export default async function BrandDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("*, brand_profiles(*)")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "brand") {
    redirect("/dashboard/creator");
  }

  const stats = await getBrandStats(user.id);

  const quickActions = [
    { href: "/dashboard/brand/campaigns/new", icon: Plus, label: "Create Campaign" },
    { href: "/dashboard/brand/creators", icon: Users, label: "Discover Creators" },
    { href: "/dashboard/brand/campaigns", icon: FileText, label: "My Campaigns" },
    { href: "/dashboard/brand/messages", icon: MessageSquare, label: "Messages" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your brand dashboard
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/brand/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {userData?.brand_profiles?.[0]?.company_name ? (
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm">
            Your brand profile is set up! Start by{" "}
            <Link href="/dashboard/brand/campaigns/new" className="underline font-medium">
              creating a campaign
            </Link>{" "}
            or{" "}
            <Link href="/dashboard/brand/creators" className="underline font-medium">
              discovering creators
            </Link>.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Complete your brand profile to start posting campaigns.{" "}
            <Link href="/dashboard/brand/profile" className="underline font-medium">
              Set up profile
            </Link>
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.campaigns.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.campaigns.active} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applications}</div>
            <p className="text-xs text-muted-foreground">
              Total received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.savedCreators}</div>
            <p className="text-xs text-muted-foreground">
              In your list
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
              {stats.deals.total} total
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
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest campaign activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No campaigns yet</p>
              <p className="text-sm">Create your first campaign to get started</p>
              <Button variant="link" className="mt-2" asChild>
                <Link href="/dashboard/brand/campaigns/new">
                  Create Campaign <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
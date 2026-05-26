import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Target,
  Users,
  Clock,
  ArrowLeft,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCampaignById } from "@/repositories/campaign.repository";
import { ApplicationForm } from "@/components/forms/application-form";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const campaign = await getCampaignById(id);

  if (!campaign) {
    return { title: "Campaign Not Found" };
  }

  const description = campaign.description?.slice(0, 160) || "View campaign details and apply on SponsorNepal";

  return {
    title: campaign.title,
    description,
    alternates: {
      canonical: `/campaigns/${campaign.id}`,
    },
    openGraph: {
      title: `${campaign.title} - SponsorNepal Campaign`,
      description,
      url: `/campaigns/${campaign.id}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${campaign.title} - SponsorNepal Campaign`,
      description,
    },
  };
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  open: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  completed: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function formatCurrency(amount: number | null): string {
  if (!amount) return "Not specified";
  return `NPR ${amount.toLocaleString()}`;
}

function formatDate(date: string | null): string {
  if (!date) return "Not specified";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function CampaignDetails({ id }: { id: string }) {
  const campaign = await getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  let userRole: string | null = null;
  if (user) {
    const { data } = await supabase.from("users").select("role").eq("id", user.id).single();
    userRole = data?.role || null;
  }

  const brandInitials = campaign.brand?.full_name
    ? campaign.brand.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "B";

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/campaigns" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-3xl font-bold">{campaign.title}</CardTitle>
                    <Badge className={statusColors[campaign.status]}>
                      {campaign.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{campaign.brand?.full_name || "Unknown Brand"}</span>
                    {campaign.brand?.is_verified && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{campaign.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="outline">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="text-xl font-bold">{formatCurrency(campaign.budget)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="outline">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Deadline</p>
                        <p className="text-xl font-bold">{formatDate(campaign.deadline)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="outline">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Target Audience</p>
                        <p className="text-xl font-bold">{campaign.target_audience || "Not specified"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="outline">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Campaign Type</p>
                        <p className="text-xl font-bold">{campaign.campaign_type || "Not specified"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {campaign.deliverables && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Deliverables</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{campaign.deliverables}</p>
                </div>
              )}

              {campaign.platform_requirements && campaign.platform_requirements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Platform Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.platform_requirements.map((platform, index) => (
                      <Badge key={index} variant="secondary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {isLoggedIn && userRole === "creator" && campaign.status === "open" && (
                <div className="border-t pt-8">
                  <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                    <ApplicationForm
                      campaignId={campaign.id}
                      creatorId={user.id}
                      campaignTitle={campaign.title}
                      maxBudget={campaign.budget || undefined}
                    />
                  </Suspense>
                </div>
              )}

              {campaign.status !== "open" && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    This campaign is currently {campaign.status.replace("_", " ")} and not accepting applications.
                  </p>
                </div>
              )}

              {!isLoggedIn && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Sign in as a creator to apply to this campaign</p>
                  <Button asChild>
                    <Link href="/login?redirect=/campaigns/{campaign.id}">Sign In</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading campaign...</div>
      </div>
    }>
      <CampaignDetails id={id} />
    </Suspense>
  );
}

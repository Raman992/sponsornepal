import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sponsornepal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/creators`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/campaigns`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Fetch creator profiles for dynamic routes
  const { data: creators } = await supabase
    .from("creator_profiles")
    .select("username, updated_at")
    .is("deleted_at", null);

  const creatorRoutes: MetadataRoute.Sitemap = (creators || []).map((creator) => ({
    url: `${BASE_URL}/creators/${creator.username}`,
    lastModified: new Date(creator.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Fetch campaigns for dynamic routes
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, updated_at")
    .in("status", ["open", "in_progress"])
    .is("deleted_at", null);

  const campaignRoutes: MetadataRoute.Sitemap = (campaigns || []).map((campaign) => ({
    url: `${BASE_URL}/campaigns/${campaign.id}`,
    lastModified: new Date(campaign.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...creatorRoutes, ...campaignRoutes];
}

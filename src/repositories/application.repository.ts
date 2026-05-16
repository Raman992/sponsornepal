import { createClient } from "@/lib/supabase/server";
import type { CampaignApplication, CreatorProfile, User } from "@/types";

export async function getApplicationsForCampaign(
  campaignId: string
): Promise<(CampaignApplication & { creator?: User; creator_profile?: CreatorProfile })[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("campaign_applications")
    .select(`
      *,
      creator:users!campaign_applications_creator_id_fkey(id, full_name, avatar_url),
      creator_profile:creator_profiles(*)
    `)
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return [];
  }

  return data as (CampaignApplication & { creator?: User; creator_profile?: CreatorProfile })[];
}

export async function getCreatorApplications(
  creatorId: string
): Promise<CampaignApplication[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("campaign_applications")
    .select(`
      *,
      campaign:campaigns(id, title, budget, status, deadline)
    `)
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching creator applications:", error);
    return [];
  }

  return data as CampaignApplication[];
}

export async function applyToCampaign(
  campaignId: string,
  creatorId: string,
  data: {
    proposal_message: string;
    expected_price: number;
    delivery_timeline: string;
  }
): Promise<{ success: boolean; error?: string; application?: CampaignApplication }> {
  const supabase = createClient();
  
  const { data: application, error } = await supabase
    .from("campaign_applications")
    .insert({
      campaign_id: campaignId,
      creator_id: creatorId,
      ...data,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error applying to campaign:", error);
    return { success: false, error: error.message };
  }

  return { success: true, application };
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "pending" | "accepted" | "rejected" | "completed"
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("campaign_applications")
    .update({ status })
    .eq("id", applicationId);

  if (error) {
    console.error("Error updating application status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function hasAlreadyApplied(
  campaignId: string,
  creatorId: string
): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("campaign_applications")
    .select("id")
    .eq("campaign_id", campaignId)
    .eq("creator_id", creatorId)
    .single();

  return !error && !!data;
}

export async function getApplicationStats(creatorId: string): Promise<{
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("campaign_applications")
    .select("status")
    .eq("creator_id", creatorId);

  if (error) {
    console.error("Error fetching application stats:", error);
    return { total: 0, pending: 0, accepted: 0, rejected: 0 };
  }

  const applications = data || [];
  return {
    total: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    accepted: applications.filter(a => a.status === "accepted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };
}
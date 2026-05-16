import { createClient } from "@/lib/supabase/server";
import type { Deal } from "@/types";

export async function getDeals(userId: string): Promise<Deal[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("deals")
    .select(`
      *,
      campaign:campaigns(id, title, budget, status),
      creator:users!deals_creator_id_fkey(id, full_name, avatar_url, role),
      brand:users!deals_brand_id_fkey(id, full_name, avatar_url, role)
    `)
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching deals:", error);
    return [];
  }

  return (data || []) as Deal[];
}

export async function getDeal(dealId: string, userId: string): Promise<Deal | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("deals")
    .select(`
      *,
      campaign:campaigns(*),
      creator:users!deals_creator_id_fkey(id, full_name, avatar_url, role),
      brand:users!deals_brand_id_fkey(id, full_name, avatar_url, role)
    `)
    .eq("id", dealId)
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
    .single();

  if (error) {
    console.error("Error fetching deal:", error);
    return null;
  }

  return data as Deal;
}

export async function getDealByCampaign(
  campaignId: string
): Promise<Deal | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("campaign_id", campaignId)
    .single();

  if (error) {
    return null;
  }

  return data as Deal;
}

export async function createDeal(
  campaignId: string,
  creatorId: string,
  brandId: string,
  agreedAmount: number
): Promise<{ success: boolean; deal?: Deal; error?: string }> {
  const supabase = createClient();

  const existingDeal = await getDealByCampaign(campaignId);
  if (existingDeal) {
    return { success: false, error: "A deal already exists for this campaign" };
  }

  const { data: deal, error } = await supabase
    .from("deals")
    .insert({
      campaign_id: campaignId,
      creator_id: creatorId,
      brand_id: brandId,
      agreed_amount: agreedAmount,
      status: "pending",
      escrow_status: "pending",
      payout_status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating deal:", error);
    return { success: false, error: error.message };
  }

  return { success: true, deal: deal as Deal };
}

export async function updateDealStatus(
  dealId: string,
  userId: string,
  status: "pending" | "active" | "completed" | "cancelled"
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("deals")
    .update({ status })
    .eq("id", dealId)
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`);

  if (error) {
    console.error("Error updating deal status:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateDealPayment(
  dealId: string,
  userId: string,
  escrowStatus: string,
  payoutStatus?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const updates: Record<string, string> = {
    escrow_status: escrowStatus,
  };

  if (payoutStatus) {
    updates.payout_status = payoutStatus;
  }

  const { error } = await supabase
    .from("deals")
    .update(updates)
    .eq("id", dealId)
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`);

  if (error) {
    console.error("Error updating deal payment:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getActiveDeals(userId: string): Promise<Deal[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("deals")
    .select(`
      *,
      campaign:campaigns(id, title, budget),
      creator:users!deals_creator_id_fkey(id, full_name, avatar_url),
      brand:users!deals_brand_id_fkey(id, full_name, avatar_url)
    `)
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching active deals:", error);
    return [];
  }

  return (data || []) as Deal[];
}

export async function getPendingDeals(userId: string): Promise<Deal[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("deals")
    .select(`
      *,
      campaign:campaigns(id, title, budget),
      creator:users!deals_creator_id_fkey(id, full_name, avatar_url),
      brand:users!deals_brand_id_fkey(id, full_name, avatar_url)
    `)
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending deals:", error);
    return [];
  }

  return (data || []) as Deal[];
}

export async function getDealCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("deals")
    .select("*", { count: "exact" })
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`);

  if (error) {
    console.error("Error getting deal count:", error);
    return 0;
  }

  return count || 0;
}

export async function getActiveDealCount(userId: string): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("deals")
    .select("*", { count: "exact" })
    .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
    .eq("status", "active");

  if (error) {
    console.error("Error getting active deal count:", error);
    return 0;
  }

  return count || 0;
}
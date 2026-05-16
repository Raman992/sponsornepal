import { createClient } from "@/lib/supabase/server";
import type { Campaign, User } from "@/types";

export async function getCampaigns(params?: {
  status?: string;
  brandId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ campaigns: (Campaign & { brand?: User })[]; total: number }> {
  const supabase = createClient();
  const { status, brandId, search, page = 1, limit = 12 } = params || {};
  
  let query = supabase
    .from("campaigns")
    .select(`
      *,
      brand:users!campaigns_brand_id_fkey(id, full_name, avatar_url)
    `, { count: "exact" });

  if (status) {
    query = query.eq("status", status);
  }
  
  if (brandId) {
    query = query.eq("brand_id", brandId);
  }
  
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const offset = (page - 1) * limit;
  
  const { data, error, count } = await query
    .not("deleted_at", "is", null)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching campaigns:", error);
    return { campaigns: [], total: 0 };
  }

  return { 
    campaigns: (data || []) as (Campaign & { brand?: User })[], 
    total: count || 0 
  };
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("campaigns")
    .select(`
      *,
      brand:users!campaigns_brand_id_fkey(id, full_name, avatar_url)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching campaign:", error);
    return null;
  }

  return data as Campaign;
}

export async function getOpenCampaigns(limit: number = 20): Promise<Campaign[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("campaigns")
    .select(`
      *,
      brand:users!campaigns_brand_id_fkey(id, full_name, avatar_url)
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching open campaigns:", error);
    return [];
  }

  return data as Campaign[];
}

export async function createCampaign(
  brandId: string,
  data: {
    title: string;
    description: string;
    budget: number;
    deliverables?: string;
    target_audience?: string;
    platform_requirements?: string[];
    deadline: string;
    campaign_type?: string;
  }
): Promise<{ success: boolean; error?: string; campaign?: Campaign }> {
  const supabase = createClient();
  
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert({
      brand_id: brandId,
      ...data,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating campaign:", error);
    return { success: false, error: error.message };
  }

  return { success: true, campaign };
}

export async function updateCampaign(
  campaignId: string,
  brandId: string,
  updates: Partial<Campaign>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("campaigns")
    .update(updates)
    .eq("id", campaignId)
    .eq("brand_id", brandId);

  if (error) {
    console.error("Error updating campaign:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteCampaign(
  campaignId: string,
  brandId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("campaigns")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", campaignId)
    .eq("brand_id", brandId);

  if (error) {
    console.error("Error deleting campaign:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function publishCampaign(
  campaignId: string,
  brandId: string
): Promise<{ success: boolean; error?: string }> {
  return updateCampaign(campaignId, brandId, { status: "open" });
}

export async function getCampaignStats(brandId: string): Promise<{
  total: number;
  open: number;
  in_progress: number;
  completed: number;
}> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("campaigns")
    .select("status")
    .eq("brand_id", brandId);

  if (error) {
    console.error("Error fetching campaign stats:", error);
    return { total: 0, open: 0, in_progress: 0, completed: 0 };
  }

  const campaigns = data || [];
  return {
    total: campaigns.length,
    open: campaigns.filter(c => c.status === "open").length,
    in_progress: campaigns.filter(c => c.status === "in_progress").length,
    completed: campaigns.filter(c => c.status === "completed").length,
  };
}
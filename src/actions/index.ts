"use server";

import { createClient } from "@/lib/supabase/server";
import type { CreatorProfile, Campaign, User, Conversation, Message, Deal, CampaignApplication } from "@/types";

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getTopCreatorsAction(limit: number = 20): Promise<ActionResult<{ creators: CreatorProfile[] }>> {
  try {
    const supabase = await createClient();
    const { data: creators, error } = await supabase
      .from("creator_profiles")
      .select(`
        *,
        user:users(id, full_name, avatar_url, is_verified)
      `)
      .not("deleted_at", "is", null)
      .order("engagement_rate", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data: { creators: (creators || []) as CreatorProfile[] } };
  } catch (error) {
    console.error("getTopCreatorsAction error:", error);
    return { success: false, error: "Failed to fetch creators" };
  }
}

export async function getCreatorsWithFiltersAction(params: {
  search?: string;
  niche?: string;
  minFollowers?: number;
  maxBudget?: number;
  page?: number;
}): Promise<ActionResult<{ creators: CreatorProfile[]; total: number }>> {
  try {
    const supabase = await createClient();
    const { search, niche, minFollowers, page = 1 } = params;
    const limit = 12;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("creator_profiles")
      .select(`
        *,
        user:users(id, full_name, avatar_url, is_verified)
      `, { count: "exact" });

    if (search) {
      query = query.or(`username.ilike.%${search}%,bio.ilike.%${search}%`);
    }
    if (niche) {
      query = query.eq("niche", niche);
    }
    if (minFollowers) {
      query = query.gte("instagram_followers", minFollowers);
    }

    const { data: creators, error, count } = await query
      .order("engagement_rate", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { 
      success: true, 
      data: { 
        creators: (creators || []) as CreatorProfile[], 
        total: count || 0 
      } 
    };
  } catch (error) {
    console.error("getCreatorsWithFiltersAction error:", error);
    return { success: false, error: "Failed to fetch creators" };
  }
}

export async function getCreatorByUsernameAction(username: string): Promise<ActionResult<{ creator: CreatorProfile & { user?: User } }>> {
  try {
    const supabase = await createClient();
    const { data: creator, error } = await supabase
      .from("creator_profiles")
      .select(`
        *,
        user:users(id, full_name, avatar_url, is_verified, email)
      `)
      .eq("username", username)
      .single();

    if (error) throw error;

    return { success: true, data: { creator: creator as CreatorProfile & { user?: User } } };
  } catch (error) {
    console.error("getCreatorByUsernameAction error:", error);
    return { success: false, error: "Failed to fetch creator" };
  }
}

export async function getOpenCampaignsAction(limit: number = 20): Promise<ActionResult<{ campaigns: Campaign[] }>> {
  try {
    const supabase = await createClient();
    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select(`
        *,
        brand:users!campaigns_brand_id_fkey(id, full_name, avatar_url)
      `)
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data: { campaigns: (campaigns || []) as Campaign[] } };
  } catch (error) {
    console.error("getOpenCampaignsAction error:", error);
    return { success: false, error: "Failed to fetch campaigns" };
  }
}

export async function getCampaignByIdAction(id: string): Promise<ActionResult<{ campaign: Campaign & { brand: User } }>> {
  try {
    const supabase = await createClient();
    const { data: campaign, error } = await supabase
      .from("campaigns")
      .select(`
        *,
        brand:users!campaigns_brand_id_fkey(id, full_name, avatar_url)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, data: { campaign: campaign as Campaign & { brand: User } } };
  } catch (error) {
    console.error("getCampaignByIdAction error:", error);
    return { success: false, error: "Failed to fetch campaign" };
  }
}

export async function getCreatorCampaignsAction(brandId: string): Promise<ActionResult<{ campaigns: Campaign[] }>> {
  try {
    const supabase = await createClient();
    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: { campaigns: (campaigns || []) as Campaign[] } };
  } catch (error) {
    console.error("getCreatorCampaignsAction error:", error);
    return { success: false, error: "Failed to fetch campaigns" };
  }
}

export async function getBrandCampaignsAction(brandId: string): Promise<ActionResult<{ campaigns: Campaign[] }>> {
  return getCreatorCampaignsAction(brandId);
}

export async function getDealStatsAction(userId: string, role: string): Promise<ActionResult<{ stats: { active: number; completed: number; total: number } }>> {
  try {
    const supabase = await createClient();
    const field = role === "brand" ? "brand_id" : "creator_id";
    
    const { data: deals, error } = await supabase
      .from("deals")
      .select("status")
      .eq(field, userId);

    if (error) throw error;

    const stats = {
      active: (deals || []).filter(d => d.status === "active").length,
      completed: (deals || []).filter(d => d.status === "completed").length,
      total: (deals || []).length
    };

    return { success: true, data: { stats } };
  } catch (error) {
    console.error("getDealStatsAction error:", error);
    return { success: false, error: "Failed to fetch deal stats" };
  }
}

export async function getCreatorApplicationStatsAction(creatorId: string): Promise<ActionResult<{ stats: { pending: number; accepted: number; rejected: number; total: number } }>> {
  try {
    const supabase = await createClient();
    
    const { data: applications, error } = await supabase
      .from("campaign_applications")
      .select("status")
      .eq("creator_id", creatorId);

    if (error) throw error;

    const stats = {
      pending: (applications || []).filter(a => a.status === "pending").length,
      accepted: (applications || []).filter(a => a.status === "accepted").length,
      rejected: (applications || []).filter(a => a.status === "rejected").length,
      total: (applications || []).length
    };

    return { success: true, data: { stats } };
  } catch (error) {
    console.error("getCreatorApplicationStatsAction error:", error);
    return { success: false, error: "Failed to fetch application stats" };
  }
}

export async function getActiveDealsCountAction(userId: string): Promise<ActionResult<{ count: number }>> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("deals")
      .select("*", { count: "exact", head: true })
      .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
      .eq("status", "active");

    if (error) throw error;

    return { success: true, data: { count: count || 0 } };
  } catch (error) {
    console.error("getActiveDealsCountAction error:", error);
    return { success: false, error: "Failed to fetch active deals" };
  }
}

export async function getUnreadCountAction(userId: string): Promise<ActionResult<{ count: number }>> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false)
      .neq("sender_id", userId);

    if (error) throw error;

    return { success: true, data: { count: count || 0 } };
  } catch (error) {
    console.error("getUnreadCountAction error:", error);
    return { success: false, error: "Failed to fetch unread count" };
  }
}

export async function getConversationsAction(userId: string): Promise<ActionResult<{ conversations: (Conversation & { other_user?: User; last_message?: Message })[] }>> {
  try {
    const supabase = await createClient();
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        *,
        creator:users!conversations_creator_id_fkey(id, full_name, avatar_url),
        brand:users!conversations_brand_id_fkey(id, full_name, avatar_url)
      `)
      .or(`creator_id.eq.${userId},brand_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: { conversations: (conversations || []) as (Conversation & { other_user?: User; last_message?: Message })[] } };
  } catch (error) {
    console.error("getConversationsAction error:", error);
    return { success: false, error: "Failed to fetch conversations" };
  }
}

export async function getMessagesAction(conversationId: string): Promise<ActionResult<{ messages: Message[] }>> {
  try {
    const supabase = await createClient();
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return { success: true, data: { messages: (messages || []) as Message[] } };
  } catch (error) {
    console.error("getMessagesAction error:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

export async function sendMessageAction(conversationId: string, senderId: string, content: string): Promise<ActionResult<{ message: Message }>> {
  try {
    const supabase = await createClient();
    const { data: message, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: senderId, content })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: { message: message as Message } };
  } catch (error) {
    console.error("sendMessageAction error:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function createConversationAction(creatorId: string, brandId: string): Promise<ActionResult<{ conversation: Conversation }>> {
  try {
    const supabase = await createClient();
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({ creator_id: creatorId, brand_id: brandId })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: { conversation: conversation as Conversation } };
  } catch (error) {
    console.error("createConversationAction error:", error);
    return { success: false, error: "Failed to create conversation" };
  }
}

export async function applyToCampaignAction(
  campaignId: string,
  creatorId: string,
  proposalMessage: string,
  expectedPrice: number,
  deliveryTimeline: string
): Promise<ActionResult<{ application: CampaignApplication }>> {
  try {
    const supabase = await createClient();
    const { data: application, error } = await supabase
      .from("campaign_applications")
      .insert({
        campaign_id: campaignId,
        creator_id: creatorId,
        proposal_message: proposalMessage,
        expected_price: expectedPrice,
        delivery_timeline: deliveryTimeline
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: { application: application as CampaignApplication } };
  } catch (error) {
    console.error("applyToCampaignAction error:", error);
    return { success: false, error: "Failed to apply to campaign" };
  }
}

export async function getApplicationsForCampaignAction(campaignId: string): Promise<ActionResult<{ applications: (CampaignApplication & { creator?: CreatorProfile & { user?: User } })[] }>> {
  try {
    const supabase = await createClient();
    const { data: applications, error } = await supabase
      .from("campaign_applications")
      .select(`
        *,
        creator:users!campaign_applications_creator_id_fkey(id, full_name, avatar_url),
        creator_profile:creator_profiles(*)
      `)
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: { applications: (applications || []) as (CampaignApplication & { creator?: CreatorProfile & { user?: User } })[] } };
  } catch (error) {
    console.error("getApplicationsForCampaignAction error:", error);
    return { success: false, error: "Failed to fetch applications" };
  }
}
"use server";

import { createClient } from "@/lib/supabase/server";

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AdminStats {
  totalUsers: number;
  creators: number;
  brands: number;
  admins: number;
  totalCampaigns: number;
  activeCampaigns: number;
  completedCampaigns: number;
  totalDeals: number;
  activeDeals: number;
  pendingVerifications: number;
  suspendedAccounts: number;
}

export interface AdminUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  is_verified: boolean;
  is_suspended: boolean;
  created_at: string;
}

export interface AdminCampaign {
  id: string;
  title: string;
  brand_id: string;
  brand_name: string | null;
  status: string;
  budget: number | null;
  deadline: string | null;
  created_at: string;
}

export interface AdminTransaction {
  id: string;
  deal_id: string;
  creator_name: string | null;
  brand_name: string | null;
  amount: number | null;
  payment_status: string | null;
  created_at: string;
}

export async function getAdminStatsAction(): Promise<ActionResult<AdminStats>> {
  try {
    const supabase = await createClient();

    const [
      usersResult,
      creatorsResult,
      brandsResult,
      adminsResult,
      campaignsResult,
      activeCampaignsResult,
      completedCampaignsResult,
      dealsResult,
      activeDealsResult,
      pendingVerificationsResult,
      suspendedResult,
    ] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "creator"),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "brand"),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "admin"),
      supabase.from("campaigns").select("id", { count: "exact", head: true }).is("deleted_at", null),
      supabase.from("campaigns").select("id", { count: "exact", head: true }).eq("status", "open").is("deleted_at", null),
      supabase.from("campaigns").select("id", { count: "exact", head: true }).eq("status", "completed").is("deleted_at", null),
      supabase.from("deals").select("id", { count: "exact", head: true }),
      supabase.from("deals").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("is_verified", false).eq("role", "creator"),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("is_suspended", true),
    ]);

    return {
      success: true,
      data: {
        totalUsers: usersResult.count || 0,
        creators: creatorsResult.count || 0,
        brands: brandsResult.count || 0,
        admins: adminsResult.count || 0,
        totalCampaigns: campaignsResult.count || 0,
        activeCampaigns: activeCampaignsResult.count || 0,
        completedCampaigns: completedCampaignsResult.count || 0,
        totalDeals: dealsResult.count || 0,
        activeDeals: activeDealsResult.count || 0,
        pendingVerifications: pendingVerificationsResult.count || 0,
        suspendedAccounts: suspendedResult.count || 0,
      },
    };
  } catch (error) {
    console.error("getAdminStatsAction error:", error);
    return { success: false, error: "Failed to fetch admin stats" };
  }
}

export async function getAdminUsersAction(search?: string): Promise<ActionResult<AdminUser[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("users")
      .select("id, full_name, avatar_url, role, is_verified, is_suspended, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (search) {
      query = query.ilike("full_name", `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, data: (data || []) as AdminUser[] };
  } catch (error) {
    console.error("getAdminUsersAction error:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function verifyUserAction(userId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("id", userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("verifyUserAction error:", error);
    return { success: false, error: "Failed to verify user" };
  }
}

export async function suspendUserAction(userId: string, suspend: boolean): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update({ is_suspended: suspend })
      .eq("id", userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("suspendUserAction error:", error);
    return { success: false, error: "Failed to update user status" };
  }
}

export async function getAdminCampaignsAction(search?: string): Promise<ActionResult<AdminCampaign[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("campaigns")
      .select(`
        id, title, brand_id, status, budget, deadline, created_at,
        brand:users!brand_id(full_name)
      `)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(50);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    const campaigns: AdminCampaign[] = (data || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      brand_id: c.brand_id,
      brand_name: c.brand?.full_name || null,
      status: c.status,
      budget: c.budget,
      deadline: c.deadline,
      created_at: c.created_at,
    }));

    return { success: true, data: campaigns };
  } catch (error) {
    console.error("getAdminCampaignsAction error:", error);
    return { success: false, error: "Failed to fetch campaigns" };
  }
}

export async function cancelCampaignAction(campaignId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("campaigns")
      .update({ status: "cancelled" })
      .eq("id", campaignId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("cancelCampaignAction error:", error);
    return { success: false, error: "Failed to cancel campaign" };
  }
}

export async function getAdminTransactionsAction(): Promise<ActionResult<AdminTransaction[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id, deal_id, amount, payment_status, created_at,
        deal:deals!deal_id(
          creator:users!creator_id(full_name),
          brand:users!brand_id(full_name)
        )
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const transactions: AdminTransaction[] = (data || []).map((t: any) => ({
      id: t.id,
      deal_id: t.deal_id,
      creator_name: t.deal?.creator?.full_name || null,
      brand_name: t.deal?.brand?.full_name || null,
      amount: t.amount,
      payment_status: t.payment_status,
      created_at: t.created_at,
    }));

    return { success: true, data: transactions };
  } catch (error) {
    console.error("getAdminTransactionsAction error:", error);
    return { success: false, error: "Failed to fetch transactions" };
  }
}

import { createClient } from "@/lib/supabase/server";
import type { CreatorProfile, User } from "@/types";

export async function getCreatorProfile(userId: string): Promise<CreatorProfile | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("creator_profiles")
    .select(`
      *,
      user:users(id, full_name, avatar_url, email, is_verified)
    `)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching creator profile:", error);
    return null;
  }

  return data as CreatorProfile;
}

export async function getCreatorByUsername(username: string): Promise<CreatorProfile | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("creator_profiles")
    .select(`
      *,
      user:users(id, full_name, avatar_url, email, is_verified)
    `)
    .eq("username", username)
    .single();

  if (error) {
    console.error("Error fetching creator by username:", error);
    return null;
  }

  return data as CreatorProfile;
}

export async function updateCreatorProfile(
  userId: string,
  updates: Partial<CreatorProfile>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("creator_profiles")
    .update(updates)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating creator profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function createCreatorProfile(
  userId: string,
  data: { username: string; niche?: string }
): Promise<{ success: boolean; error?: string; profile?: CreatorProfile }> {
  const supabase = createClient();
  
  const { data: profile, error } = await supabase
    .from("creator_profiles")
    .insert({
      user_id: userId,
      username: data.username,
      niche: data.niche,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating creator profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true, profile };
}

export async function getAllCreators(params?: {
  search?: string;
  niche?: string;
  minFollowers?: number;
  page?: number;
  limit?: number;
}): Promise<{ creators: (CreatorProfile & { user?: User })[]; total: number }> {
  const supabase = createClient();
  const { search, niche, minFollowers, page = 1, limit = 12 } = params || {};
  
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

  const offset = (page - 1) * limit;
  
  const { data, error, count } = await query
    .not("deleted_at", "is", null)
    .order("engagement_rate", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching creators:", error);
    return { creators: [], total: 0 };
  }

  return { 
    creators: (data || []) as (CreatorProfile & { user?: User })[], 
    total: count || 0 
  };
}

export async function getTopCreators(limit: number = 20): Promise<CreatorProfile[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("creator_profiles")
    .select(`
      *,
      user:users(id, full_name, avatar_url, is_verified)
    `)
    .not("deleted_at", "is", null)
    .order("engagement_rate", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching top creators:", error);
    return [];
  }

  return data as CreatorProfile[];
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("username", username)
    .single();

  return !error && !data;
}
import { createClient } from "@/lib/supabase/server";
import type { BrandProfile } from "@/types";

export async function getBrandProfile(userId: string): Promise<BrandProfile | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("brand_profiles")
    .select(`
      *,
      user:users(id, full_name, avatar_url, email, is_verified)
    `)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching brand profile:", error);
    return null;
  }

  return data as BrandProfile;
}

export async function updateBrandProfile(
  userId: string,
  updates: Partial<BrandProfile>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("brand_profiles")
    .update(updates)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating brand profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function createBrandProfile(
  userId: string,
  data: { company_name: string; website?: string; industry?: string; description?: string }
): Promise<{ success: boolean; error?: string; profile?: BrandProfile }> {
  const supabase = createClient();
  
  const { data: profile, error } = await supabase
    .from("brand_profiles")
    .insert({
      user_id: userId,
      ...data,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating brand profile:", error);
    return { success: false, error: error.message };
  }

  return { success: true, profile };
}

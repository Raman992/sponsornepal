"use server";

import { revalidatePath } from "next/cache";
import { creatorProfileSchema, socialStatsSchema } from "@/lib/validations/creator";
import * as creatorRepo from "@/repositories/creator.repository";

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function updateCreatorProfileAction(
  userId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      username: formData.get("username") as string,
      bio: formData.get("bio") as string,
      niche: formData.get("niche") as string,
      location: formData.get("location") as string,
      languages: formData.get("languages") ? JSON.parse(formData.get("languages") as string) : [],
      instagram_handle: formData.get("instagram_handle") as string,
      tiktok_handle: formData.get("tiktok_handle") as string,
      youtube_channel: formData.get("youtube_channel") as string,
      pricing_range: formData.get("pricing_range") as string,
      categories: formData.get("categories") ? JSON.parse(formData.get("categories") as string) : [],
    };

    const validated = creatorProfileSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0]?.message || "Invalid form data" 
      };
    }

    const result = await creatorRepo.updateCreatorProfile(userId, validated.data);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/creator/profile");
    revalidatePath("/creators/[username]", "page");
    return { success: true };
  } catch (error) {
    console.error("Update creator profile action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateSocialStatsAction(
  userId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      instagram_followers: parseInt(formData.get("instagram_followers") as string) || 0,
      tiktok_followers: parseInt(formData.get("tiktok_followers") as string) || 0,
      youtube_subscribers: parseInt(formData.get("youtube_subscribers") as string) || 0,
      engagement_rate: parseFloat(formData.get("engagement_rate") as string) || null,
    };

    const validated = socialStatsSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0]?.message || "Invalid form data" 
      };
    }

    const result = await creatorRepo.updateCreatorProfile(userId, validated.data);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/creator/profile");
    return { success: true };
  } catch (error) {
    console.error("Update social stats action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCreatorProfileAction(userId: string) {
  try {
    const profile = await creatorRepo.getCreatorProfile(userId);
    return { success: true, data: profile };
  } catch (error) {
    console.error("Get creator profile action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCreatorsAction(params?: {
  search?: string;
  niche?: string;
  minFollowers?: number;
  page?: number;
}) {
  try {
    const result = await creatorRepo.getAllCreators(params);
    return { success: true, data: result };
  } catch (error) {
    console.error("Get creators action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getTopCreatorsAction(limit?: number) {
  try {
    const creators = await creatorRepo.getTopCreators(limit);
    return { success: true, data: creators };
  } catch (error) {
    console.error("Get top creators action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function checkUsernameAvailabilityAction(username: string) {
  try {
    const available = await creatorRepo.isUsernameAvailable(username);
    return { success: true, data: { available } };
  } catch (error) {
    console.error("Check username availability action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
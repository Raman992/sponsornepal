"use server";

import { revalidatePath } from "next/cache";
import { campaignSchema } from "@/lib/validations/campaign";
import * as campaignRepo from "@/repositories/campaign.repository";

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createCampaignAction(
  brandId: string,
  formData: FormData
): Promise<ActionResult<{ campaignId: string }>> {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      budget: parseFloat(formData.get("budget") as string),
      deliverables: formData.get("deliverables") as string,
      target_audience: formData.get("target_audience") as string,
      platform_requirements: formData.get("platform_requirements") 
        ? JSON.parse(formData.get("platform_requirements") as string) 
        : [],
      deadline: formData.get("deadline") as string,
      campaign_type: formData.get("campaign_type") as string,
    };

    const validated = campaignSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0]?.message || "Invalid form data" 
      };
    }

    const campaignData = {
      ...validated.data,
      deliverables: validated.data.deliverables || undefined,
      target_audience: validated.data.target_audience || undefined,
      campaign_type: validated.data.campaign_type || undefined,
    };

    const result = await campaignRepo.createCampaign(brandId, campaignData);

    if (!result.success || !result.campaign) {
      return { success: false, error: result.error || "Failed to create campaign" };
    }

    revalidatePath("/dashboard/brand/campaigns");
    revalidatePath("/campaigns");
    return { success: true, data: { campaignId: result.campaign.id } };
  } catch (error) {
    console.error("Create campaign action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateCampaignAction(
  campaignId: string,
  brandId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      budget: parseFloat(formData.get("budget") as string),
      deliverables: formData.get("deliverables") as string,
      target_audience: formData.get("target_audience") as string,
      platform_requirements: formData.get("platform_requirements") 
        ? JSON.parse(formData.get("platform_requirements") as string) 
        : [],
      deadline: formData.get("deadline") as string,
      campaign_type: formData.get("campaign_type") as string,
    };

    const validated = campaignSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0]?.message || "Invalid form data" 
      };
    }

    const result = await campaignRepo.updateCampaign(campaignId, brandId, validated.data);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/brand/campaigns");
    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true };
  } catch (error) {
    console.error("Update campaign action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function publishCampaignAction(
  campaignId: string,
  brandId: string
): Promise<ActionResult> {
  try {
    const result = await campaignRepo.publishCampaign(campaignId, brandId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/brand/campaigns");
    revalidatePath("/campaigns");
    return { success: true };
  } catch (error) {
    console.error("Publish campaign action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteCampaignAction(
  campaignId: string,
  brandId: string
): Promise<ActionResult> {
  try {
    const result = await campaignRepo.deleteCampaign(campaignId, brandId);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/brand/campaigns");
    return { success: true };
  } catch (error) {
    console.error("Delete campaign action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCampaignsAction(params?: {
  status?: string;
  brandId?: string;
  search?: string;
  page?: number;
}) {
  try {
    const result = await campaignRepo.getCampaigns(params);
    return { success: true, data: result };
  } catch (error) {
    console.error("Get campaigns action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCampaignByIdAction(id: string) {
  try {
    const campaign = await campaignRepo.getCampaignById(id);
    return { success: true, data: campaign };
  } catch (error) {
    console.error("Get campaign by ID action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getOpenCampaignsAction(limit?: number) {
  try {
    const campaigns = await campaignRepo.getOpenCampaigns(limit);
    return { success: true, data: campaigns };
  } catch (error) {
    console.error("Get open campaigns action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCampaignStatsAction(brandId: string) {
  try {
    const stats = await campaignRepo.getCampaignStats(brandId);
    return { success: true, data: stats };
  } catch (error) {
    console.error("Get campaign stats action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
"use server";

import { revalidatePath } from "next/cache";
import { applicationSchema } from "@/lib/validations/application";
import * as applicationRepo from "@/repositories/application.repository";

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function applyToCampaignAction(
  campaignId: string,
  creatorId: string,
  formData: FormData
): Promise<ActionResult<{ applicationId: string }>> {
  try {
    const rawData = {
      proposal_message: formData.get("proposal_message") as string,
      expected_price: parseFloat(formData.get("expected_price") as string),
      delivery_timeline: formData.get("delivery_timeline") as string,
    };

    const validated = applicationSchema.safeParse(rawData);
    
    if (!validated.success) {
      return { 
        success: false, 
        error: validated.error.issues[0]?.message || "Invalid form data" 
      };
    }

    const hasApplied = await applicationRepo.hasAlreadyApplied(campaignId, creatorId);
    if (hasApplied) {
      return { success: false, error: "You have already applied to this campaign" };
    }

    const result = await applicationRepo.applyToCampaign(campaignId, creatorId, validated.data);

    if (!result.success || !result.application) {
      return { success: false, error: result.error || "Failed to apply to campaign" };
    }

    revalidatePath("/dashboard/creator/applications");
    revalidatePath(`/campaigns/${campaignId}`);
    return { success: true, data: { applicationId: result.application.id } };
  } catch (error) {
    console.error("Apply to campaign action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function updateApplicationStatusAction(
  applicationId: string,
  status: "pending" | "accepted" | "rejected" | "completed"
): Promise<ActionResult> {
  try {
    const result = await applicationRepo.updateApplicationStatus(applicationId, status);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/dashboard/brand/campaigns");
    revalidatePath("/dashboard/creator/applications");
    return { success: true };
  } catch (error) {
    console.error("Update application status action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getApplicationsForCampaignAction(campaignId: string) {
  try {
    const applications = await applicationRepo.getApplicationsForCampaign(campaignId);
    return { success: true, data: applications };
  } catch (error) {
    console.error("Get applications for campaign action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getCreatorApplicationsAction(creatorId: string) {
  try {
    const applications = await applicationRepo.getCreatorApplications(creatorId);
    return { success: true, data: applications };
  } catch (error) {
    console.error("Get creator applications action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getApplicationStatsAction(creatorId: string) {
  try {
    const stats = await applicationRepo.getApplicationStats(creatorId);
    return { success: true, data: stats };
  } catch (error) {
    console.error("Get application stats action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
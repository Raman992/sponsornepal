import {
  getApplicationsForCampaign,
  getCreatorApplications,
  applyToCampaign,
  updateApplicationStatus,
  hasAlreadyApplied,
  getApplicationStats,
} from "@/repositories/application.repository";
import { sendEmail } from "@/lib/email/send";
import { applicationUpdateTemplate } from "@/lib/email/templates";
import { createClient } from "@/lib/supabase/server";
import type { CampaignApplication } from "@/types";

export class ApplicationService {
  async getApplicationsByCampaign(campaignId: string, brandId: string) {
    if (!campaignId || !brandId) {
      return [];
    }
    return getApplicationsForCampaign(campaignId);
  }

  async getApplicationsByCreator(creatorId: string) {
    if (!creatorId) {
      return [];
    }
    return getCreatorApplications(creatorId);
  }

  async createApplication(
    creatorId: string,
    data: {
      campaign_id: string;
      proposal_message?: string;
      expected_price?: number;
      delivery_timeline?: string;
    }
  ) {
    if (!creatorId || !data.campaign_id) {
      return { success: false, error: "Creator ID and Campaign ID are required" };
    }

    const alreadyApplied = await hasAlreadyApplied(data.campaign_id, creatorId);
    if (alreadyApplied) {
      return { success: false, error: "You have already applied to this campaign" };
    }

    return applyToCampaign(data.campaign_id, creatorId, {
      proposal_message: data.proposal_message || "",
      expected_price: data.expected_price || 0,
      delivery_timeline: data.delivery_timeline || "",
    });
  }

  async updateApplicationStatus(
    applicationId: string,
    brandId: string,
    status: "accepted" | "rejected" | "completed"
  ) {
    if (!applicationId || !brandId || !status) {
      return { success: false, error: "All fields are required" };
    }

    const result = await updateApplicationStatus(applicationId, status);

    if (result.success) {
      this.sendStatusEmail(applicationId, status).catch((err) =>
        console.warn("Application status email failed:", err)
      );
    }

    return result;
  }

  private async sendStatusEmail(applicationId: string, status: string) {
    try {
      const supabase = await createClient();
      const { data: app } = await supabase
        .from("campaign_applications")
        .select(`
          campaign:campaigns(title),
          creator:users!campaign_applications_creator_id_fkey(full_name, email)
        `)
        .eq("id", applicationId)
        .single();

      if (app?.creator && app?.campaign) {
        const creator = app.creator as unknown as { full_name: string; email: string };
        const campaign = app.campaign as unknown as { title: string };
        await sendEmail({
          to: creator.email,
          subject: `Application ${status} - ${campaign.title}`,
          html: applicationUpdateTemplate(creator.full_name, campaign.title, status),
        });
      }
    } catch (err) {
      console.warn("Failed to send application status email:", err);
    }
  }

  async hasCreatorApplied(creatorId: string, campaignId: string) {
    return hasAlreadyApplied(campaignId, creatorId);
  }

  async getApplicationStats(creatorId: string) {
    return getApplicationStats(creatorId);
  }
}

export const applicationService = new ApplicationService();

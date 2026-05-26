import {
  getApplication,
  getApplicationsByCampaign,
  getApplicationsByCreator,
  createApplication,
  updateApplicationStatus,
  hasCreatorApplied,
  getApplicationStats,
} from "@/repositories/application.repository";
import { sendEmail } from "@/lib/email/send";
import { applicationUpdateTemplate } from "@/lib/email/templates";
import { createClient } from "@/lib/supabase/server";
import type { Application } from "@/types";

export class ApplicationService {
  async getApplication(id: string) {
    return getApplication(id);
  }

  async getApplicationsByCampaign(campaignId: string, brandId: string) {
    if (!campaignId || !brandId) {
      return [];
    }
    return getApplicationsByCampaign(campaignId, brandId);
  }

  async getApplicationsByCreator(creatorId: string) {
    if (!creatorId) {
      return [];
    }
    return getApplicationsByCreator(creatorId);
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

    const alreadyApplied = await hasCreatorApplied(creatorId, data.campaign_id);
    if (alreadyApplied) {
      return { success: false, error: "You have already applied to this campaign" };
    }

    return createApplication(creatorId, data);
  }

  async updateApplicationStatus(
    applicationId: string,
    brandId: string,
    status: "accepted" | "rejected" | "completed"
  ) {
    if (!applicationId || !brandId || !status) {
      return { success: false, error: "All fields are required" };
    }

    const result = await updateApplicationStatus(applicationId, brandId, status);

    // Send email notification (non-blocking)
    if (result.success) {
      this.sendStatusEmail(applicationId, status).catch((err) =>
        console.warn("Application status email failed:", err)
      );
    }

    return result;
  }

  private async sendStatusEmail(applicationId: string, status: string) {
    try {
      const supabase = createClient();
      const { data: app } = await supabase
        .from("campaign_applications")
        .select(`
          campaign:campaigns(title),
          creator:users!creator_id(full_name, email)
        `)
        .eq("id", applicationId)
        .single();

      if (app?.creator && app?.campaign) {
        const creator = app.creator as { full_name: string; email: string };
        const campaign = app.campaign as { title: string };
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
    return hasCreatorApplied(creatorId, campaignId);
  }

  async getApplicationStats(brandId: string) {
    return getApplicationStats(brandId);
  }
}

export const applicationService = new ApplicationService();

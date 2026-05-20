import {
  getApplication,
  getApplicationsByCampaign,
  getApplicationsByCreator,
  createApplication,
  updateApplicationStatus,
  hasCreatorApplied,
  getApplicationStats,
} from "@/repositories/application.repository";
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

    return updateApplicationStatus(applicationId, brandId, status);
  }

  async hasCreatorApplied(creatorId: string, campaignId: string) {
    return hasCreatorApplied(creatorId, campaignId);
  }

  async getApplicationStats(brandId: string) {
    return getApplicationStats(brandId);
  }
}

export const applicationService = new ApplicationService();

import {
  getCampaigns,
  getCampaignById,
  getOpenCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  publishCampaign,
  getCampaignStats,
} from "@/repositories/campaign.repository";
import type { Campaign, User } from "@/types";

export class CampaignService {
  async getOpenCampaigns(limit: number = 20) {
    return getOpenCampaigns(limit);
  }

  async getCampaigns(params?: {
    status?: string;
    brandId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return getCampaigns(params);
  }

  async getCampaignById(id: string) {
    return getCampaignById(id);
  }

  async createCampaign(
    brandId: string,
    data: {
      title: string;
      description: string;
      budget: number;
      deliverables?: string;
      target_audience?: string;
      platform_requirements?: string[];
      deadline: string;
      campaign_type?: string;
    }
  ) {
    if (!brandId) {
      return { success: false, error: "Brand ID is required" };
    }

    if (!data.title || !data.description) {
      return { success: false, error: "Title and description are required" };
    }

    return createCampaign(brandId, data);
  }

  async updateCampaign(campaignId: string, brandId: string, updates: Partial<Campaign>) {
    if (!campaignId || !brandId) {
      return { success: false, error: "Campaign ID and Brand ID are required" };
    }

    return updateCampaign(campaignId, brandId, updates);
  }

  async deleteCampaign(campaignId: string, brandId: string) {
    if (!campaignId || !brandId) {
      return { success: false, error: "Campaign ID and Brand ID are required" };
    }

    return deleteCampaign(campaignId, brandId);
  }

  async publishCampaign(campaignId: string, brandId: string) {
    if (!campaignId || !brandId) {
      return { success: false, error: "Campaign ID and Brand ID are required" };
    }

    return publishCampaign(campaignId, brandId);
  }

  async getCampaignStats(brandId: string) {
    return getCampaignStats(brandId);
  }
}

export const campaignService = new CampaignService();

import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  getDealStats,
  getActiveDealsCount,
} from "@/repositories/deal.repository";
import type { Deal } from "@/types";

export class DealService {
  async getDeals(params?: {
    creatorId?: string;
    brandId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    return getDeals(params);
  }

  async getDealById(id: string) {
    return getDealById(id);
  }

  async createDeal(
    data: {
      campaign_id: string;
      creator_id: string;
      brand_id: string;
      agreed_amount?: number;
      status?: string;
    }
  ) {
    if (!data.campaign_id || !data.creator_id || !data.brand_id) {
      return { success: false, error: "Campaign, creator, and brand IDs are required" };
    }

    return createDeal(data);
  }

  async updateDeal(dealId: string, userId: string, updates: Partial<Deal>) {
    if (!dealId || !userId) {
      return { success: false, error: "Deal ID and User ID are required" };
    }

    return updateDeal(dealId, userId, updates);
  }

  async getDealStats(userId: string, role: "creator" | "brand") {
    if (!userId || !role) {
      return { total: 0, active: 0, completed: 0, pending: 0 };
    }

    return getDealStats(userId, role);
  }

  async getActiveDealsCount(userId: string, role: "creator" | "brand") {
    if (!userId || !role) {
      return 0;
    }

    return getActiveDealsCount(userId, role);
  }
}

export const dealService = new DealService();

import {
  getDeals,
  getDeal,
  createDeal,
  updateDealStatus,
  updateDealPayment,
  getActiveDeals,
  getPendingDeals,
  getActiveDealCount,
} from "@/repositories/deal.repository";
import { sendEmail } from "@/lib/email/send";
import { dealUpdateTemplate } from "@/lib/email/templates";
import { createClient } from "@/lib/supabase/server";
import type { Deal } from "@/types";

export class DealService {
  async getDeals(userId: string) {
    if (!userId) {
      return [];
    }
    return getDeals(userId);
  }

  async getDealById(dealId: string, userId: string) {
    if (!dealId || !userId) {
      return null;
    }
    return getDeal(dealId, userId);
  }

  async createDeal(
    campaignId: string,
    creatorId: string,
    brandId: string,
    agreedAmount: number
  ) {
    if (!campaignId || !creatorId || !brandId) {
      return { success: false, error: "Campaign, creator, and brand IDs are required" };
    }

    const result = await createDeal(campaignId, creatorId, brandId, agreedAmount);

    if (result.success) {
      this.sendDealEmails(campaignId, creatorId, brandId, "active").catch((err) =>
        console.warn("Deal creation email failed:", err)
      );
    }

    return result;
  }

  async updateDealStatus(dealId: string, userId: string, status: "pending" | "active" | "completed" | "cancelled") {
    if (!dealId || !userId) {
      return { success: false, error: "Deal ID and User ID are required" };
    }

    return updateDealStatus(dealId, userId, status);
  }

  async updateDealPayment(dealId: string, userId: string, escrowStatus: string, payoutStatus?: string) {
    if (!dealId || !userId) {
      return { success: false, error: "Deal ID and User ID are required" };
    }

    return updateDealPayment(dealId, userId, escrowStatus, payoutStatus);
  }

  async getActiveDeals(userId: string) {
    if (!userId) {
      return [];
    }
    return getActiveDeals(userId);
  }

  async getPendingDeals(userId: string) {
    if (!userId) {
      return [];
    }
    return getPendingDeals(userId);
  }

  private async sendDealEmails(campaignId: string, creatorId: string, brandId: string, status: string) {
    try {
      const supabase = await createClient();
      const { data: campaign } = await supabase
        .from("campaigns")
        .select("title")
        .eq("id", campaignId)
        .single();

      if (!campaign) return;

      const { data: users } = await supabase
        .from("users")
        .select("id, full_name, email")
        .in("id", [creatorId, brandId]);

      if (!users) return;

      for (const user of users) {
        await sendEmail({
          to: user.email,
          subject: `New Deal - ${campaign.title}`,
          html: dealUpdateTemplate(user.full_name, campaign.title, status),
        });
      }
    } catch (err) {
      console.warn("Failed to send deal emails:", err);
    }
  }

  private async sendDealUpdateEmail(dealId: string, status: string) {
    try {
      const supabase = await createClient();
      const { data: deal } = await supabase
        .from("deals")
        .select(`
          campaign:campaigns(title),
          creator:users!deals_creator_id_fkey(full_name, email),
          brand:users!deals_brand_id_fkey(full_name, email)
        `)
        .eq("id", dealId)
        .single();

      if (!deal) return;

      const campaign = deal.campaign as unknown as { title: string };
      const creator = deal.creator as unknown as { full_name: string; email: string };
      const brand = deal.brand as unknown as { full_name: string; email: string };

      for (const user of [creator, brand]) {
        await sendEmail({
          to: user.email,
          subject: `Deal ${status} - ${campaign.title}`,
          html: dealUpdateTemplate(user.full_name, campaign.title, status),
        });
      }
    } catch (err) {
      console.warn("Failed to send deal update email:", err);
    }
  }

  async getDealStats(userId: string, role: "creator" | "brand") {
    if (!userId || !role) {
      return { total: 0, active: 0, completed: 0, pending: 0 };
    }

    const deals = await getDeals(userId);
    const field = role === "brand" ? "brand_id" : "creator_id";
    const userDeals = deals.filter((d) => (d as any)[field] === userId);

    return {
      total: userDeals.length,
      active: userDeals.filter((d) => d.status === "active").length,
      completed: userDeals.filter((d) => d.status === "completed").length,
      pending: userDeals.filter((d) => d.status === "pending").length,
    };
  }

  async getActiveDealsCount(userId: string, role: "creator" | "brand") {
    if (!userId || !role) {
      return 0;
    }

    return getActiveDealCount(userId);
  }
}

export const dealService = new DealService();

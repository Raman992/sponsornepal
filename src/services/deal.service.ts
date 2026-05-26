import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  getDealStats,
  getActiveDealsCount,
} from "@/repositories/deal.repository";
import { sendEmail } from "@/lib/email/send";
import { dealUpdateTemplate } from "@/lib/email/templates";
import { createClient } from "@/lib/supabase/server";
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

    const result = await createDeal(data);

    // Send email notification (non-blocking)
    if (result.success) {
      this.sendDealEmails(data.campaign_id, data.creator_id, data.brand_id, "active").catch((err) =>
        console.warn("Deal creation email failed:", err)
      );
    }

    return result;
  }

  async updateDeal(dealId: string, userId: string, updates: Partial<Deal>) {
    if (!dealId || !userId) {
      return { success: false, error: "Deal ID and User ID are required" };
    }

    const result = await updateDeal(dealId, userId, updates);

    // Send email notification on status change (non-blocking)
    if (result.success && updates.status) {
      this.sendDealUpdateEmail(dealId, updates.status as string).catch((err) =>
        console.warn("Deal update email failed:", err)
      );
    }

    return result;
  }

  private async sendDealEmails(campaignId: string, creatorId: string, brandId: string, status: string) {
    try {
      const supabase = createClient();
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
      const supabase = createClient();
      const { data: deal } = await supabase
        .from("deals")
        .select(`
          campaign:campaigns(title),
          creator:users!creator_id(full_name, email),
          brand:users!brand_id(full_name, email)
        `)
        .eq("id", dealId)
        .single();

      if (!deal) return;

      const campaign = deal.campaign as { title: string };
      const creator = deal.creator as { full_name: string; email: string };
      const brand = deal.brand as { full_name: string; email: string };

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

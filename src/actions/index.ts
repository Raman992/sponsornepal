"use server";

import { creatorService } from "@/services/creator.service";
import { campaignService } from "@/services/campaign.service";
import { messagingService } from "@/services/messaging.service";
import { dealService } from "@/services/deal.service";
import { applicationService } from "@/services/application.service";

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// --- Creator Actions ---

export async function getTopCreatorsAction(limit: number = 20): Promise<ActionResult<{ creators: Awaited<ReturnType<typeof creatorService.getTopCreators>> }>> {
  try {
    const creators = await creatorService.getTopCreators(limit);
    return { success: true, data: { creators } };
  } catch (error) {
    console.error("getTopCreatorsAction error:", error);
    return { success: false, error: "Failed to fetch creators" };
  }
}

export async function getCreatorsWithFiltersAction(params: {
  search?: string;
  niche?: string;
  minFollowers?: number;
  maxBudget?: number;
  page?: number;
}): Promise<ActionResult<{ creators: Awaited<ReturnType<typeof creatorService.getAllCreators>>["creators"]; total: number }>> {
  try {
    const result = await creatorService.getAllCreators(params);
    return { success: true, data: result };
  } catch (error) {
    console.error("getCreatorsWithFiltersAction error:", error);
    return { success: false, error: "Failed to fetch creators" };
  }
}

export async function getCreatorByUsernameAction(username: string) {
  try {
    const creator = await creatorService.getCreatorByUsername(username);
    return { success: true, data: creator };
  } catch (error) {
    console.error("getCreatorByUsernameAction error:", error);
    return { success: false, error: "Failed to fetch creator" };
  }
}

// --- Campaign Actions ---

export async function getOpenCampaignsAction(limit: number = 20) {
  try {
    const campaigns = await campaignService.getOpenCampaigns(limit);
    return { success: true, data: campaigns };
  } catch (error) {
    console.error("getOpenCampaignsAction error:", error);
    return { success: false, error: "Failed to fetch campaigns" };
  }
}

export async function getCampaignByIdAction(id: string) {
  try {
    const campaign = await campaignService.getCampaignById(id);
    return { success: true, data: campaign };
  } catch (error) {
    console.error("getCampaignByIdAction error:", error);
    return { success: false, error: "Failed to fetch campaign" };
  }
}

export async function getCreatorCampaignsAction(brandId: string) {
  try {
    const result = await campaignService.getCampaigns({ brandId });
    return { success: true, data: result };
  } catch (error) {
    console.error("getCreatorCampaignsAction error:", error);
    return { success: false, error: "Failed to fetch campaigns" };
  }
}

export async function getBrandCampaignsAction(brandId: string) {
  return getCreatorCampaignsAction(brandId);
}

// --- Deal Stats Actions ---

export async function getDealStatsAction(userId: string, role: "creator" | "brand") {
  try {
    const stats = await dealService.getDealStats(userId, role);
    return { success: true, data: { stats } };
  } catch (error) {
    console.error("getDealStatsAction error:", error);
    return { success: false, error: "Failed to fetch deal stats" };
  }
}

export async function getCreatorApplicationStatsAction(creatorId: string) {
  try {
    const stats = await applicationService.getApplicationStats(creatorId);
    return { success: true, data: { stats } };
  } catch (error) {
    console.error("getCreatorApplicationStatsAction error:", error);
    return { success: false, error: "Failed to fetch application stats" };
  }
}

export async function getActiveDealsCountAction(userId: string) {
  try {
    const count = await dealService.getActiveDealsCount(userId, "creator");
    return { success: true, data: { count } };
  } catch (error) {
    console.error("getActiveDealsCountAction error:", error);
    return { success: false, error: "Failed to fetch active deals" };
  }
}

// --- Messaging Actions ---

export async function getUnreadCountAction(userId: string) {
  try {
    const count = await messagingService.getUnreadCount(userId);
    return { success: true, data: { count } };
  } catch (error) {
    console.error("getUnreadCountAction error:", error);
    return { success: false, error: "Failed to fetch unread count" };
  }
}

export async function getConversationsAction(userId: string) {
  try {
    const conversations = await messagingService.getConversations(userId);
    return { success: true, data: { conversations } };
  } catch (error) {
    console.error("getConversationsAction error:", error);
    return { success: false, error: "Failed to fetch conversations" };
  }
}

export async function getMessagesAction(conversationId: string, userId: string) {
  try {
    const messages = await messagingService.getMessages(conversationId, userId);
    return { success: true, data: { messages } };
  } catch (error) {
    console.error("getMessagesAction error:", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

export async function sendMessageAction(conversationId: string, senderId: string, content: string) {
  try {
    const result = await messagingService.sendMessage(conversationId, senderId, content);
    return { success: true, data: result };
  } catch (error) {
    console.error("sendMessageAction error:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function createConversationAction(creatorId: string, brandId: string) {
  try {
    const result = await messagingService.getOrCreateConversation(creatorId, brandId);
    return { success: true, data: result };
  } catch (error) {
    console.error("createConversationAction error:", error);
    return { success: false, error: "Failed to create conversation" };
  }
}

// --- Application Actions ---

export async function applyToCampaignAction(
  campaignId: string,
  creatorId: string,
  proposalMessage: string,
  expectedPrice: number,
  deliveryTimeline: string
) {
  try {
    const result = await applicationService.createApplication(creatorId, {
      campaign_id: campaignId,
      proposal_message: proposalMessage,
      expected_price: expectedPrice,
      delivery_timeline: deliveryTimeline,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("applyToCampaignAction error:", error);
    return { success: false, error: "Failed to apply to campaign" };
  }
}

export async function getApplicationsForCampaignAction(campaignId: string, brandId: string) {
  try {
    const applications = await applicationService.getApplicationsByCampaign(campaignId, brandId);
    return { success: true, data: applications };
  } catch (error) {
    console.error("getApplicationsForCampaignAction error:", error);
    return { success: false, error: "Failed to fetch applications" };
  }
}

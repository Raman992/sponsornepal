"use server";

import { authService } from "@/services/auth.service";
import {
  getDeals,
  getDeal,
  createDeal,
  updateDealStatus,
  updateDealPayment,
  getActiveDeals,
  getPendingDeals,
  getActiveDealCount,
  getDealByCampaign,
} from "@/repositories/deal.repository";
import { createNotification } from "@/repositories/notification.repository";
import { revalidatePath } from "next/cache";

export async function fetchDeals() {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", deals: [] };
  }

  const deals = await getDeals(user.id);
  return { success: true, deals };
}

export async function fetchDeal(dealId: string) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", deal: null };
  }

  const deal = await getDeal(dealId, user.id);
  if (!deal) {
    return { success: false, error: "Deal not found", deal: null };
  }

  return { success: true, deal };
}

export async function fetchActiveDeals() {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", deals: [] };
  }

  const deals = await getActiveDeals(user.id);
  return { success: true, deals };
}

export async function fetchPendingDeals() {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", deals: [] };
  }

  const deals = await getPendingDeals(user.id);
  return { success: true, deals };
}

export async function fetchActiveDealCount() {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized", count: 0 };
  }

  const count = await getActiveDealCount(user.id);
  return { success: true, count };
}

export async function createNewDeal(
  campaignId: string,
  creatorId: string,
  agreedAmount: number
) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const brandId = user.id;
  const existingDeal = await getDealByCampaign(campaignId);

  if (existingDeal) {
    return { success: false, error: "A deal already exists for this campaign" };
  }

  const result = await createDeal(campaignId, creatorId, brandId, agreedAmount);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  await createNotification(
    creatorId,
    "New Deal Offer",
    `A brand has offered you a deal for ${agreedAmount.toLocaleString()} NPR`
  );

  await createNotification(
    brandId,
    "Deal Created",
    `You've created a deal with a creator for ${agreedAmount.toLocaleString()} NPR`
  );

  revalidatePath("/dashboard/brand/deals");
  revalidatePath("/dashboard/creator/deals");

  return { success: true, deal: result.deal };
}

export async function updateDealStatusAction(
  dealId: string,
  status: "pending" | "active" | "completed" | "cancelled"
) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await updateDealStatus(dealId, user.id, status);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  const deal = await getDeal(dealId, user.id);
  if (deal) {
    const notifyUserId = deal.creator_id === user.id ? deal.brand_id : deal.creator_id;
    await createNotification(
      notifyUserId,
      "Deal Status Updated",
      `Your deal status has been changed to ${status}`
    );
  }

  revalidatePath("/dashboard/brand/deals");
  revalidatePath("/dashboard/creator/deals");
  revalidatePath(`/dashboard/deals/${dealId}`);

  return { success: true };
}

export async function updateDealPaymentAction(
  dealId: string,
  escrowStatus: string,
  payoutStatus?: string
) {
  const user = await authService.getCurrentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const result = await updateDealPayment(
    dealId,
    user.id,
    escrowStatus,
    payoutStatus
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  const deal = await getDeal(dealId, user.id);
  if (deal) {
    const notifyUserId = deal.creator_id === user.id ? deal.brand_id : deal.creator_id;
    const statusMsg = payoutStatus
      ? `Escrow: ${escrowStatus}, Payout: ${payoutStatus}`
      : `Escrow: ${escrowStatus}`;
    await createNotification(
      notifyUserId,
      "Payment Update",
      `Deal payment updated: ${statusMsg}`
    );
  }

  revalidatePath("/dashboard/brand/deals");
  revalidatePath("/dashboard/creator/deals");

  return { success: true };
}

export async function acceptDeal(dealId: string) {
  return updateDealStatusAction(dealId, "active");
}

export async function rejectDeal(dealId: string) {
  return updateDealStatusAction(dealId, "cancelled");
}

export async function completeDeal(dealId: string) {
  return updateDealStatusAction(dealId, "completed");
}

export async function initiateEscrow(dealId: string) {
  return updateDealPaymentAction(dealId, "in_escrow", "pending");
}

export async function releasePayment(dealId: string) {
  return updateDealPaymentAction(dealId, "released", "paid");
}
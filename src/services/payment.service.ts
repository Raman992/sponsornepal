import { createClient } from "@/lib/supabase/server";
import type { Deal } from "@/types";

export interface PaymentRecord {
  id: string;
  deal_id: string;
  amount: number;
  payment_method: string | null;
  payment_status: string;
  created_at: string;
}

export interface EscrowUpdate {
  dealId: string;
  escrowStatus: "pending" | "in_escrow" | "released" | "refunded";
  amount?: number;
  paymentMethod?: string;
}

export interface PayoutUpdate {
  dealId: string;
  payoutStatus: "pending" | "processing" | "paid" | "failed";
  paymentMethod?: string;
  transactionId?: string;
}

export class PaymentService {
  /**
   * Initiate escrow for a deal - brand deposits funds
   */
  async initiateEscrow(update: EscrowUpdate): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error: dealError } = await supabase
      .from("deals")
      .update({
        escrow_status: update.escrowStatus,
        status: update.escrowStatus === "in_escrow" ? "active" : undefined,
      })
      .eq("id", update.dealId);

    if (dealError) {
      console.error("Escrow update error:", dealError);
      return { success: false, error: dealError.message };
    }

    // Create transaction record
    if (update.amount) {
      const { error: txError } = await supabase
        .from("transactions")
        .insert({
          deal_id: update.dealId,
          amount: update.amount,
          payment_method: update.paymentMethod || "manual",
          payment_status: update.escrowStatus === "in_escrow" ? "held" : update.escrowStatus,
        });

      if (txError) {
        console.error("Transaction record error:", txError);
      }
    }

    return { success: true };
  }

  /**
   * Release payment from escrow to creator
   */
  async releasePayment(update: PayoutUpdate): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    const { error: dealError } = await supabase
      .from("deals")
      .update({
        payout_status: update.payoutStatus,
        escrow_status: update.payoutStatus === "paid" ? "released" : undefined,
        status: update.payoutStatus === "paid" ? "completed" : undefined,
      })
      .eq("id", update.dealId);

    if (dealError) {
      console.error("Payout update error:", dealError);
      return { success: false, error: dealError.message };
    }

    // Update or create transaction record
    const { error: txError } = await supabase
      .from("transactions")
      .insert({
        deal_id: update.dealId,
        payment_method: update.paymentMethod || "manual",
        payment_status: update.payoutStatus,
      });

    if (txError) {
      console.error("Transaction record error:", txError);
    }

    return { success: true };
  }

  /**
   * Get payment history for a deal
   */
  async getDealPayments(dealId: string): Promise<PaymentRecord[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch payments error:", error);
      return [];
    }

    return (data || []) as PaymentRecord[];
  }

  /**
   * Get all transactions for a user (via their deals)
   */
  async getUserTransactions(userId: string): Promise<PaymentRecord[]> {
    const supabase = await createClient();

    const { data: deals } = await supabase
      .from("deals")
      .select("id")
      .or(`creator_id.eq.${userId},brand_id.eq.${userId}`);

    if (!deals || deals.length === 0) return [];

    const dealIds = deals.map((d) => d.id);

    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        deal:deals!deal_id(
          id,
          campaign:campaigns(title),
          creator:users!creator_id(full_name),
          brand:users!brand_id(full_name)
        )
      `)
      .in("deal_id", dealIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch user transactions error:", error);
      return [];
    }

    return (data || []) as PaymentRecord[];
  }

  /**
   * Get transaction summary for admin
   */
  async getTransactionSummary(): Promise<{
    totalVolume: number;
    totalTransactions: number;
    pendingPayouts: number;
    heldInEscrow: number;
  }> {
    const supabase = await createClient();

    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount, payment_status");

    if (!transactions) {
      return { totalVolume: 0, totalTransactions: 0, pendingPayouts: 0, heldInEscrow: 0 };
    }

    const totalVolume = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const pendingPayouts = transactions
      .filter((t) => t.payment_status === "pending" || t.payment_status === "processing")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const heldInEscrow = transactions
      .filter((t) => t.payment_status === "held")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      totalVolume,
      totalTransactions: transactions.length,
      pendingPayouts,
      heldInEscrow,
    };
  }
}

export const paymentService = new PaymentService();

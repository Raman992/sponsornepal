"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDeals,
  fetchDeal,
  fetchActiveDeals,
  fetchPendingDeals,
  fetchActiveDealCount,
  createNewDeal,
  updateDealStatusAction,
  updateDealPaymentAction,
  acceptDeal,
  rejectDeal,
  completeDeal,
  initiateEscrow,
  releasePayment,
} from "@/actions/deal.actions";

export function useDeals() {
  return useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const result = await fetchDeals();
      if (!result.success) throw new Error(result.error);
      return result.deals;
    },
  });
}

export function useDeal(dealId: string) {
  return useQuery({
    queryKey: ["deals", dealId],
    queryFn: async () => {
      const result = await fetchDeal(dealId);
      if (!result.success) throw new Error(result.error);
      return result.deal;
    },
    enabled: !!dealId,
  });
}

export function useActiveDeals() {
  return useQuery({
    queryKey: ["deals", "active"],
    queryFn: async () => {
      const result = await fetchActiveDeals();
      if (!result.success) throw new Error(result.error);
      return result.deals;
    },
  });
}

export function usePendingDeals() {
  return useQuery({
    queryKey: ["deals", "pending"],
    queryFn: async () => {
      const result = await fetchPendingDeals();
      if (!result.success) throw new Error(result.error);
      return result.deals;
    },
  });
}

export function useActiveDealCount() {
  return useQuery({
    queryKey: ["deals", "activeCount"],
    queryFn: async () => {
      const result = await fetchActiveDealCount();
      if (!result.success) throw new Error(result.error);
      return result.count;
    },
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      creatorId,
      agreedAmount,
    }: {
      campaignId: string;
      creatorId: string;
      agreedAmount: number;
    }) => {
      const result = await createNewDeal(campaignId, creatorId, agreedAmount);
      if (!result.success) throw new Error(result.error);
      return result.deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

export function useUpdateDealStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      status,
    }: {
      dealId: string;
      status: "pending" | "active" | "completed" | "cancelled";
    }) => {
      const result = await updateDealStatusAction(dealId, status);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

export function useUpdateDealPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dealId,
      escrowStatus,
      payoutStatus,
    }: {
      dealId: string;
      escrowStatus: string;
      payoutStatus?: string;
    }) => {
      const result = await updateDealPaymentAction(dealId, escrowStatus, payoutStatus);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

export function useAcceptDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealId: string) => {
      const result = await acceptDeal(dealId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

export function useRejectDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealId: string) => {
      const result = await rejectDeal(dealId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

export function useCompleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealId: string) => {
      const result = await completeDeal(dealId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

export function useInitiateEscrow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealId: string) => {
      const result = await initiateEscrow(dealId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

export function useReleasePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dealId: string) => {
      const result = await releasePayment(dealId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}

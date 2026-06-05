"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyToCampaignAction,
  updateApplicationStatusAction,
  getApplicationsForCampaignAction,
  getCreatorApplicationsAction,
  getApplicationStatsAction,
} from "@/actions/application.actions";

export function useCreatorApplications(creatorId: string) {
  return useQuery({
    queryKey: ["applications", "creator", creatorId],
    queryFn: async () => {
      const result = await getCreatorApplicationsAction(creatorId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!creatorId,
  });
}

export function useApplicationsForCampaign(campaignId: string) {
  return useQuery({
    queryKey: ["applications", "campaign", campaignId],
    queryFn: async () => {
      const result = await getApplicationsForCampaignAction(campaignId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!campaignId,
  });
}

export function useApplicationStats(creatorId: string) {
  return useQuery({
    queryKey: ["applications", "stats", creatorId],
    queryFn: async () => {
      const result = await getApplicationStatsAction(creatorId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!creatorId,
  });
}

export function useApplyToCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      creatorId,
      proposalMessage,
      expectedPrice,
      deliveryTimeline,
    }: {
      campaignId: string;
      creatorId: string;
      proposalMessage: string;
      expectedPrice: number;
      deliveryTimeline: string;
    }) => {
      const formData = new FormData();
      formData.append("proposal_message", proposalMessage);
      formData.append("expected_price", expectedPrice.toString());
      formData.append("delivery_timeline", deliveryTimeline);

      const result = await applyToCampaignAction(
        campaignId,
        creatorId,
        formData
      );
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: "pending" | "accepted" | "rejected" | "completed";
    }) => {
      const result = await updateApplicationStatusAction(applicationId, status);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

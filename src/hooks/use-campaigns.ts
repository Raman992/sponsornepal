"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOpenCampaignsAction,
  getCampaignByIdAction,
  getCreatorCampaignsAction,
} from "@/actions";
import {
  createCampaignAction,
  updateCampaignAction,
  publishCampaignAction,
  deleteCampaignAction,
  getCampaignsAction,
  getCampaignStatsAction,
} from "@/actions/campaign.actions";

export function useOpenCampaigns(limit?: number) {
  return useQuery({
    queryKey: ["campaigns", "open", limit],
    queryFn: async () => {
      const result = await getOpenCampaignsAction(limit);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
  });
}

export function useCampaignById(id: string) {
  return useQuery({
    queryKey: ["campaigns", "detail", id],
    queryFn: async () => {
      const result = await getCampaignByIdAction(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!id,
  });
}

export function useBrandCampaigns(brandId: string) {
  return useQuery({
    queryKey: ["campaigns", "brand", brandId],
    queryFn: async () => {
      const result = await getCreatorCampaignsAction(brandId);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    enabled: !!brandId,
  });
}

export function useCampaigns(params?: {
  status?: string;
  brandId?: string;
  search?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: ["campaigns", "list", params],
    queryFn: async () => {
      const result = await getCampaignsAction(params);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
  });
}

export function useCampaignStats(brandId: string) {
  return useQuery({
    queryKey: ["campaigns", "stats", brandId],
    queryFn: async () => {
      const result = await getCampaignStatsAction(brandId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!brandId,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ brandId, formData }: { brandId: string; formData: FormData }) => {
      const result = await createCampaignAction(brandId, formData);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      brandId,
      formData,
    }: {
      campaignId: string;
      brandId: string;
      formData: FormData;
    }) => {
      const result = await updateCampaignAction(campaignId, brandId, formData);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function usePublishCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, brandId }: { campaignId: string; brandId: string }) => {
      const result = await publishCampaignAction(campaignId, brandId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, brandId }: { campaignId: string; brandId: string }) => {
      const result = await deleteCampaignAction(campaignId, brandId);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
}

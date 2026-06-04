"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTopCreatorsAction,
  getCreatorsWithFiltersAction,
  getCreatorByUsernameAction,
} from "@/actions";
import {
  updateCreatorProfileAction,
  updateSocialStatsAction,
  getCreatorProfileAction,
  checkUsernameAvailabilityAction,
} from "@/actions/creator.actions";

export function useTopCreators(limit?: number) {
  return useQuery({
    queryKey: ["creators", "top", limit],
    queryFn: async () => {
      const result = await getTopCreatorsAction(limit);
      if (!result.success) throw new Error(result.error);
      return result.data!.creators;
    },
  });
}

export function useCreatorsWithFilters(params: {
  search?: string;
  niche?: string;
  minFollowers?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: ["creators", "filtered", params],
    queryFn: async () => {
      const result = await getCreatorsWithFiltersAction(params);
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
  });
}

export function useCreatorByUsername(username: string) {
  return useQuery({
    queryKey: ["creators", "username", username],
    queryFn: async () => {
      const result = await getCreatorByUsernameAction(username);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!username,
  });
}

export function useCreatorProfile(userId: string) {
  return useQuery({
    queryKey: ["creators", "profile", userId],
    queryFn: async () => {
      const result = await getCreatorProfileAction(userId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    enabled: !!userId,
  });
}

export function useUpdateCreatorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, formData }: { userId: string; formData: FormData }) => {
      const result = await updateCreatorProfileAction(userId, formData);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["creators", "profile", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["creators"] });
    },
  });
}

export function useUpdateSocialStats() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, formData }: { userId: string; formData: FormData }) => {
      const result = await updateSocialStatsAction(userId, formData);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["creators", "profile", variables.userId] });
    },
  });
}

export function useCheckUsernameAvailability() {
  return useMutation({
    mutationFn: async (username: string) => {
      const result = await checkUsernameAvailabilityAction(username);
      if (!result.success) throw new Error(result.error);
      return result.data!.available;
    },
  });
}

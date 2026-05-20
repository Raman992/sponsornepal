import {
  getCreatorProfile,
  getCreatorByUsername,
  updateCreatorProfile,
  createCreatorProfile,
  getAllCreators,
  getTopCreators,
  isUsernameAvailable,
} from "@/repositories/creator.repository";
import type { CreatorProfile } from "@/types";

export class CreatorService {
  async getCreatorProfile(userId: string) {
    return getCreatorProfile(userId);
  }

  async getCreatorByUsername(username: string) {
    return getCreatorByUsername(username);
  }

  async updateCreatorProfile(userId: string, updates: Partial<CreatorProfile>) {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    return updateCreatorProfile(userId, updates);
  }

  async createCreatorProfile(
    userId: string,
    data: { username: string; niche?: string }
  ) {
    if (!userId || !data.username) {
      return { success: false, error: "User ID and username are required" };
    }

    const available = await isUsernameAvailable(data.username);
    if (!available) {
      return { success: false, error: "Username is already taken" };
    }

    return createCreatorProfile(userId, data);
  }

  async getAllCreators(params?: {
    search?: string;
    niche?: string;
    minFollowers?: number;
    page?: number;
    limit?: number;
  }) {
    return getAllCreators(params);
  }

  async getTopCreators(limit: number = 20) {
    return getTopCreators(limit);
  }

  async isUsernameAvailable(username: string) {
    return isUsernameAvailable(username);
  }
}

export const creatorService = new CreatorService();

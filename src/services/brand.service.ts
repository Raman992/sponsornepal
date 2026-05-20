import {
  getBrandProfile,
  updateBrandProfile,
  createBrandProfile,
} from "@/repositories/brand.repository";
import type { BrandProfile } from "@/types";

export class BrandService {
  async getBrandProfile(userId: string) {
    return getBrandProfile(userId);
  }

  async updateBrandProfile(userId: string, updates: Partial<BrandProfile>) {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    return updateBrandProfile(userId, updates);
  }

  async createBrandProfile(
    userId: string,
    data: { company_name: string; website?: string; industry?: string; description?: string }
  ) {
    if (!userId || !data.company_name) {
      return { success: false, error: "User ID and company name are required" };
    }

    return createBrandProfile(userId, data);
  }
}

export const brandService = new BrandService();

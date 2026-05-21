"use server";

import { brandService } from "@/services/brand.service";
import { brandProfileSchema } from "@/lib/validations/brand";
import { revalidatePath } from "next/cache";

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getBrandProfileAction(userId: string): Promise<ActionResult> {
  try {
    const profile = await brandService.getBrandProfile(userId);
    return { success: true, data: profile };
  } catch (error) {
    console.error("Get brand profile action error:", error);
    return { success: false, error: "Failed to fetch brand profile" };
  }
}

export async function updateBrandProfileAction(
  userId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      company_name: formData.get("company_name") as string,
      website: formData.get("website") as string,
      industry: formData.get("industry") as string,
      description: formData.get("description") as string,
    };

    const validated = brandProfileSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid form data",
      };
    }

    const result = await brandService.updateBrandProfile(userId, validated.data);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Update brand profile action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function createBrandProfileAction(
  userId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const rawData = {
      company_name: formData.get("company_name") as string,
      website: formData.get("website") as string,
      industry: formData.get("industry") as string,
      description: formData.get("description") as string,
    };

    const validated = brandProfileSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid form data",
      };
    }

    const result = await brandService.createBrandProfile(userId, validated.data);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/", "layout");
    return { success: true, data: result.profile };
  } catch (error) {
    console.error("Create brand profile action error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

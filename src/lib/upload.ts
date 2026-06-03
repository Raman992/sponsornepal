import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "sponsornepal-uploads";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface UploadOptions {
  folder: "avatars" | "banners" | "portfolio" | "campaigns";
  maxSizeBytes?: number;
  allowedTypes?: string[];
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const PORTFOLIO_TYPES = [...IMAGE_TYPES, "video/mp4", "video/webm", "application/pdf"];

function getFileExtension(filename: string): string {
  return filename.split(".").pop() || "";
}

function generateFilePath(folder: string, userId: string, filename: string): string {
  const ext = getFileExtension(filename);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${folder}/${userId}/${timestamp}-${random}.${ext}`;
}

export async function uploadFile(
  file: File,
  userId: string,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    const supabase = await createClient();

    // Validate file size
    const maxSize = options.maxSizeBytes || DEFAULT_MAX_SIZE;
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size exceeds limit of ${Math.round(maxSize / 1024 / 1024)}MB`,
      };
    }

    // Validate file type
    const allowedTypes = options.allowedTypes || (options.folder === "portfolio" ? PORTFOLIO_TYPES : IMAGE_TYPES);
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      };
    }

    const filePath = generateFilePath(options.folder, userId, file.name);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

export async function uploadAvatar(file: File, userId: string): Promise<UploadResult> {
  return uploadFile(file, userId, {
    folder: "avatars",
    maxSizeBytes: 2 * 1024 * 1024, // 2MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  });
}

export async function uploadBanner(file: File, userId: string): Promise<UploadResult> {
  return uploadFile(file, userId, {
    folder: "banners",
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  });
}

export async function uploadPortfolioItem(file: File, userId: string): Promise<UploadResult> {
  return uploadFile(file, userId, {
    folder: "portfolio",
    maxSizeBytes: 50 * 1024 * 1024, // 50MB for videos
  });
}

export async function uploadCampaignAsset(file: File, campaignId: string): Promise<UploadResult> {
  return uploadFile(file, campaignId, {
    folder: "campaigns",
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
  });
}

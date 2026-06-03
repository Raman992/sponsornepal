export const APP_NAME = "SponsorNepal";
export const APP_DESCRIPTION = "Nepali Creator Monetization Platform";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const ROLES = {
  CREATOR: "creator",
  BRAND: "brand",
  ADMIN: "admin",
} as const;

export const CAMPAIGN_STATUS = {
  DRAFT: "draft",
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const APPLICATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  COMPLETED: "completed",
} as const;

export const DEAL_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const ESCROW_STATUS = {
  PENDING: "pending",
  IN_ESCROW: "in_escrow",
  RELEASED: "released",
  REFUNDED: "refunded",
} as const;

export const PAYOUT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  PAID: "paid",
  FAILED: "failed",
} as const;

export const NICHE_OPTIONS = [
  "Technology",
  "Fashion",
  "Food & Cooking",
  "Travel",
  "Fitness & Health",
  "Beauty",
  "Gaming",
  "Education",
  "Entertainment",
  "Business",
  "Lifestyle",
  "Photography",
  "Music",
  "Art & Design",
  "Sports",
  "Other",
] as const;

export const CATEGORY_OPTIONS = [
  "Lifestyle",
  "Technology",
  "Fashion & Beauty",
  "Food & Beverage",
  "Travel & Tourism",
  "Health & Fitness",
  "Education",
  "Entertainment",
  "Gaming",
  "Business & Finance",
  "Sports",
  "Parenting",
  "Automotive",
  "Real Estate",
  "Other",
] as const;

export const PLATFORM_OPTIONS = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Facebook",
  "Twitter",
  "LinkedIn",
  "Snapchat",
  "Pinterest",
] as const;

export const CAMPAIGN_TYPE_OPTIONS = [
  "Sponsored Post",
  "Product Review",
  "Brand Ambassador",
  "Event Coverage",
  "Content Creation",
  "Social Media Takeover",
  "Giveaway",
  "Other",
] as const;

export const LANGUAGE_OPTIONS = [
  "Nepali",
  "English",
  "Hindi",
  "Newari",
  "Maithili",
  "Bhojpuri",
  "Other",
] as const;

export const PRICING_RANGES = [
  "NPR 1,000 - 5,000",
  "NPR 5,000 - 15,000",
  "NPR 15,000 - 50,000",
  "NPR 50,000 - 100,000",
  "NPR 100,000+",
  "Negotiable",
] as const;

export const ITEMS_PER_PAGE = 12;

export const MAX_FILE_SIZES = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  BANNER: 5 * 1024 * 1024, // 5MB
  PORTFOLIO: 50 * 1024 * 1024, // 50MB
  CAMPAIGN_ASSET: 10 * 1024 * 1024, // 10MB
} as const;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ALLOWED_PORTFOLIO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
] as const;

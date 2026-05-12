export type UserRole = "creator" | "brand" | "admin";

export type CampaignStatus = "draft" | "open" | "in_progress" | "completed" | "cancelled";

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "completed";

export type DealStatus = "pending" | "active" | "completed" | "cancelled";

export type EscrowStatus = "pending" | "in_escrow" | "released" | "refunded";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface User {
  id: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreatorProfile {
  id: string;
  user_id: string;
  username: string;
  bio: string | null;
  niche: string | null;
  location: string | null;
  languages: string[];
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_channel: string | null;
  instagram_followers: number;
  tiktok_followers: number;
  youtube_subscribers: number;
  engagement_rate: number;
  audience_demographics: Record<string, unknown>;
  pricing_range: string | null;
  categories: string[];
  previous_sponsors: string[];
  portfolio: PortfolioItem[];
  banner_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user?: User;
}

export interface PortfolioItem {
  id: string;
  type: "image" | "video";
  url: string;
  caption?: string;
}

export interface BrandProfile {
  id: string;
  user_id: string;
  company_name: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user?: User;
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  budget: number | null;
  deliverables: string | null;
  target_audience: string | null;
  platform_requirements: string[];
  deadline: string | null;
  campaign_type: string | null;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  brand?: User & { brand_profile?: BrandProfile };
  applications?: CampaignApplication[];
}

export interface CampaignApplication {
  id: string;
  campaign_id: string;
  creator_id: string;
  proposal_message: string | null;
  expected_price: number | null;
  delivery_timeline: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  creator?: User & { creator_profile?: CreatorProfile };
  campaign?: Campaign;
}

export interface Conversation {
  id: string;
  creator_id: string;
  brand_id: string;
  created_at: string;
  updated_at: string;
  creator?: User & { creator_profile?: CreatorProfile };
  brand?: User & { brand_profile?: BrandProfile };
  messages?: Message[];
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

export interface Deal {
  id: string;
  campaign_id: string;
  creator_id: string;
  brand_id: string;
  agreed_amount: number | null;
  escrow_status: EscrowStatus;
  payout_status: PaymentStatus;
  status: DealStatus;
  created_at: string;
  updated_at: string;
  campaign?: Campaign;
  creator?: User & { creator_profile?: CreatorProfile };
  brand?: User & { brand_profile?: BrandProfile };
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  deal_id: string;
  amount: number | null;
  payment_method: string | null;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface VerificationRequest {
  id: string;
  creator_id: string;
  documents: string[];
  status: "pending" | "approved" | "rejected";
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface CreatorSearchFilters {
  query?: string;
  niche?: string;
  platform?: "instagram" | "tiktok" | "youtube";
  min_followers?: number;
  max_followers?: number;
  min_engagement?: number;
  location?: string;
  categories?: string[];
  sort_by?: "followers" | "engagement" | "newest";
}

export interface CampaignSearchFilters {
  query?: string;
  status?: CampaignStatus;
  campaign_type?: string;
  min_budget?: number;
  max_budget?: number;
  deadline_before?: string;
  platform?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
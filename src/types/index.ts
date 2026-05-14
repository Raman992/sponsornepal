import type { UserRole } from '@/store/auth-store';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_suspended: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CreatorProfile {
  id: string;
  user_id: string;
  username: string;
  bio: string | null;
  niche: string | null;
  location: string | null;
  languages: string[] | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_channel: string | null;
  instagram_followers: number;
  tiktok_followers: number;
  youtube_subscribers: number;
  engagement_rate: number | null;
  audience_demographics: Record<string, unknown> | null;
  pricing_range: string | null;
  categories: string[] | null;
  previous_sponsors: string[] | null;
  portfolio: Record<string, unknown> | null;
  banner_url: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  user?: User;
}

export interface BrandProfile {
  id: string;
  user_id: string;
  company_name: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  logo_url: string | null;
  created_at?: string;
  updated_at?: string;
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
  platform_requirements: string[] | null;
  deadline: string | null;
  campaign_type: string | null;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  brand?: User;
}

export interface CampaignApplication {
  id: string;
  campaign_id: string;
  creator_id: string;
  proposal_message: string | null;
  expected_price: number | null;
  delivery_timeline: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at?: string;
  updated_at?: string;
  creator?: User;
  creator_profile?: CreatorProfile;
}

export interface Conversation {
  id: string;
  creator_id: string;
  brand_id: string;
  created_at?: string;
  creator?: User;
  brand?: User;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at?: string;
  sender?: User;
}

export interface Deal {
  id: string;
  campaign_id: string;
  creator_id: string;
  brand_id: string;
  agreed_amount: number | null;
  escrow_status: string | null;
  payout_status: string | null;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string | null;
  message: string | null;
  is_read: boolean;
  created_at?: string;
}
import { z } from 'zod';

export const creatorProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
  
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .nullable(),
  
  niche: z
    .string()
    .min(1, 'Please select a niche')
    .optional()
    .nullable(),
  
  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .nullable(),
  
  languages: z
    .array(z.string())
    .optional()
    .default([]),
  
  instagram_handle: z
    .string()
    .max(50, 'Instagram handle too long')
    .optional()
    .nullable(),
  
  tiktok_handle: z
    .string()
    .max(50, 'TikTok handle too long')
    .optional()
    .nullable(),
  
  youtube_channel: z
    .string()
    .max(100, 'YouTube channel URL too long')
    .optional()
    .nullable(),
  
  instagram_followers: z
    .number()
    .min(0, 'Followers cannot be negative')
    .optional()
    .default(0),
  
  tiktok_followers: z
    .number()
    .min(0, 'Followers cannot be negative')
    .optional()
    .default(0),
  
  youtube_subscribers: z
    .number()
    .min(0, 'Subscribers cannot be negative')
    .optional()
    .default(0),
  
  engagement_rate: z
    .number()
    .min(0, 'Engagement rate cannot be negative')
    .max(100, 'Engagement rate must be less than 100')
    .optional()
    .nullable(),
  
  pricing_range: z
    .string()
    .max(50, 'Pricing range too long')
    .optional()
    .nullable(),
  
  categories: z
    .array(z.string())
    .optional()
    .default([]),
});

export type CreatorProfileFormData = z.infer<typeof creatorProfileSchema>;

export const socialStatsSchema = z.object({
  instagram_followers: z.number().min(0).optional(),
  tiktok_followers: z.number().min(0).optional(),
  youtube_subscribers: z.number().min(0).optional(),
  engagement_rate: z.number().min(0).max(100).optional().nullable(),
});

export type SocialStatsFormData = z.infer<typeof socialStatsSchema>;
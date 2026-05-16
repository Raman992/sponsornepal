import { z } from 'zod';

export const campaignSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  
  budget: z
    .number()
    .min(1000, 'Budget must be at least NPR 1,000')
    .max(10000000, 'Budget must be less than NPR 10,000,000'),
  
  deliverables: z
    .string()
    .min(10, 'Deliverables must be at least 10 characters')
    .max(1000, 'Deliverables must be less than 1000 characters')
    .optional()
    .nullable(),
  
  target_audience: z
    .string()
    .min(5, 'Target audience must be at least 5 characters')
    .max(500, 'Target audience must be less than 500 characters')
    .optional()
    .nullable(),
  
  platform_requirements: z
    .array(z.string())
    .min(1, 'Please select at least one platform')
    .optional()
    .default([]),
  
  deadline: z
    .string()
    .min(1, 'Please select a deadline')
    .refine((date) => new Date(date) > new Date(), {
      message: 'Deadline must be in the future',
    }),
  
  campaign_type: z
    .string()
    .min(1, 'Please select a campaign type')
    .optional()
    .nullable(),
});

export type CampaignFormData = z.infer<typeof campaignSchema>;

export const campaignUpdateSchema = campaignSchema.partial();

export type CampaignUpdateFormData = z.infer<typeof campaignUpdateSchema>;
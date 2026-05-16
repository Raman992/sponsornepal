import { z } from 'zod';

export const applicationSchema = z.object({
  campaign_id: z
    .string()
    .uuid('Invalid campaign ID'),
  
  proposal_message: z
    .string()
    .min(50, 'Proposal must be at least 50 characters')
    .max(2000, 'Proposal must be less than 2000 characters'),
  
  expected_price: z
    .number()
    .min(500, 'Minimum price is NPR 500')
    .max(10000000, 'Maximum price is NPR 10,000,000'),
  
  delivery_timeline: z
    .string()
    .min(10, 'Timeline must be at least 10 characters')
    .max(500, 'Timeline must be less than 500 characters'),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const applicationStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected', 'completed']),
});

export type ApplicationStatusFormData = z.infer<typeof applicationStatusSchema>;
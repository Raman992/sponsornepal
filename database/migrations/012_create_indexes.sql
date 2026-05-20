-- Migration: 012_create_indexes
-- Created: 2026-05-18
-- Description: Create indexes for performance optimization

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_creator_username ON creator_profiles(username);
CREATE INDEX IF NOT EXISTS idx_campaign_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_brand_id ON campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_campaign ON campaign_applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_applications_creator ON campaign_applications(creator_id);
CREATE INDEX IF NOT EXISTS idx_deals_brand ON deals(brand_id);
CREATE INDEX IF NOT EXISTS idx_deals_creator ON deals(creator_id);

-- Migration: 005_create_campaigns_table
-- Created: 2026-05-18
-- Description: Create campaigns table with RLS policies

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget NUMERIC(12,2),
  deliverables TEXT,
  target_audience TEXT,
  platform_requirements TEXT[],
  deadline DATE,
  campaign_type TEXT,
  status campaign_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS on campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view open campaigns" ON campaigns;
DROP POLICY IF EXISTS "Brands can manage their own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Service role can do anything" ON campaigns;

-- Create RLS policies for campaigns
CREATE POLICY "Public can view open campaigns" ON campaigns
  FOR SELECT USING (status IN ('open', 'in_progress', 'completed'));

CREATE POLICY "Brands can manage their own campaigns" ON campaigns
  FOR ALL USING (auth.uid() = brand_id);

CREATE POLICY "Service role can do anything" ON campaigns
  USING (auth.role() = 'service_role');

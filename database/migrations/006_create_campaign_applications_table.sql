-- Migration: 006_create_campaign_applications_table
-- Created: 2026-05-18
-- Description: Create campaign_applications table with RLS policies

-- Campaign Applications Table
CREATE TABLE IF NOT EXISTS campaign_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  proposal_message TEXT,
  expected_price NUMERIC(12,2),
  delivery_timeline TEXT,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on campaign_applications
ALTER TABLE campaign_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view application status" ON campaign_applications;
DROP POLICY IF EXISTS "Creators can apply to campaigns" ON campaign_applications;
DROP POLICY IF EXISTS "Creators can view their own applications" ON campaign_applications;
DROP POLICY IF EXISTS "Brands can view applications for their campaigns" ON campaign_applications;
DROP POLICY IF EXISTS "Service role can do anything" ON campaign_applications;

-- Create RLS policies for campaign_applications
CREATE POLICY "Public can view application status" ON campaign_applications
  FOR SELECT USING (true);

CREATE POLICY "Creators can apply to campaigns" ON campaign_applications
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can view their own applications" ON campaign_applications
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Brands can view applications for their campaigns" ON campaign_applications
  FOR SELECT USING (
    auth.uid() IN (SELECT brand_id FROM campaigns WHERE id = campaign_id)
  );

CREATE POLICY "Service role can do anything" ON campaign_applications
  USING (auth.role() = 'service_role');

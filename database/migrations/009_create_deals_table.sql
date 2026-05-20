-- Migration: 009_create_deals_table
-- Created: 2026-05-18
-- Description: Create deals table with RLS policies

-- Deals Table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agreed_amount NUMERIC(12,2),
  escrow_status TEXT,
  payout_status TEXT,
  status deal_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on deals
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their deals" ON deals;
DROP POLICY IF EXISTS "Service role can do anything" ON deals;

-- Create RLS policies for deals
CREATE POLICY "Users can view their deals" ON deals
  FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = brand_id);

CREATE POLICY "Service role can do anything" ON deals
  USING (auth.role() = 'service_role');

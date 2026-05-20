-- Migration: 010_create_saved_creators_table
-- Created: 2026-05-18
-- Description: Create saved_creators table with RLS policies

-- Saved Creators Table
CREATE TABLE IF NOT EXISTS saved_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, creator_id)
);

-- Enable RLS on saved_creators
ALTER TABLE saved_creators ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Brands can manage their saved creators" ON saved_creators;
DROP POLICY IF EXISTS "Service role can do anything" ON saved_creators;

-- Create RLS policies for saved_creators
CREATE POLICY "Brands can manage their saved creators" ON saved_creators
  FOR ALL USING (auth.uid() = brand_id);

CREATE POLICY "Service role can do anything" ON saved_creators
  USING (auth.role() = 'service_role');

-- Migration: 004_create_brand_profiles_table
-- Created: 2026-05-18
-- Description: Create brand_profiles table with RLS policies

-- Brand Profiles Table
CREATE TABLE IF NOT EXISTS brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS on brand_profiles
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view brand profiles" ON brand_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON brand_profiles;
DROP POLICY IF EXISTS "Authenticated users can insert" ON brand_profiles;
DROP POLICY IF EXISTS "Service role can do anything" ON brand_profiles;

-- Create RLS policies for brand_profiles
CREATE POLICY "Public can view brand profiles" ON brand_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON brand_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert" ON brand_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can do anything" ON brand_profiles
  USING (auth.role() = 'service_role');

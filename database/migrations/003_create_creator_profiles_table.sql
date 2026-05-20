-- Migration: 003_create_creator_profiles_table
-- Created: 2026-05-18
-- Description: Create creator_profiles table with RLS policies

-- Creator Profiles Table
CREATE TABLE IF NOT EXISTS creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  niche TEXT,
  location TEXT,
  languages TEXT[],
  instagram_handle TEXT,
  tiktok_handle TEXT,
  youtube_channel TEXT,
  instagram_followers INTEGER DEFAULT 0,
  tiktok_followers INTEGER DEFAULT 0,
  youtube_subscribers INTEGER DEFAULT 0,
  engagement_rate NUMERIC(5,2),
  audience_demographics JSONB,
  pricing_range TEXT,
  categories TEXT[],
  previous_sponsors TEXT[],
  portfolio JSONB,
  banner_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS on creator_profiles
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view creator profiles" ON creator_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON creator_profiles;
DROP POLICY IF EXISTS "Authenticated users can insert their own profile" ON creator_profiles;
DROP POLICY IF EXISTS "Service role can do anything" ON creator_profiles;

-- Create RLS policies for creator_profiles
CREATE POLICY "Public can view creator profiles" ON creator_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON creator_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own profile" ON creator_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can do anything" ON creator_profiles
  USING (auth.role() = 'service_role');

-- SponsorNepal Database Schema
-- Run this in your Supabase SQL Editor

-- Create User Roles Enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('creator', 'brand', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create Campaign Status Enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create Application Status Enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create Deal Status Enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE deal_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'creator',
  full_name TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_suspended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can do anything on users" ON users
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Creator Profiles Table
CREATE TABLE creator_profiles (
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

-- Create RLS policies for creator_profiles
CREATE POLICY "Public can view creator profiles" ON creator_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON creator_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own profile" ON creator_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can do anything" ON creator_profiles
  USING (auth.role() = 'service_role');

-- Brand Profiles Table
CREATE TABLE brand_profiles (
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

-- Create RLS policies for brand_profiles
CREATE POLICY "Public can view brand profiles" ON brand_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON brand_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert" ON brand_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can do anything" ON brand_profiles
  USING (auth.role() = 'service_role');

-- Campaigns Table
CREATE TABLE campaigns (
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

-- Create RLS policies for campaigns
CREATE POLICY "Public can view open campaigns" ON campaigns
  FOR SELECT USING (status IN ('open', 'in_progress', 'completed'));

CREATE POLICY "Brands can manage their own campaigns" ON campaigns
  FOR ALL USING (auth.uid() = brand_id);

CREATE POLICY "Service role can do anything" ON campaigns
  USING (auth.role() = 'service_role');

-- Campaign Applications Table
CREATE TABLE campaign_applications (
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

-- Conversations Table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
  FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = brand_id);

CREATE POLICY "Authenticated users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = creator_id OR auth.uid() = brand_id);

CREATE POLICY "Service role can do anything" ON conversations
  USING (auth.role() = 'service_role');

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages
CREATE POLICY "Users can view their conversation messages" ON messages
  FOR SELECT USING (
    sender_id = auth.uid() OR
    conversation_id IN (
      SELECT id FROM conversations WHERE creator_id = auth.uid() OR brand_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Service role can do anything" ON messages
  USING (auth.role() = 'service_role');

-- Deals Table
CREATE TABLE deals (
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

-- Create RLS policies for deals
CREATE POLICY "Users can view their deals" ON deals
  FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = brand_id);

CREATE POLICY "Service role can do anything" ON deals
  USING (auth.role() = 'service_role');

-- Saved Creators Table
CREATE TABLE saved_creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, creator_id)
);

-- Enable RLS on saved_creators
ALTER TABLE saved_creators ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for saved_creators
CREATE POLICY "Brands can manage their saved creators" ON saved_creators
  FOR ALL USING (auth.uid() = brand_id);

CREATE POLICY "Service role can do anything" ON saved_creators
  USING (auth.role() = 'service_role');

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can do anything" ON notifications
  USING (auth.role() = 'service_role');

-- Create Indexes
CREATE INDEX idx_creator_username ON creator_profiles(username);
CREATE INDEX idx_campaign_status ON campaigns(status);
CREATE INDEX idx_campaign_brand_id ON campaigns(brand_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_applications_campaign ON campaign_applications(campaign_id);
CREATE INDEX idx_applications_creator ON campaign_applications(creator_id);
CREATE INDEX idx_deals_brand ON deals(brand_id);
CREATE INDEX idx_deals_creator ON deals(creator_id);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_creator_profiles_updated_at
  BEFORE UPDATE ON creator_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON brand_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_campaign_applications_updated_at
  BEFORE UPDATE ON campaign_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to auto-create user record after signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, full_name)
  SELECT 
    NEW.id, 
    NEW.email, 
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role, 
      'creator'::user_role
    ),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE id = NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
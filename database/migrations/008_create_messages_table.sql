-- Migration: 008_create_messages_table
-- Created: 2026-05-18
-- Description: Create messages table with RLS policies

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their conversation messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;
DROP POLICY IF EXISTS "Service role can do anything" ON messages;

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

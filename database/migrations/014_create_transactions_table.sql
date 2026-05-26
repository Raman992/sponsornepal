-- Migration: Create transactions table
-- This table tracks payment transactions for deals

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,

  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  transaction_ref TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_deal ON transactions(deal_id);

-- RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Participants can view transactions for their deals
CREATE POLICY "transactions_select_participants" ON transactions
  FOR SELECT
  USING (
    deal_id IN (
      SELECT id FROM deals
      WHERE auth.uid() = creator_id OR auth.uid() = brand_id
    )
  );

-- Service role bypass
CREATE POLICY "transactions_service_role" ON transactions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Supabase Migration: Create tokens table for backup storage
-- Run this in Supabase SQL Editor

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  description TEXT,
  total_supply TEXT NOT NULL,
  creator_wallet TEXT NOT NULL,
  mint_address TEXT NOT NULL UNIQUE,
  token_account TEXT NOT NULL,
  initial_price NUMERIC NOT NULL,
  vesting_period INTEGER DEFAULT 12,
  community_fee NUMERIC NOT NULL,
  decimals INTEGER NOT NULL DEFAULT 9,
  image_url TEXT,
  metadata_uri TEXT NOT NULL,
  token_creation_signature TEXT NOT NULL,
  fee_transaction_signature TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tokens_mint_address ON tokens(mint_address);
CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tokens_creator_wallet ON tokens(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_tokens_symbol ON tokens(symbol);

-- Enable Row Level Security
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read tokens (public data)
DROP POLICY IF EXISTS "Allow public read access" ON tokens;
CREATE POLICY "Allow public read access" ON tokens
  FOR SELECT
  USING (true);

-- Policy: Allow service role to insert/update (server-side only)
DROP POLICY IF EXISTS "Allow service role write access" ON tokens;
CREATE POLICY "Allow service role write access" ON tokens
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add comment to table
COMMENT ON TABLE tokens IS 'Token data backup storage - stores token creation data alongside GitHub storage';

# Supabase Backup Storage Setup

## Overview

Supabase is now configured as a **backup storage** alongside GitHub. When a token is created, data is written to **both** GitHub and Supabase for redundancy.

## Database Schema

You need to create a `tokens` table in your Supabase database.

### Quick Setup

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `funemwsxvpjjuioiheqv`
3. **Navigate to SQL Editor**
4. **Run the migration**: 
   - Open `supabase-migration.sql` file in this repository
   - Copy the entire contents
   - Paste into Supabase SQL Editor
   - Click "Run"

The migration file is located at: `supabase-migration.sql`

**Project URL**: https://funemwsxvpjjuioiheqv.supabase.co

Or run this SQL directly:

```sql
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

-- Create index on mint_address for faster lookups
CREATE INDEX IF NOT EXISTS idx_tokens_mint_address ON tokens(mint_address);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at DESC);

-- Create index on creator_wallet for filtering
CREATE INDEX IF NOT EXISTS idx_tokens_creator_wallet ON tokens(creator_wallet);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read tokens (public data)
CREATE POLICY "Allow public read access" ON tokens
  FOR SELECT
  USING (true);

-- Policy: Allow service role to insert/update (server-side only)
CREATE POLICY "Allow service role write access" ON tokens
  FOR ALL
  USING (auth.role() = 'service_role');
```

## Environment Variables

Your `.env.local` already has these configured. Make sure they're also set in **Vercel**:

```env
# Supabase Configuration (Required for backup storage)
NEXT_PUBLIC_SUPABASE_URL=https://funemwsxvpjjuioiheqv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bmVtd3N4dnBqanVpb2loZXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NzU1NDcsImV4cCI6MjA4MTQ1MTU0N30.pocAFjTutQtr9MhY2YgtuwoujVvDqjUYwrMREMNsvuI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1bmVtd3N4dnBqanVpb2loZXF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg3NTU0NywiZXhwIjoyMDgxNDUxNTQ3fQ.IXVxYLIXaFWrP1UPPKknnENYHbqXGfN9qR_D-1CfdS4
```

**Important:** 
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are for client-side (if needed)
- `SUPABASE_SERVICE_ROLE_KEY` is for server-side operations (required for storage)
- Add these to Vercel environment variables for production

## How It Works

### Token Creation Flow

1. **Token Created On-Chain** ✅
   - Token is minted on Solana
   - Metadata is set on-chain

2. **Dual Storage** (Parallel):
   - **GitHub Storage** → Tries to store in GitHub repository
   - **Supabase Storage** → Tries to store in Supabase database
   
3. **Resilient**:
   - If GitHub fails, Supabase still stores the data
   - If Supabase fails, GitHub still stores the data
   - If both fail, localStorage is used as fallback
   - Token creation **never fails** due to storage issues

### Storage Priority

1. **Primary**: GitHub (for public access via raw.githubusercontent.com)
2. **Backup**: Supabase (for reliable database storage)
3. **Fallback**: localStorage (client-side only)

## Testing

### Test Supabase Connection

```typescript
import { testSupabaseConnection } from './app/lib/supabaseStorage';

const isConnected = await testSupabaseConnection();
console.log('Supabase connected:', isConnected);
```

### Test Storage

Create a test token and check:
1. **GitHub**: Check repository for token file
2. **Supabase**: Query `tokens` table
3. **Logs**: Check console for storage results

## Benefits

✅ **Redundancy**: Data stored in two places  
✅ **Reliability**: If one fails, the other works  
✅ **Query Performance**: Supabase allows fast queries  
✅ **Backup**: GitHub provides public access, Supabase provides database backup  

## Monitoring

Check storage success in logs:
```
✅ Token data stored successfully in: GitHub and Supabase
```

Or if one fails:
```
⚠️ Failed to store token data in GitHub: [error]
✅ Token data stored in Supabase: [id]
✅ Token data stored successfully in: Supabase
```

## Troubleshooting

### Supabase Not Storing

1. **Check Environment Variables**:
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is set
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is set

2. **Check Database Schema**:
   - Ensure `tokens` table exists
   - Verify column names match (snake_case)

3. **Check Permissions**:
   - Service role key should have full access
   - RLS policies should allow service role writes

4. **Check Logs**:
   - Look for Supabase errors in console
   - Check for connection errors

### Table Doesn't Exist

Run the SQL migration above in Supabase SQL Editor:
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Paste the migration SQL
4. Run it

## Files Created

- `app/lib/supabaseStorage.ts` - Supabase storage functions
- `app/api/supabase/store-token/route.ts` - API route (optional, not currently used)

## Integration Points

- `app/lib/createToken.ts` - Updated to store in both GitHub and Supabase
- Storage happens in parallel (both attempts run simultaneously)
- Results are logged separately
- Success if either storage succeeds

---

**Status**: ✅ Ready to use after database setup

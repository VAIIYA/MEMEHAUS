# Verification Checklist - Storage Setup

## ✅ Confirmed Working

### MongoDB
- ✅ `MONGODB_URI` is set in Vercel
- ✅ Connection string: `mongodb+srv://Vercel-Admin-memehaus-mongodb:...@memehaus-mongodb.pgqjrmy.mongodb.net/`
- ✅ Code uses `process.env.MONGODB_URI` - **Compatible!**
- ✅ Collections will be created automatically on first use
- ✅ **Status: Ready to use!**

### Supabase
- ✅ `SUPABASE_URL` is set in Vercel
- ✅ `SUPABASE_PUBLISHABLE_KEY` is set in Vercel
- ✅ `NEXT_PUBLIC_SUPABASE_URL` is set in Vercel
- ⚠️ **Need to check**: `SUPABASE_SERVICE_ROLE_KEY` (required for server-side storage)

## 🔍 What to Check

### 1. Supabase Service Role Key

The code needs `SUPABASE_SERVICE_ROLE_KEY` for server-side operations. Check if it exists:

1. Go to Vercel → Settings → Environment Variables
2. Search for `SUPABASE_SERVICE_ROLE_KEY`
3. If it's **missing**, you need to add it:
   - Go to Supabase Dashboard → Project Settings → API
   - Copy the "service_role" key (keep it secret!)
   - Add to Vercel as `SUPABASE_SERVICE_ROLE_KEY`

### 2. Supabase Database Schema

You still need to create the `tokens` table:

1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `supabase-migration.sql`:

```sql
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

CREATE INDEX IF NOT EXISTS idx_tokens_mint_address ON tokens(mint_address);
CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tokens_creator_wallet ON tokens(creator_wallet);
```

## 🧪 How to Test

### Test MongoDB (Should Work Now)

1. Create a test token on your production site
2. Check browser console for:
   ```
   ✅ Token data stored in MongoDB: [id]
   ✅ Creator wallet stored in MongoDB: [wallet]
   ```

### Test Supabase (After Adding Service Role Key)

1. Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel
2. Run the migration SQL
3. Create a test token
4. Check console for:
   ```
   ✅ Token data stored in Supabase: [id]
   ```

## 📋 Final Checklist

- [x] `MONGODB_URI` set in Vercel ✅
- [x] Supabase variables set in Vercel ✅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` added to Vercel (if missing)
- [ ] Supabase `tokens` table created (run migration)
- [ ] Test token creation to verify all storage works

## 🎯 Next Steps

1. **Check for `SUPABASE_SERVICE_ROLE_KEY`** in Vercel environment variables
2. **Add it if missing** (from Supabase Dashboard → API settings)
3. **Run Supabase migration** to create `tokens` table
4. **Test by creating a token** and checking console logs

---

**MongoDB**: ✅ Ready to use!
**Supabase**: ⚠️ Need service role key + migration


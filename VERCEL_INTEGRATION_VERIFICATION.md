# Vercel Integration Verification Guide

> **Note**: This guide is for **production-only** setup. If you're working production-only (no local dev), you can skip any `vercel link` or `vercel env pull` steps - those are only needed for local development.

## ✅ What's Already Set Up

Since you've connected MongoDB and Supabase through Vercel's integration system, the environment variables are **automatically configured in production**. No local setup needed!

### MongoDB Integration
- **Status**: ✅ Connected (as shown in screenshot)
- **Environment Variable**: `MONGODB_URI` (automatically set by Vercel)
- **Code Compatibility**: ✅ Code already uses `MONGODB_URI`

### Supabase Integration
- **Status**: ✅ Connected (as shown in screenshot)
- **Environment Variables**: Should be automatically set
- **Code Compatibility**: ✅ Code checks for both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`

## 🔍 How to Verify (Production-Only)

> **Skip local dev steps**: Since you work production-only, you don't need `vercel link` or `vercel env pull`. Environment variables are automatically available in production.

### Option 1: Check Vercel Dashboard (Easiest)

1. Go to your Vercel project
2. Navigate to **Settings → Environment Variables**
3. Verify these variables exist:
   - `MONGODB_URI` (from MongoDB integration)
   - `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL` (from Supabase integration)
   - `SUPABASE_SERVICE_ROLE_KEY` (may need to be added manually)

### Option 2: Test by Creating a Token (Best for Production)

The best way to verify is to create a test token and check the console logs:

1. Go to your production site
2. Create a test token
3. Check browser console for:
   ```
   ✅ Token data stored in MongoDB: [id]
   ✅ Token data stored in Supabase: [id]
   ✅ Creator wallet stored in MongoDB: [wallet]
   ```

## ⚙️ Environment Variables

### MongoDB (Auto-set by Vercel)
```env
MONGODB_URI=mongodb+srv://...  # Automatically set by Vercel integration
```

### Supabase (May need manual setup)

Vercel Supabase integration might set:
- `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY`

**But you may need to manually add:**
- `SUPABASE_SERVICE_ROLE_KEY` (required for server-side operations)

To get the service role key:
1. Go to Supabase Dashboard
2. Project Settings → API
3. Copy "service_role" key (keep it secret!)
4. Add to Vercel as `SUPABASE_SERVICE_ROLE_KEY`

## 🧪 Production Testing

Since you work production-only, the best way to test is by creating a real token on your production site. The console logs will show if storage is working.

**Note**: The test script (`npm run test:storage`) is only useful if you're running locally. For production-only workflow, just test by creating a token.

## 📋 What to Check

### 1. MongoDB Setup
- [x] Database connected in Vercel (✅ from screenshot)
- [ ] Verify `MONGODB_URI` is set in Vercel
- [ ] Test connection with test script
- [ ] Verify collections are created on first token creation

### 2. Supabase Setup
- [x] Database connected in Vercel (✅ from screenshot)
- [ ] Verify environment variables are set
- [ ] Run `supabase-migration.sql` to create `tokens` table
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` if not auto-set
- [ ] Test connection with test script

### 3. Supabase Database Schema

**Important**: You still need to run the migration SQL to create the `tokens` table:

1. Go to Supabase Dashboard
2. SQL Editor
3. Run the SQL from `supabase-migration.sql`:

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

## 🎯 Next Steps (Production-Only)

1. **Verify Environment Variables in Vercel**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Confirm `MONGODB_URI` exists (from integration)
   - Confirm Supabase variables exist (from integration)
   - Add `SUPABASE_SERVICE_ROLE_KEY` if missing

2. **Run Supabase Migration**:
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL from `supabase-migration.sql` to create `tokens` table

3. **Test in Production**:
   - Create a test token on your production site
   - Check browser console for storage success messages

4. **If MongoDB fails**:
   - Check Vercel dashboard for `MONGODB_URI`
   - Verify database is accessible
   - Check IP whitelist in MongoDB Atlas

3. **If Supabase fails**:
   - Check for `SUPABASE_SERVICE_ROLE_KEY` in Vercel
   - Run the migration SQL to create `tokens` table
   - Verify environment variables are set

4. **Test with Real Token Creation**:
   - Create a test token
   - Check console logs for storage success messages
   - Verify data appears in both databases

## ✅ Success Indicators

When everything is working, you'll see:

```
✅ MongoDB client connected
✅ Supabase connection successful
✅ Token data stored in MongoDB: [id]
✅ Token data stored in Supabase: [id]
✅ Creator wallet stored in MongoDB: [wallet]
✅ Token data stored successfully in: GitHub, Supabase, MongoDB
```

## 🐛 Troubleshooting

### MongoDB Not Connecting

**Check:**
- `MONGODB_URI` is set in Vercel
- Database is accessible (IP whitelist)
- Connection string format is correct

**Fix:**
- Verify integration in Vercel dashboard
- Check MongoDB Atlas network access
- Redeploy after adding variables

### Supabase Not Connecting

**Check:**
- `SUPABASE_SERVICE_ROLE_KEY` is set
- `tokens` table exists (run migration)
- Environment variables are correct

**Fix:**
- Add `SUPABASE_SERVICE_ROLE_KEY` manually
- Run migration SQL
- Verify table exists in Supabase dashboard

---

**Status**: ✅ Integrations connected - Verify with test script


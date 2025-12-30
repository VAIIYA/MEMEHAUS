# Triple Storage System Summary

## Overview

MemeHaus now uses **triple redundancy storage** for maximum data reliability, in priority order:
1. **MongoDB** - NoSQL database with creator tracking ⭐ FIRST PRIORITY
2. **Supabase** - SQL database backup ⭐ SECOND PRIORITY
3. **GitHub** - Public repository storage ⭐ THIRD PRIORITY

## Why Triple Storage?

- ✅ **Maximum Redundancy**: Data stored in 3 places
- ✅ **Creator/Wallet Tracking**: Critical for early creator rewards
- ✅ **Business Model Support**: Early creators get shares - need reliable tracking
- ✅ **Resilience**: If one fails, others still work
- ✅ **Different Use Cases**: Each storage has different strengths

## Storage Systems (Priority Order)

### 1. MongoDB Storage ⭐ **FIRST PRIORITY**
- **Purpose**: NoSQL flexibility + dedicated creator tracking
- **Format**: MongoDB collections
- **Use Case**: Creator/wallet tracking, early creator rewards
- **Location**: `tokens` collection, `creators` collection
- **Priority**: Tried FIRST

### 2. Supabase Storage ⭐ **SECOND PRIORITY**
- **Purpose**: SQL database for structured queries
- **Format**: PostgreSQL database
- **Use Case**: Fast SQL queries, relational data
- **Location**: `tokens` table, can add `creators` table
- **Priority**: Tried SECOND

### 3. GitHub Storage ⭐ **THIRD PRIORITY**
- **Purpose**: Public access via raw.githubusercontent.com
- **Format**: JSON files in repository
- **Use Case**: Public token listings, easy sharing
- **Location**: `tokens/` directory, `creators.json` file
- **Priority**: Tried THIRD

## Token Creation Flow

```
1. Token Created On-Chain (Solana)
   ↓
2. Sequential Storage (Priority Order):
   ├── [1] MongoDB → inserts into tokens collection ⭐ FIRST
   ├── [2] Supabase → inserts into tokens table
   └── [3] GitHub → stores token.json
   ↓
3. Creator/Wallet Storage (Priority Order):
   ├── [1] MongoDB → updates creators collection ⭐ FIRST
   └── [2] GitHub → updates creators.json
   ↓
4. Success if ANY storage succeeds
```

## Creator/Wallet Tracking (Critical)

**This is your selling point** - early creators get shares in new coins.

### MongoDB `creators` Collection

Tracks:
- ✅ Wallet address (unique)
- ✅ List of tokens created
- ✅ Total tokens created count
- ✅ First token creation date
- ✅ Last update timestamp

**Why MongoDB for Creators?**
- Fast lookups for fee distribution
- Easy to query "all early creators"
- Can calculate rewards efficiently
- Scales with many creators

## Environment Variables Required

### GitHub
```env
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=memehause
GITHUB_REPO=memehause-assets
```

### Supabase
```env
NEXT_PUBLIC_SUPABASE_URL=https://funemwsxvpjjuioiheqv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### MongoDB
```env
MONGODB_URI=your_mongodb_connection_string
```

## Setup Checklist

### GitHub
- [x] Repository exists: `memehause/memehause-assets`
- [x] Token has write access
- [x] `tokens/` directory created

### Supabase
- [ ] Run `supabase-migration.sql` in SQL Editor
- [ ] Verify `tokens` table exists
- [ ] Environment variables set in Vercel

### MongoDB
- [ ] Create MongoDB cluster (Atlas or Vercel)
- [ ] Get connection string
- [ ] Set `MONGODB_URI` in Vercel
- [ ] (Optional) Create indexes for performance

## Success Indicators

### Token Storage
```
✅ Token data stored successfully in: MongoDB, Supabase, GitHub (priority order: MongoDB → Supabase → GitHub)
```

### Creator Storage
```
✅ Creator wallet stored in: MongoDB, GitHub (priority order: MongoDB → GitHub)
```

### Partial Success
```
⚠️ Failed to store token data in GitHub: [error]
✅ Token data stored in Supabase: [id]
✅ Token data stored in MongoDB: [id]
✅ Token data stored successfully in: Supabase, MongoDB
```

## Benefits for Your Business Model

### Early Creator Rewards
- ✅ **Reliable Tracking**: MongoDB ensures creator data is never lost
- ✅ **Fast Queries**: Can quickly find all early creators
- ✅ **Reward Calculation**: Easy to calculate shares based on creation order
- ✅ **Analytics**: Track creator activity over time

### Data Redundancy
- ✅ **Never Lose Data**: 3 backups means data is safe
- ✅ **Different Formats**: JSON, SQL, NoSQL - different use cases
- ✅ **Resilience**: If one system fails, others work

## Files Created

### Storage Services
- `app/lib/githubOnlyStorage.ts` - GitHub storage (existing)
- `app/lib/supabaseStorage.ts` - Supabase storage
- `app/lib/mongodbStorage.ts` - MongoDB storage ⭐

### API Routes
- `app/api/github/store-token/route.ts` - GitHub API
- `app/api/supabase/store-token/route.ts` - Supabase API
- `app/api/mongodb/store-token/route.ts` - MongoDB API

### Integration
- `app/lib/createToken.ts` - Updated to use all 3 systems

## Querying Data

### Get All Creators (for fee distribution)
```typescript
// From MongoDB (fastest)
import { getAllCreatorsFromMongoDB } from './app/lib/mongodbStorage';
const creators = await getAllCreatorsFromMongoDB();

// From GitHub
import { getCreatorList } from './app/lib/githubOnlyStorage';
const creatorList = await getCreatorList();
```

### Get Token Data
```typescript
// Try MongoDB first, fallback to others
import { getTokenDataFromMongoDB } from './app/lib/mongodbStorage';
const token = await getTokenDataFromMongoDB(mintAddress);
```

### Get Creator Stats
```typescript
import { getCreatorDataFromMongoDB } from './app/lib/mongodbStorage';
const creator = await getCreatorDataFromMongoDB(walletAddress);
// Returns: { wallet_address, created_tokens[], total_tokens_created, first_token_created_at }
```

## Next Steps

1. ✅ **Code Complete** - All storage systems integrated
2. ⚠️ **Setup Required**:
   - Run Supabase migration
   - Set up MongoDB cluster
   - Add environment variables to Vercel
3. 🧪 **Test**:
   - Create test token
   - Verify data in all 3 systems
   - Check creator tracking

---

**Status**: ✅ Code ready - Setup required

**Priority**: MongoDB setup is especially important for creator/wallet tracking!

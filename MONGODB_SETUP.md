# MongoDB Backup Storage Setup

## Overview

MongoDB is configured as a **third backup storage** alongside GitHub and Supabase. When a token is created, data is written to **all three** storage systems for maximum redundancy. **Creator/wallet data is especially prioritized** for the early creator rewards system.

## Why MongoDB?

- ✅ **Maximum Redundancy**: Third layer of backup
- ✅ **Creator Tracking**: Dedicated collection for wallet/creator data
- ✅ **Early Creator Rewards**: Critical for tracking who created tokens first
- ✅ **Query Performance**: Fast lookups for creator lists
- ✅ **Scalability**: Handles high volume of token creations

## Database Schema

MongoDB will automatically create collections when data is inserted. The schema is:

### `tokens` Collection

```javascript
{
  id: String,                    // Unique token ID
  name: String,                  // Token name
  symbol: String,                 // Token symbol
  description: String,            // Token description
  total_supply: String,           // Total supply as string
  creator_wallet: String,         // Creator wallet address
  mint_address: String,           // Token mint address (unique index)
  token_account: String,          // Token account address
  initial_price: Number,          // Initial price in SOL
  vesting_period: Number,         // Vesting period in days
  community_fee: Number,          // Community fee percentage
  decimals: Number,               // Token decimals
  image_url: String,              // Optional image URL
  metadata_uri: String,           // Metadata URI
  token_creation_signature: String, // Creation transaction signature
  fee_transaction_signature: String, // Fee transaction signature
  created_at: Date,              // Creation timestamp
  updated_at: Date               // Last update timestamp
}
```

### `creators` Collection (IMPORTANT for Early Creator Rewards)

```javascript
{
  wallet_address: String,        // Creator wallet address (unique)
  created_tokens: [String],       // Array of token mint addresses
  total_tokens_created: Number,   // Total count
  first_token_created_at: Date,   // When they created their first token
  updated_at: Date               // Last update timestamp
}
```

## Environment Variables

Add to your `.env.local` and **Vercel**:

```env
# MongoDB Configuration (Required for backup storage)
MONGODB_URI=your_mongodb_connection_string_here
```

**MongoDB URI Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

Or for Vercel MongoDB:
```
mongodb://username:password@host:port/database
```

## How It Works

### Token Creation Flow

1. **Token Created On-Chain** ✅
   - Token is minted on Solana
   - Metadata is set on-chain

2. **Triple Storage** (Parallel):
   - **GitHub Storage** → Stores in GitHub repository
   - **Supabase Storage** → Stores in Supabase database
   - **MongoDB Storage** → Stores in MongoDB database
   
3. **Creator/Wallet Storage** (Parallel):
   - **GitHub** → Updates `creators.json` file
   - **MongoDB** → Updates `creators` collection (dedicated tracking)

4. **Resilient**:
   - If one fails, others still work
   - If all fail, localStorage is used as fallback
   - Token creation **never fails** due to storage issues

### Storage Priority

1. **Primary**: GitHub (for public access)
2. **Backup**: Supabase (for SQL queries)
3. **Backup**: MongoDB (for NoSQL flexibility and creator tracking)
4. **Fallback**: localStorage (client-side only)

## Creator/Wallet Tracking

**This is critical for your business model** - early creators get a share in newly created coins.

MongoDB stores creator data in a dedicated `creators` collection that tracks:
- ✅ Which wallets created tokens
- ✅ How many tokens each creator made
- ✅ When they first created a token
- ✅ List of all tokens they created

This enables:
- Fast lookups for fee distribution
- Early creator identification
- Reward calculations
- Analytics and insights

## Testing

### Test MongoDB Connection

```typescript
import { testMongoDBConnection } from './app/lib/mongodbStorage';

const isConnected = await testMongoDBConnection();
console.log('MongoDB connected:', isConnected);
```

### Test Storage

Create a test token and check:
1. **GitHub**: Check repository for token file
2. **Supabase**: Query `tokens` table
3. **MongoDB**: Query `tokens` and `creators` collections
4. **Logs**: Check console for storage results

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: Free tier available
3. **Get Connection String**: 
   - Go to "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
4. **Add to Environment Variables**: Set `MONGODB_URI`

### Option 2: Vercel MongoDB Integration

1. **Go to Vercel Dashboard**
2. **Select Project** → **Storage** → **Create Database**
3. **Choose MongoDB**
4. **Copy Connection String** to `MONGODB_URI`

## Indexes (Recommended)

Create indexes for better performance:

```javascript
// In MongoDB shell or Compass
db.tokens.createIndex({ mint_address: 1 }, { unique: true });
db.tokens.createIndex({ creator_wallet: 1 });
db.tokens.createIndex({ created_at: -1 });

db.creators.createIndex({ wallet_address: 1 }, { unique: true });
db.creators.createIndex({ first_token_created_at: 1 });
```

## Benefits

✅ **Maximum Redundancy**: Data in three places  
✅ **Creator Tracking**: Dedicated collection for wallet data  
✅ **Early Creator Rewards**: Critical for your business model  
✅ **Query Flexibility**: NoSQL allows complex queries  
✅ **Scalability**: Handles high volume  

## Monitoring

Check storage success in logs:
```
✅ Token data stored successfully in: GitHub, Supabase, MongoDB
✅ Creator wallet stored in: GitHub, MongoDB
```

Or if some fail:
```
⚠️ Failed to store token data in GitHub: [error]
✅ Token data stored in Supabase: [id]
✅ Token data stored in MongoDB: [id]
✅ Token data stored successfully in: Supabase, MongoDB
```

## Files Created

- `app/lib/mongodbStorage.ts` - MongoDB storage functions
- `app/lib/createToken.ts` - Updated to store in all three systems

## Integration Points

- `app/lib/createToken.ts` - Updated to store in GitHub, Supabase, AND MongoDB
- Storage happens in parallel (all three attempts run simultaneously)
- Creator/wallet data stored separately in MongoDB
- Results are logged separately
- Success if any storage succeeds

## Troubleshooting

### MongoDB Not Storing

1. **Check Environment Variables**:
   - Verify `MONGODB_URI` is set correctly
   - Check connection string format

2. **Check Connection**:
   - Test connection with `testMongoDBConnection()`
   - Verify network access (IP whitelist in Atlas)

3. **Check Logs**:
   - Look for MongoDB errors in console
   - Check for connection errors

### Connection String Issues

- Make sure password is URL-encoded
- Check for special characters in password
- Verify cluster is accessible from your IP

---

**Status**: ✅ Ready to use after MongoDB setup

**Priority**: Creator/wallet data is especially important - MongoDB ensures this is tracked reliably for early creator rewards!

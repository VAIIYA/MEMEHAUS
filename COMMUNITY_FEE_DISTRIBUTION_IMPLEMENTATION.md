# Community Fee Distribution Implementation

## Overview

The community fee distribution system automatically distributes 10% of each token creation to all previous token creators who have minted tokens through MemeHaus.

## How It Works

### 1. Creator List Management

**Storage**: `creators.json` in GitHub repository
- Contains array of unique wallet addresses
- Updated automatically when new tokens are created
- Retrieved on each mint to determine fee recipients

**Functions**:
- `getCreatorList()` - Retrieves current list from GitHub
- `addCreatorToList(wallet)` - Adds new creator (if not already present)

### 2. Fee Collection

When a token is created:
1. 10% community fee is calculated
2. Fee is transferred to server wallet (`7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e`)
3. Creator is added to the creator list in GitHub

### 3. Fee Distribution

**Automatic Distribution**:
- After fees are collected, the system attempts to distribute them automatically
- Calls `/api/fees/distribute` API endpoint
- Server wallet signs and sends distribution transactions

**Manual Distribution** (if automatic fails):
- Fees remain safely in server wallet
- Can be distributed later via API endpoint
- Use: `POST /api/fees/distribute` with `tokenMint` and optional `excludeWallet`

## Implementation Details

### Files Modified

1. **`app/lib/githubOnlyStorage.ts`**
   - Added `getCreatorList()` function
   - Added `addCreatorToList()` function
   - Stores creator list as `creators.json` in GitHub

2. **`app/lib/createToken.ts`**
   - Retrieves previous creators before fee collection
   - Adds new creator to list after token creation
   - Triggers automatic fee distribution after fees are collected

3. **`app/api/fees/distribute/route.ts`** (NEW)
   - Server-side API endpoint for fee distribution
   - Requires `SERVER_WALLET_PRIVATE_KEY` environment variable
   - Distributes fees to all previous creators (excluding current)

## Environment Variables

### Required for Distribution

```env
# Server wallet private key (base64 encoded)
# Used to sign distribution transactions
SERVER_WALLET_PRIVATE_KEY=your_base64_encoded_private_key_here
```

**⚠️ Security Note**: 
- This must be stored securely (never commit to git)
- Use environment variables in production
- Consider using a hardware wallet or secure key management service

### Getting Server Wallet Private Key

To get the private key in base64 format:

```typescript
import { Keypair } from '@solana/web3.js';

const keypair = Keypair.generate(); // Or load existing
const privateKeyBase64 = Buffer.from(keypair.secretKey).toString('base64');
console.log(privateKeyBase64);
```

## API Endpoints

### POST `/api/fees/distribute`

Distribute community fees to previous creators.

**Request Body**:
```json
{
  "tokenMint": "TokenMintAddressHere",
  "excludeWallet": "OptionalWalletToExclude"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Distributed fees to 5 creators",
  "totalRecipients": 5,
  "totalAmount": "1000000000",
  "distributions": [
    {
      "transactionSignature": "signature1",
      "recipients": ["wallet1", "wallet2", ...],
      "amountPerRecipient": "200000000",
      "totalAmount": "1000000000"
    }
  ]
}
```

### GET `/api/fees/distribute?tokenMint=...`

Get distribution status and creator list.

**Response**:
```json
{
  "success": true,
  "totalCreators": 5,
  "creators": ["wallet1", "wallet2", ...],
  "lastUpdated": "2025-01-XX..."
}
```

## Distribution Logic

### Equal Split

Fees are split equally among all previous creators:
- Total fee: 10% of token supply
- Number of recipients: All previous creators (excluding current)
- Amount per creator: `totalFee / numberOfCreators`
- Remainder: Added to first creator (handles rounding)

### Example

```
Token Creator 1: Creates 1B tokens
├── Community Fee: 100M tokens → No previous creators
└── Added to creator list

Token Creator 2: Creates 1B tokens
├── Community Fee: 100M tokens → Creator 1 (100M tokens)
└── Added to creator list

Token Creator 3: Creates 1B tokens
├── Community Fee: 100M tokens → Creator 1 (50M) + Creator 2 (50M)
└── Added to creator list
```

## Transaction Batching

To avoid transaction size limits:
- Distributions are batched into groups of 10 recipients
- Each batch is a separate transaction
- All batches are executed sequentially

## Error Handling

### Automatic Distribution Fails

If automatic distribution fails:
- Token creation still succeeds
- Fees remain safely in server wallet
- Can be distributed manually later via API
- No data loss or security risk

### Manual Distribution

If automatic distribution is not configured:
1. Fees are collected to server wallet
2. Admin can call `/api/fees/distribute` manually
3. Distribution happens server-side with proper signing

## Testing

### Test Creator List

```typescript
import { getCreatorList, addCreatorToList } from './lib/githubOnlyStorage';

// Get list
const list = await getCreatorList();
console.log('Creators:', list.creators);

// Add creator
const result = await addCreatorToList('WalletAddressHere');
console.log('Added:', result.wasNew);
```

### Test Distribution

```bash
# Manual distribution
curl -X POST http://localhost:3000/api/fees/distribute \
  -H "Content-Type: application/json" \
  -d '{
    "tokenMint": "TokenMintAddressHere",
    "excludeWallet": "CurrentCreatorWallet"
  }'
```

## Security Considerations

1. **Server Wallet Private Key**
   - Must be stored securely
   - Never exposed to client-side code
   - Use environment variables or secure key management

2. **API Endpoint Security**
   - Consider adding authentication
   - Rate limiting for distribution endpoint
   - Audit logging for distributions

3. **Transaction Verification**
   - All distributions are on-chain
   - Verifiable via Solana explorer
   - Transaction signatures stored

## Future Improvements

1. **Automatic Background Job**
   - Cron job to check for pending distributions
   - Automatic retry on failures
   - Distribution queue management

2. **Distribution Dashboard**
   - UI to view pending distributions
   - Manual trigger for distributions
   - Distribution history

3. **Gas Optimization**
   - Batch multiple token distributions
   - Optimize transaction sizes
   - Reduce transaction costs

4. **Monitoring**
   - Track distribution success rate
   - Alert on failures
   - Analytics dashboard

## Status

✅ **Implemented**:
- Creator list management in GitHub
- Automatic creator addition on token creation
- Fee distribution API endpoint
- Distribution transaction preparation

⚠️ **Requires Configuration**:
- `SERVER_WALLET_PRIVATE_KEY` environment variable
- Server-side execution for distribution

🔄 **Ready for Testing**:
- Test with devnet first
- Verify creator list updates
- Test distribution with small amounts
- Monitor transaction success


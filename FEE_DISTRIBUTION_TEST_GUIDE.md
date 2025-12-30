# Fee Distribution API Testing Guide

## 🎯 Overview

This guide helps you test the fee distribution API to ensure it's working correctly in production.

## ✅ Prerequisites

1. **Environment Variables Set in Vercel:**
   - ✅ `SERVER_WALLET_PRIVATE_KEY` - Server wallet private key (base58 or base64)
   - ✅ `GITHUB_TOKEN` - GitHub token for accessing creator list

2. **Server Wallet Funded:**
   - Check balance: https://solscan.io/account/7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e
   - Should have at least 0.1 SOL for transaction fees

3. **At Least One Token Created:**
   - Need at least one previous creator in the list
   - Creator list stored in GitHub: `creators.json`

## 🧪 Testing Methods

### Method 1: Using the Test Script (Recommended)

**Setup:**
```bash
# Install dependencies if needed
npm install node-fetch @types/node-fetch

# Set environment variables
export API_BASE_URL=https://memehaus.vercel.app
export TEST_TOKEN_MINT=<your_token_mint_address>
export EXCLUDE_WALLET=<current_creator_wallet>  # Optional
```

**Run the test:**
```bash
# Using ts-node
npx ts-node scripts/test-fee-distribution-api.ts

# Or add to package.json scripts:
# "test:fee-distribution": "ts-node scripts/test-fee-distribution-api.ts"
npm run test:fee-distribution
```

### Method 2: Using cURL (Quick Test)

**Test GET endpoint (check creator list):**
```bash
curl "https://memehaus.vercel.app/api/fees/distribute?tokenMint=YOUR_TOKEN_MINT" | jq
```

**Test POST endpoint (distribute fees):**
```bash
curl -X POST https://memehaus.vercel.app/api/fees/distribute \
  -H "Content-Type: application/json" \
  -d '{
    "tokenMint": "YOUR_TOKEN_MINT",
    "excludeWallet": "CURRENT_CREATOR_WALLET"
  }' | jq
```

### Method 3: Using Browser Console

1. Open your production site: https://memehaus.vercel.app
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run:

```javascript
// Test GET endpoint
fetch('/api/fees/distribute?tokenMint=YOUR_TOKEN_MINT')
  .then(r => r.json())
  .then(console.log);

// Test POST endpoint
fetch('/api/fees/distribute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tokenMint: 'YOUR_TOKEN_MINT',
    excludeWallet: 'CURRENT_CREATOR_WALLET'
  })
})
  .then(r => r.json())
  .then(console.log);
```

## 📋 Test Scenarios

### Scenario 1: Check Creator List (GET)

**Expected Response:**
```json
{
  "success": true,
  "totalCreators": 2,
  "creators": [
    "Wallet1...",
    "Wallet2..."
  ],
  "lastUpdated": "2025-01-XX..."
}
```

**What to Verify:**
- ✅ Returns success: true
- ✅ totalCreators matches number of creators
- ✅ creators array contains wallet addresses
- ✅ No errors in response

### Scenario 2: Distribute Fees (POST) - Success Case

**Expected Response:**
```json
{
  "success": true,
  "message": "Distributed fees to 2 creators",
  "totalRecipients": 2,
  "totalAmount": "1000000000",
  "distributions": [
    {
      "transactionSignature": "5j7s8...",
      "recipients": ["Wallet1...", "Wallet2..."],
      "amountPerRecipient": "500000000",
      "totalAmount": "1000000000"
    }
  ]
}
```

**What to Verify:**
- ✅ Returns success: true
- ✅ Transaction signatures are valid
- ✅ Check transactions on Solana explorer
- ✅ Verify recipients received tokens
- ✅ Server wallet balance decreased

### Scenario 3: No Previous Creators

**Expected Response:**
```json
{
  "success": true,
  "message": "No previous creators to distribute fees to",
  "distributions": []
}
```

**What to Verify:**
- ✅ Returns success: true (not an error)
- ✅ Message indicates no creators
- ✅ Empty distributions array

### Scenario 4: No Fees Available

**Expected Response:**
```json
{
  "success": false,
  "error": "No community fees available to distribute"
}
```

**What to Verify:**
- ✅ Returns success: false
- ✅ Error message is clear
- ✅ Status code: 400

### Scenario 5: Missing Parameters

**Expected Response:**
```json
{
  "success": false,
  "error": "tokenMint is required"
}
```

**What to Verify:**
- ✅ Returns success: false
- ✅ Error message is descriptive
- ✅ Status code: 400

## 🔍 Verification Steps

### 1. Check Creator List in GitHub

1. Go to: https://github.com/memehause/memehause-assets
2. Check `creators.json` file
3. Verify wallet addresses are correct
4. Check last updated timestamp

### 2. Verify Server Wallet Balance

1. Go to: https://solscan.io/account/7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e
2. Check SOL balance (should have enough for fees)
3. Check token account balances for tokens with fees

### 3. Verify Distribution Transactions

1. Copy transaction signature from API response
2. Go to: https://solscan.io/tx/<signature>
3. Verify:
   - ✅ Transaction confirmed
   - ✅ Transfers to correct recipients
   - ✅ Amounts are correct
   - ✅ Token accounts created if needed

### 4. Verify Recipients Received Tokens

1. Check recipient wallet on Solana explorer
2. Verify token balance increased
3. Check transaction history

## 🐛 Troubleshooting

### Error: "Server wallet private key not configured"

**Solution:**
- Verify `SERVER_WALLET_PRIVATE_KEY` is set in Vercel
- Check environment variable name (no typos)
- Redeploy after adding variable

### Error: "Invalid private key format"

**Solution:**
- Verify key is base58 or base64 encoded
- Check for extra spaces or characters
- Ensure key is complete

### Error: "Private key does not match expected server wallet address"

**Solution:**
- Verify private key matches server wallet address
- Check wallet address: `7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e`
- Regenerate keypair if needed

### Error: "No community fees available to distribute"

**Solution:**
- Check server wallet token account balance
- Verify fees were collected during token creation
- Check token mint address is correct

### Error: "Failed to get creator list"

**Solution:**
- Verify `GITHUB_TOKEN` is set in Vercel
- Check GitHub repository access
- Verify repository name: `memehause/memehause-assets`

### Transaction Fails

**Possible Causes:**
- Insufficient SOL in server wallet for fees
- Network congestion
- Invalid recipient addresses
- Token account creation failed

**Solutions:**
- Fund server wallet with more SOL
- Retry the request
- Check transaction on explorer for details
- Verify recipient addresses are valid

## 📊 Success Criteria

The API is working correctly if:

- ✅ GET endpoint returns creator list
- ✅ POST endpoint distributes fees successfully
- ✅ Transactions appear on Solana explorer
- ✅ Recipients receive tokens
- ✅ Server wallet balance decreases appropriately
- ✅ Error cases are handled gracefully

## 🚀 Next Steps After Testing

1. **Monitor First Distribution:**
   - Watch transaction confirmations
   - Verify all recipients received tokens
   - Check for any errors

2. **Test Automatic Distribution:**
   - Create a new token
   - Verify automatic distribution triggers
   - Check console logs for distribution status

3. **Set Up Monitoring:**
   - Monitor server wallet balance
   - Track distribution success rate
   - Set up alerts for failures

## 📝 Notes

- Distribution is now **automatic** after token creation
- If automatic distribution fails, fees remain in server wallet
- Manual distribution via API is still available as backup
- All distributions are on-chain and verifiable

---

**Ready to test!** Start with the GET endpoint to verify the creator list, then test distribution with a small amount first.



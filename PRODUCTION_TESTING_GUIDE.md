# Production Testing Guide - MemeHaus Live

## 🎯 Testing Strategy

**Testing directly on production**: https://memehaus.vercel.app

This guide helps you test the fee distribution system after each deployment to ensure everything works correctly on the live site.

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [ ] `SERVER_WALLET_PRIVATE_KEY` is set in Vercel environment variables
- [ ] Server wallet has sufficient SOL balance (check: https://solscan.io/account/7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e)
- [ ] All code changes are committed and pushed
- [ ] Vercel deployment is successful

## 🧪 Testing Steps (After Each Deployment)

### Step 1: Verify Server Wallet Configuration

1. **Check Server Wallet Balance**
   - Visit: https://solscan.io/account/7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e
   - Ensure wallet has at least 0.1 SOL for transaction fees
   - If low, fund the wallet

2. **Test Private Key Loading** (via API)
   ```bash
   # This will fail if private key is not set correctly
   curl https://memehaus.vercel.app/api/fees/distribute?tokenMint=test
   ```
   - Should return creator list (even if empty)
   - If error about private key, check Vercel environment variables

### Step 2: Test Creator List System

1. **Check GitHub Storage**
   - Visit: https://github.com/memehause/memehause-assets
   - Check if `creators.json` exists
   - If not, it will be created on first token creation

2. **Test Creator List API**
   ```bash
   curl https://memehaus.vercel.app/api/fees/distribute?tokenMint=test
   ```
   - Should return JSON with creator list
   - Example response:
     ```json
     {
       "success": true,
       "totalCreators": 0,
       "creators": [],
       "lastUpdated": null
     }
     ```

### Step 3: Test Token Creation Flow

1. **Create a Test Token**
   - Go to: https://memehaus.vercel.app/create
   - Connect your wallet
   - Create a token with:
     - Small supply (e.g., 1,000,000 tokens) to minimize costs
     - Test name and symbol
     - Test image
   
2. **Monitor the Process**
   - Watch browser console for logs
   - Verify:
     - ✅ Token creation succeeds
     - ✅ Creator is added to `creators.json` in GitHub
     - ✅ Fees are collected to server wallet
     - ✅ Distribution info is logged in console

3. **Verify on Solana Explorer**
   - Get the token mint address from the success message
   - Check transaction on: https://solscan.io
   - Verify:
     - Token was created
     - Fees were transferred to server wallet
     - Transaction signatures are valid

### Step 4: Test Fee Distribution

1. **After Creating First Token**
   - No distribution should happen (no previous creators)
   - Check server wallet balance increased

2. **After Creating Second Token**
   - Now there's 1 previous creator
   - Test distribution manually:
     ```bash
     curl -X POST https://memehaus.vercel.app/api/fees/distribute \
       -H "Content-Type: application/json" \
       -d '{
         "tokenMint": "YOUR_TOKEN_MINT_ADDRESS",
         "excludeWallet": "YOUR_CREATOR_WALLET"
       }'
     ```

3. **Verify Distribution**
   - Check response for success
   - Verify transaction signatures on Solana explorer
   - Check that tokens were sent to previous creator
   - Verify server wallet balance decreased

### Step 5: Verify GitHub Storage

1. **Check Creator List**
   - Visit: https://github.com/memehause/memehause-assets/blob/main/creators.json
   - Verify new creators are added
   - Check list is accurate

2. **Check Token Data**
   - Verify token data is stored in GitHub
   - Check metadata is correct

## 🔍 What to Monitor

### After Each Token Creation

1. **Console Logs**
   - Check browser console for:
     - `📋 Fee distribution ready:` message
     - Token mint address
     - Community fee amount
     - Number of recipients
     - Distribution instructions

2. **Server Wallet Balance**
   - Monitor: https://solscan.io/account/7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e
   - Should increase by community fee amount after each token creation

3. **GitHub Storage**
   - Check `creators.json` updates
   - Verify token data is stored

4. **Transaction Status**
   - All transactions should be confirmed
   - Check on Solana explorer

## 🚨 Troubleshooting

### Issue: Token Creation Fails

**Check:**
- Wallet has sufficient SOL
- RPC endpoint is working
- Network is mainnet-beta
- Browser console for errors

**Fix:**
- Ensure wallet is funded
- Check RPC endpoint in Vercel environment variables
- Verify network settings

### Issue: Creator Not Added to List

**Check:**
- GitHub token is set in Vercel
- GitHub repository permissions
- Browser console for errors

**Fix:**
- Verify `GITHUB_TOKEN` in Vercel
- Check repository access
- Review error logs

### Issue: Fee Distribution Fails

**Check:**
- `SERVER_WALLET_PRIVATE_KEY` is set correctly
- Server wallet has SOL for fees
- Private key format (base58 or base64)
- API endpoint logs

**Fix:**
- Verify private key in Vercel
- Fund server wallet
- Check key format matches expected
- Review API error responses

### Issue: Distribution API Returns Error

**Check:**
- Private key is configured
- Server wallet balance
- Token mint address is correct
- Previous creators exist

**Fix:**
- Verify `SERVER_WALLET_PRIVATE_KEY` in Vercel
- Ensure server wallet has SOL
- Double-check token mint address
- Verify creator list has entries

## 📊 Testing Checklist

### First Token Creation

- [ ] Token created successfully
- [ ] Creator added to `creators.json`
- [ ] Fees collected to server wallet
- [ ] No distribution (no previous creators)
- [ ] Transaction confirmed on explorer

### Second Token Creation

- [ ] Token created successfully
- [ ] Creator added to `creators.json`
- [ ] Fees collected to server wallet
- [ ] Distribution ready (1 previous creator)
- [ ] Manual distribution works
- [ ] Previous creator receives tokens
- [ ] Transaction confirmed on explorer

### Third Token Creation

- [ ] Token created successfully
- [ ] Creator added to `creators.json`
- [ ] Fees collected to server wallet
- [ ] Distribution ready (2 previous creators)
- [ ] Manual distribution works
- [ ] Both previous creators receive tokens
- [ ] Tokens split equally
- [ ] Transactions confirmed on explorer

## 🎯 Success Criteria

The system is working correctly when:

- ✅ Token creation succeeds
- ✅ Creator is automatically added to GitHub list
- ✅ Fees are collected to server wallet
- ✅ Distribution API works when called
- ✅ Previous creators receive tokens
- ✅ All transactions are confirmed
- ✅ GitHub storage is updated correctly

## 📝 Testing Log Template

Keep a log of each test:

```
Date: [Date]
Token Name: [Name]
Token Mint: [Address]
Creator: [Wallet Address]
Supply: [Amount]
Community Fee: [Amount]
Previous Creators: [Count]
Distribution: [Success/Fail]
Transaction: [Signature]
Notes: [Any issues or observations]
```

## 🔄 After Each Deployment

1. **Quick Smoke Test**
   - Create a small test token
   - Verify it works end-to-end
   - Check console logs
   - Verify GitHub storage

2. **Full Test** (if major changes)
   - Test token creation
   - Test fee collection
   - Test distribution
   - Verify all transactions

3. **Monitor**
   - Watch for errors
   - Check server wallet balance
   - Monitor GitHub storage
   - Review transaction history

## 💡 Tips

- **Start Small**: Use small token supplies for testing
- **Monitor Closely**: Watch console and explorer during tests
- **Document Issues**: Keep notes of any problems
- **Verify Everything**: Double-check all transactions
- **Test Incrementally**: Test one feature at a time

## 🚀 Ready to Test

1. Deploy latest code to Vercel
2. Verify environment variables are set
3. Go to https://memehaus.vercel.app/create
4. Create a test token
5. Monitor the process
6. Verify everything works!

---

**Remember**: You're testing on mainnet with real SOL and real tokens. Start with small amounts and verify each step carefully.


# Quick Test Guide - Fee Distribution API

## 🚀 Quick Start

### 1. Test GET Endpoint (Check Creator List)

```bash
curl "https://memehaus.vercel.app/api/fees/distribute?tokenMint=YOUR_TOKEN_MINT" | jq
```

**Expected:** Returns list of creators

### 2. Test POST Endpoint (Distribute Fees)

```bash
curl -X POST https://memehaus.vercel.app/api/fees/distribute \
  -H "Content-Type: application/json" \
  -d '{
    "tokenMint": "YOUR_TOKEN_MINT",
    "excludeWallet": "CURRENT_CREATOR_WALLET"
  }' | jq
```

**Expected:** Returns distribution transaction signatures

### 3. Verify on Solana Explorer

1. Copy transaction signature from response
2. Visit: `https://solscan.io/tx/<signature>`
3. Verify transaction confirmed and tokens transferred

## ✅ Checklist

- [ ] GET endpoint returns creator list
- [ ] POST endpoint distributes fees
- [ ] Transactions appear on Solana explorer
- [ ] Recipients received tokens
- [ ] Server wallet balance decreased

## 📝 Notes

- Automatic distribution happens after token creation
- Manual API call is backup if automatic fails
- All transactions are on-chain and verifiable

---

For detailed testing guide, see: `FEE_DISTRIBUTION_TEST_GUIDE.md`



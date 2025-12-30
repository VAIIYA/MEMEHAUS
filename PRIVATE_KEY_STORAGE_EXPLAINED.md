# Private Key Storage - Simple Explanation

## 🔒 Your Private Key is SAFE

### How Next.js Protects It

In Next.js, there are **two types** of environment variables:

1. **`NEXT_PUBLIC_*`** → Exposed to browser (clients can see)
2. **Everything else** → Server-only (clients CANNOT see)

### Our Implementation

```typescript
// ✅ SECURE - No NEXT_PUBLIC_ prefix
const SERVER_WALLET_PRIVATE_KEY = process.env.SERVER_WALLET_PRIVATE_KEY;
```

**This means**:
- ✅ Only accessible on the server
- ✅ Never sent to the browser
- ✅ Never in client-side JavaScript
- ✅ Never in the build output

## 📁 Where You Store It

### Step 1: Create `.env.local` File

In your project root, create a file called `.env.local`:

```bash
# .env.local (this file is NOT committed to git)
SERVER_WALLET_PRIVATE_KEY=your_base64_encoded_key_here
```

### Step 2: Verify It's Ignored

Check `.gitignore` - it should contain:
```
.env*.local
.env
```

This means `.env.local` will **NEVER** be committed to git.

### Step 3: For Production (Vercel)

1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Add:
   - **Key**: `SERVER_WALLET_PRIVATE_KEY`
   - **Value**: Your base64-encoded private key
   - **Environment**: Production

## 🔐 How to Get Your Private Key

**Good News**: The code now supports **both base58 and base64** formats!

### If You Have Base58 (Most Common)
- **Just paste it directly** into Vercel - no conversion needed!
- Base58 is Solana's native format
- Example: `4iGE6kZDimZCaw9WpkMd8bMYdz7ehSPNcWJQJ5Qdh1JL7rQJmuHcMZCifQ4sHAwhcvvSkSTfKq4fbtn7E38AqkLg`

### If You Need to Convert Formats

**Base58 to Base64:**
```typescript
import bs58 from 'bs58';

const base58Key = 'your_base58_private_key';
const keypair = Keypair.fromSecretKey(bs58.decode(base58Key));
const base64 = Buffer.from(keypair.secretKey).toString('base64');
console.log(base64);
```

**Generate New Keypair:**
```typescript
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const keypair = Keypair.generate();
const base58 = bs58.encode(keypair.secretKey);
console.log('Public Key:', keypair.publicKey.toBase58());
console.log('Private Key (base58):', base58);
```

## ✅ Security Checklist

- [ ] Private key is in `.env.local` (local) or Vercel env vars (production)
- [ ] `.env.local` is in `.gitignore` (check: `git status` should NOT show it)
- [ ] Variable name does NOT start with `NEXT_PUBLIC_`
- [ ] Only used in API routes (server-side)
- [ ] Never logged to console
- [ ] Never sent in API responses

## 🧪 How to Verify It's Safe

### Test 1: Check Build
```bash
npm run build
# Search for your key in build output
grep -r "your_private_key" .next/
# Should find NOTHING ✅
```

### Test 2: Check Browser
1. Open your app in browser
2. Open DevTools → Network
3. Look at all JavaScript files
4. Search for your private key
5. **Should NOT be found** ✅

### Test 3: Check Git
```bash
git status
# .env.local should NOT appear ✅

git log --all --full-history -- .env.local
# Should return nothing ✅
```

## 🎯 Summary

**Your private key is stored:**
- ✅ In `.env.local` (local development)
- ✅ In Vercel environment variables (production)
- ❌ **NOT** in source code
- ❌ **NOT** in git
- ❌ **NOT** in browser
- ❌ **NOT** in build output

**It's only accessible:**
- ✅ On the server
- ✅ In API routes
- ✅ When processing fee distributions

**Users CANNOT see it** because:
- No `NEXT_PUBLIC_` prefix
- Only used server-side
- Never sent to browser

---

**You're safe!** 🔒 The private key is server-side only and never exposed to clients.


# Server Wallet Private Key - Security Guide

## 🔒 How It's Stored (SECURE)

### ✅ Server-Side Only

The private key is **NEVER exposed to clients** because:

1. **No `NEXT_PUBLIC_` Prefix**
   - Variable name: `SERVER_WALLET_PRIVATE_KEY` (NOT `NEXT_PUBLIC_SERVER_WALLET_PRIVATE_KEY`)
   - In Next.js, only variables with `NEXT_PUBLIC_` prefix are exposed to the browser
   - Without this prefix, the variable is **server-side only**

2. **Only Used in API Routes**
   - Located in: `app/api/fees/distribute/route.ts`
   - API routes run **exclusively on the server**
   - Never sent to the client or included in client-side bundles

3. **Environment Variable Storage**
   - Stored in `.env.local` (local development)
   - Stored in deployment platform environment variables (production)
   - **Never committed to git** (`.gitignore` excludes `.env*` files)

## 📁 Where to Store the Private Key

### Local Development

Create `.env.local` in the project root:

```bash
# .env.local (NOT committed to git)
SERVER_WALLET_PRIVATE_KEY=your_base64_encoded_private_key_here
```

**⚠️ Important**: 
- `.env.local` is in `.gitignore` - it will NEVER be committed
- Never share this file or its contents
- Never commit it to git

### Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Add:
   - **Name**: `SERVER_WALLET_PRIVATE_KEY`
   - **Value**: Your base64-encoded private key
   - **Environment**: Production, Preview, Development (as needed)

### Production (Other Platforms)

Set the environment variable in your deployment platform:
- **Railway**: Project Settings → Variables
- **Render**: Environment → Environment Variables
- **AWS**: Use AWS Secrets Manager or Parameter Store
- **Docker**: Pass via `-e` flag or `.env` file

## 🔐 How to Generate/Encode the Private Key

**✅ Good News**: The code now supports **both base58 and base64** formats!

### Option 1: Use Base58 Directly (Recommended - No Conversion Needed!)

If you have a base58 private key (Solana's native format), **just paste it directly** into Vercel:

```typescript
// If you already have a base58 key from Solana CLI or wallet
// Just use it directly - no conversion needed!
const privateKeyBase58 = 'your_base58_private_key';
// Paste this directly into Vercel environment variable
```

### Option 2: Generate New Wallet (Base58)

```typescript
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Generate new keypair
const keypair = Keypair.generate();

// Get public key (wallet address)
console.log('Public Key (Wallet Address):', keypair.publicKey.toBase58());

// Get private key in base58 (native Solana format)
const privateKeyBase58 = bs58.encode(keypair.secretKey);
console.log('Add this to .env.local or Vercel:');
console.log(`SERVER_WALLET_PRIVATE_KEY=${privateKeyBase58}`);
```

### Option 3: From Existing Wallet (Base58)

```typescript
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// If you have the private key in base58 format
const privateKeyBase58 = 'your_base58_private_key';
const keypair = Keypair.fromSecretKey(bs58.decode(privateKeyBase58));

// Verify public key matches
console.log('Public Key:', keypair.publicKey.toBase58());
// Use the base58 key directly - no conversion needed!
```

### Option 4: Using Solana CLI

```bash
# Generate new keypair
solana-keygen new -o server-wallet.json

# Get public key
solana-keygen pubkey server-wallet.json

# Get private key in base58 format
solana-keygen pubkey server-wallet.json --outfile /dev/stdout
# Or extract from JSON file
node -e "const fs = require('fs'); const key = JSON.parse(fs.readFileSync('server-wallet.json')); const bs58 = require('bs58'); console.log(bs58.encode(key))"
```

### Option 5: Convert Base58 to Base64 (If Needed)

```typescript
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const privateKeyBase58 = 'your_base58_private_key';
const keypair = Keypair.fromSecretKey(bs58.decode(privateKeyBase58));

// Convert to base64 (if you prefer base64)
const privateKeyBase64 = Buffer.from(keypair.secretKey).toString('base64');
console.log(`SERVER_WALLET_PRIVATE_KEY=${privateKeyBase64}`);
```

## ✅ Security Verification

### How to Verify It's Secure

1. **Check Build Output**
   ```bash
   npm run build
   # Search the .next folder for your private key
   grep -r "SERVER_WALLET_PRIVATE_KEY" .next/
   # Should return nothing (key is not in build)
   ```

2. **Check Client Bundle**
   - Open browser DevTools → Network tab
   - Load the app
   - Check all JavaScript bundles
   - Search for your private key
   - **Should NOT be found** ✅

3. **Check Source Code**
   ```bash
   # Search for any NEXT_PUBLIC_SERVER_WALLET
   grep -r "NEXT_PUBLIC_SERVER_WALLET" .
   # Should return nothing ✅
   ```

4. **Check Git**
   ```bash
   # Verify .env files are ignored
   git status
   # .env.local should NOT appear ✅
   
   # Verify it's in .gitignore
   cat .gitignore | grep env
   # Should show .env*.local ✅
   ```

## 🛡️ Security Best Practices

### ✅ DO:

1. **Use Environment Variables**
   - Store in `.env.local` for local development
   - Store in deployment platform for production

2. **Use Base64 Encoding**
   - Easier to store in environment variables
   - Still secure (just encoding, not encryption)

3. **Restrict API Access** (Future Enhancement)
   - Add authentication to `/api/fees/distribute`
   - Rate limit the endpoint
   - Log all distribution attempts

4. **Use Separate Wallet**
   - Don't use your personal wallet
   - Create dedicated server wallet
   - Fund it only with what's needed

5. **Monitor Wallet Activity**
   - Set up alerts for large transactions
   - Regularly check wallet balance
   - Monitor for unauthorized access

### ❌ DON'T:

1. **Never Commit to Git**
   - ❌ Don't add `.env.local` to git
   - ❌ Don't hardcode in source files
   - ❌ Don't use `NEXT_PUBLIC_` prefix

2. **Never Share**
   - ❌ Don't share in chat/Slack
   - ❌ Don't email the private key
   - ❌ Don't log it to console

3. **Never Expose to Client**
   - ❌ Don't use in client components
   - ❌ Don't include in API responses
   - ❌ Don't send to frontend

## 🔍 Current Implementation Security

### ✅ Secure Aspects

1. **Variable Name**: `SERVER_WALLET_PRIVATE_KEY` (no `NEXT_PUBLIC_`)
2. **Location**: Only in API route (`app/api/fees/distribute/route.ts`)
3. **Access**: Only via `process.env` (server-side)
4. **Storage**: Environment variable (not in code)
5. **Git**: Excluded via `.gitignore`

### ⚠️ Future Enhancements

1. **Add Authentication**
   ```typescript
   // Add API key or JWT authentication
   const apiKey = request.headers.get('x-api-key');
   if (apiKey !== process.env.DISTRIBUTION_API_KEY) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

2. **Add Rate Limiting**
   ```typescript
   // Limit distribution calls
   // Prevent abuse
   ```

3. **Add Audit Logging**
   ```typescript
   // Log all distribution attempts
   // Track who called the API
   ```

## 📋 Setup Checklist

- [ ] Generate or obtain server wallet private key
- [ ] Encode private key to base64
- [ ] Add to `.env.local` (local development)
- [ ] Add to deployment platform (production)
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Test that key is NOT in build output
- [ ] Test that key is NOT in client bundles
- [ ] Fund server wallet with SOL for fees
- [ ] Test distribution on devnet first
- [ ] Monitor wallet activity

## 🚨 If Private Key is Compromised

1. **Immediately**:
   - Transfer all funds from compromised wallet
   - Revoke the private key
   - Generate new wallet

2. **Update**:
   - Update `SERVER_WALLET_PRIVATE_KEY` in all environments
   - Update `SERVER_WALLET_ADDRESS` in code
   - Redeploy application

3. **Investigate**:
   - Check transaction history
   - Review access logs
   - Identify how it was compromised

## 📞 Support

If you have security concerns:
1. Review this document
2. Verify the key is not exposed
3. Test in devnet first
4. Monitor production carefully

---

**Remember**: The private key is **NEVER** exposed to clients because it doesn't have the `NEXT_PUBLIC_` prefix and is only used in server-side API routes.


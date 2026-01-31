# 🔐 Vault Seed Setup Guide

## Overview

The vault seed (`MEMEHAUS_VAULT_SEED`) is a critical security component that determines the addresses of liquidity and community vaults for all tokens created on MemeHaus. It must be kept secure and consistent across all environments.

## 🎯 What is a Vault Seed?

The vault seed is a secret string used to generate deterministic addresses for:
- **Liquidity Vaults**: Hold 70% of each token's supply
- **Community Vaults**: Hold 10% of each token's supply

Each token gets unique vault addresses derived from:
```
seed = MEMEHAUS_VAULT_SEED + ":" + vault_type + ":" + mint_address
```

## ⚠️ Important Security Notes

1. **Never commit the seed to version control** - It should only be in `.env.local` (which is gitignored)
2. **Use the same seed across environments** - Changing the seed will change all vault addresses
3. **Keep a secure backup** - If you lose the seed, you cannot recover vault access
4. **Generate a unique seed** - Don't use the default seed in production

## 🚀 Quick Start

### Step 1: Generate a Secure Seed

Run the seed generator script:

```bash
npm run generate-vault-seed
```

This will output:
- A hex-encoded seed (recommended for production)
- A human-readable seed phrase (alternative)
- Instructions on how to set it up

### Step 2: Set Local Environment Variable

Create or update `.env.local` in the project root:

```bash
# .env.local
MEMEHAUS_VAULT_SEED=your-generated-seed-here
```

**Example:**
```bash
MEMEHAUS_VAULT_SEED=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Step 3: Verify It Works

The application will automatically use the seed from the environment variable. If it's not set, it will fall back to a default seed (with a warning in production).

## 📋 Setup by Environment

### Local Development

1. **Generate seed:**
   ```bash
   npm run generate-vault-seed
   ```

2. **Add to `.env.local`:**
   ```bash
   echo "MEMEHAUS_VAULT_SEED=your-seed-here" >> .env.local
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

### Vercel Deployment

1. **Generate seed** (if you haven't already):
   ```bash
   npm run generate-vault-seed
   ```

2. **Go to Vercel Dashboard:**
   - Navigate to your project
   - Go to **Settings** → **Environment Variables**

3. **Add the variable:**
   - **Name**: `MEMEHAUS_VAULT_SEED`
   - **Value**: Your generated seed
   - **Environment**: Select all (Production, Preview, Development)

4. **Redeploy:**
   - The variable will be available on the next deployment
   - Or trigger a redeploy manually

### Other Platforms

#### Railway
```bash
railway variables set MEMEHAUS_VAULT_SEED=your-seed-here
```

#### Heroku
```bash
heroku config:set MEMEHAUS_VAULT_SEED=your-seed-here
```

#### Docker
```bash
docker run -e MEMEHAUS_VAULT_SEED=your-seed-here your-image
```

#### Kubernetes
```yaml
env:
  - name: MEMEHAUS_VAULT_SEED
    valueFrom:
      secretKeyRef:
        name: memehaus-secrets
        key: vault-seed
```

## 🔍 Verifying the Seed

### Check if Seed is Set

The application will log a warning if the default seed is used in production:

```
⚠️  WARNING: Using default vault seed in production!
   Set MEMEHAUS_VAULT_SEED environment variable for security.
```

### Test Vault Address Generation

You can verify vault addresses are deterministic by checking the same mint address always generates the same vault addresses:

```typescript
import { PDAService } from './app/lib/pdaService';
import { PublicKey } from '@solana/web3.js';

const mintAddress = new PublicKey('YourMintAddressHere');

// These should always be the same for the same mint
const liquidityVault = PDAService.getLiquidityVaultPublicKey(mintAddress);
const communityVault = PDAService.getCommunityVaultPublicKey(mintAddress);

console.log('Liquidity Vault:', liquidityVault.toBase58());
console.log('Community Vault:', communityVault.toBase58());
```

## 🔄 Changing the Seed

**⚠️ WARNING: Changing the seed will change ALL vault addresses!**

If you need to change the seed:

1. **Understand the impact:**
   - All existing vault addresses will change
   - Tokens created with the old seed will have different vault addresses
   - You may lose access to old vaults

2. **Migration strategy:**
   - Only change if absolutely necessary
   - Document the old seed securely
   - Migrate existing tokens if needed
   - Update all environments simultaneously

3. **Best practice:**
   - Generate the seed once
   - Use it consistently across all environments
   - Never change it unless there's a security breach

## 🛡️ Security Best Practices

### ✅ DO:
- Generate a cryptographically secure random seed
- Store it in environment variables only
- Use a password manager for backup
- Keep it consistent across environments
- Rotate if compromised (with migration plan)

### ❌ DON'T:
- Commit the seed to git
- Share it in chat/email
- Use predictable seeds (dates, names, etc.)
- Change it without a migration plan
- Store it in code or config files

## 📝 Example Workflow

### First Time Setup

```bash
# 1. Generate seed
npm run generate-vault-seed

# Output:
# ✅ Hex Seed (Recommended for Production):
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# 2. Add to .env.local
echo "MEMEHAUS_VAULT_SEED=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6" >> .env.local

# 3. Verify .env.local is in .gitignore
grep -q ".env.local" .gitignore || echo ".env.local" >> .gitignore

# 4. Test
npm run dev
```

### Production Deployment

```bash
# 1. Generate seed (if not already done)
npm run generate-vault-seed

# 2. Copy the seed value

# 3. In Vercel Dashboard:
#    - Settings → Environment Variables
#    - Add: MEMEHAUS_VAULT_SEED
#    - Paste seed value
#    - Select all environments
#    - Save

# 4. Redeploy
#    - Or push a commit to trigger auto-deploy
```

## 🐛 Troubleshooting

### Seed Not Working

**Problem:** Vault addresses are different than expected

**Solution:**
1. Check if `MEMEHAUS_VAULT_SEED` is set correctly
2. Verify the seed value matches across environments
3. Check for typos or extra whitespace
4. Restart the application

### Default Seed Warning

**Problem:** Seeing warning about default seed in production

**Solution:**
1. Set `MEMEHAUS_VAULT_SEED` environment variable
2. Restart the application
3. Verify the warning disappears

### Seed Not Found

**Problem:** Application can't find the seed

**Solution:**
1. Check `.env.local` exists and has the variable
2. Verify variable name is exactly `MEMEHAUS_VAULT_SEED`
3. Restart dev server (env vars loaded on startup)
4. For production, check platform-specific env var settings

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Node.js crypto.randomBytes](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback)

## ✅ Checklist

Before deploying to production:

- [ ] Generated a secure random seed
- [ ] Added seed to `.env.local` (local development)
- [ ] Added seed to Vercel/Platform environment variables
- [ ] Verified seed is NOT in version control
- [ ] Tested vault address generation
- [ ] Documented seed backup location (secure)
- [ ] Verified no warnings in production logs

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.


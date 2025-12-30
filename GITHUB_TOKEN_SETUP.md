# How to Get GitHub Token for MemeHaus

## Step-by-Step Guide

### Step 1: Go to GitHub Settings

1. **Log in to GitHub**
   - Go to: https://github.com
   - Make sure you're logged in

2. **Navigate to Developer Settings**
   - Click your profile picture (top right)
   - Click **Settings**
   - Scroll down in the left sidebar
   - Click **Developer settings** (at the bottom)

### Step 2: Create Personal Access Token

1. **Go to Tokens (Classic)**
   - In Developer settings, click **Personal access tokens**
   - Click **Tokens (classic)** (or use Fine-grained tokens if preferred)

2. **Generate New Token**
   - Click **Generate new token**
   - Select **Generate new token (classic)**

3. **Configure Token**
   - **Note**: Give it a descriptive name like "MemeHaus Token"
   - **Expiration**: Choose expiration (90 days, 1 year, or no expiration)
   - **Scopes**: Select these permissions:
     - ✅ **repo** (Full control of private repositories)
       - This includes:
         - `repo:status`
         - `repo_deployment`
         - `public_repo`
         - `repo:invite`
         - `security_events`
     - ✅ **workflow** (if you use GitHub Actions)

4. **Generate Token**
   - Scroll down and click **Generate token**
   - ⚠️ **IMPORTANT**: Copy the token immediately!
   - You won't be able to see it again after you leave this page

### Step 3: Add Token to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Select your MemeHaus project

2. **Navigate to Environment Variables**
   - Go to **Settings** → **Environment Variables**

3. **Add New Variable**
   - Click **Add New**
   - **Key**: `GITHUB_TOKEN`
   - **Value**: Paste your GitHub token (the one you copied)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **Save**

4. **Redeploy**
   - After adding the variable, Vercel will prompt you to redeploy
   - Or manually trigger a redeploy from the Deployments tab

## Alternative: Fine-Grained Personal Access Token

If you prefer more granular permissions:

1. **Go to Developer Settings** → **Personal access tokens** → **Fine-grained tokens**
2. **Generate new token**
3. **Configure**:
   - **Repository access**: Select "Only select repositories"
   - Choose: `memehause/memehause-assets` (or your repo)
   - **Permissions**:
     - **Repository permissions** → **Contents**: Read and write
     - **Repository permissions** → **Metadata**: Read-only
4. **Generate** and copy the token
5. Add to Vercel as `GITHUB_TOKEN`

## Verify Token Works

After adding to Vercel and redeploying:

1. **Test the API endpoint**:
   ```bash
   curl https://memehaus.vercel.app/api/github/test-connection
   ```

2. **Expected response**:
   ```json
   {
     "success": true,
     "connected": true
   }
   ```

3. **If it fails**, check:
   - Token is correctly set in Vercel
   - Token has `repo` permissions
   - Repository name matches (`memehause/memehause-assets`)
   - Vercel has redeployed with new environment variable

## Security Notes

- ⚠️ **Never commit the token to git**
- ⚠️ **Never share the token publicly**
- ⚠️ **Store it only in Vercel environment variables**
- ✅ **Use environment-specific tokens if possible**
- ✅ **Set expiration dates for security**
- ✅ **Revoke old tokens if compromised**

## Troubleshooting

### Token Not Working?

1. **Check token permissions**:
   - Must have `repo` scope
   - Must have access to the repository

2. **Check repository name**:
   - Verify `GITHUB_OWNER` and `GITHUB_REPO` in Vercel
   - Default: `memehause/memehause-assets`

3. **Check token format**:
   - Should start with `ghp_` (classic) or `github_pat_` (fine-grained)
   - No extra spaces or characters

4. **Verify Vercel deployment**:
   - Environment variable must be set
   - Project must be redeployed after adding variable

## Quick Reference

- **GitHub Settings**: https://github.com/settings/tokens
- **Vercel Environment Variables**: Project Settings → Environment Variables
- **Token Format**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (classic)

---

**Once set up, your GitHub storage will work seamlessly!** 🚀


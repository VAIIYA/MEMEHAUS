# Test GitHub Token After Setup

## Quick Test

After adding `GITHUB_TOKEN` to Vercel and redeploying, test it:

### Option 1: Browser Test
Visit: `https://memehaus.vercel.app/api/github/test-connection`

Should return:
```json
{
  "success": true,
  "connected": true
}
```

### Option 2: Command Line
```bash
curl https://memehaus.vercel.app/api/github/test-connection
```

### Option 3: Test Token Creation
1. Go to: https://memehaus.vercel.app/create
2. Try creating a token
3. Check browser console - should NOT see "GitHub token not configured" error
4. Should see: "✅ GitHub connection successful"

## What to Check

✅ **Token Format**: Your token starts with `github_pat_` (fine-grained token) - this is correct!

✅ **Permissions**: Make sure your token has:
- Repository access to `memehause/memehause-assets`
- **Contents**: Read and write permission
- **Metadata**: Read permission

✅ **Environment**: Token should be set for all environments (Production, Preview, Development)

## If It Doesn't Work

1. **Check Token Permissions**:
   - Go to: https://github.com/settings/tokens
   - Find your token
   - Verify it has access to the repository
   - Verify it has Contents: Read and write

2. **Check Repository Name**:
   - Verify in Vercel: `GITHUB_OWNER=memehause` and `GITHUB_REPO=memehause-assets`
   - Or check your actual repository name

3. **Redeploy**:
   - Make sure you redeployed after adding the token
   - Environment variables only take effect after redeploy

4. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → View Function Logs
   - Look for any GitHub-related errors

## Success Indicators

When it's working, you should see:
- ✅ No "GitHub token not configured" errors
- ✅ Token creation succeeds
- ✅ Images upload to GitHub
- ✅ Metadata uploads to GitHub
- ✅ Creator list updates in GitHub


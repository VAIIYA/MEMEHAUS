# GitHub Token Runtime Fix

## Issue
Even though `GITHUB_TOKEN` was set in Vercel environment variables, the code was still showing "GitHub token not configured" errors.

## Root Cause
The code was reading `process.env.GITHUB_TOKEN` at **module load time** (when the file is first imported), not at **runtime** (when the function is called). This can cause issues in Next.js where:

1. Module-level constants are evaluated once when the module is first loaded
2. Environment variables might not be available at that time
3. The module might be cached with `undefined` values

## Solution
Changed the code to read environment variables at **runtime** instead of module load time:

### Before (Module Load Time):
```typescript
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Read once at module load
const octokit = new Octokit({ auth: GITHUB_TOKEN }); // Created once
```

### After (Runtime):
```typescript
function getGitHubConfig() {
  return {
    token: process.env.GITHUB_TOKEN, // Read fresh each time
    owner: process.env.GITHUB_OWNER || 'memehause',
    repo: process.env.GITHUB_REPO || 'memehause-assets',
    branch: process.env.GITHUB_BRANCH || 'main',
  };
}

function getOctokit() {
  const config = getGitHubConfig();
  return new Octokit({ auth: config.token }); // Created fresh each time
}
```

## Changes Made

### File: `app/lib/githubOnlyStorage.ts`

1. **Added runtime config functions**:
   - `getGitHubConfig()` - Reads env vars at runtime
   - `getOctokit()` - Creates fresh Octokit instance

2. **Updated all functions** to use runtime config:
   - `storeTokenData()` - ✅ Updated
   - `uploadTokenImage()` - ✅ Updated
   - `uploadTokenMetadata()` - ✅ Updated
   - `getTokenData()` - ✅ Updated
   - `listTokens()` - ✅ Updated
   - `getCreatorList()` - ✅ Updated
   - `addCreatorToList()` - ✅ Updated
   - `testGitHubConnection()` - ✅ Updated
   - `getGitHubRepoInfo()` - ✅ Updated

3. **Added debug logging** in `storeTokenData()`:
   - Logs config values (without exposing token)
   - Logs whether token is present
   - Lists available GitHub-related env vars

## Important: Vercel Redeploy Required

**After adding or updating environment variables in Vercel, you MUST redeploy for the changes to take effect.**

### How to Redeploy:

1. **Automatic Redeploy**:
   - Vercel usually prompts you to redeploy after adding env vars
   - Click "Redeploy" if prompted

2. **Manual Redeploy**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click the "..." menu on the latest deployment
   - Select "Redeploy"

3. **Trigger via Git**:
   - Make a small change and push to trigger a new deployment
   - Or use Vercel CLI: `vercel --prod`

## Testing

After redeploying, test the GitHub storage:

1. **Create a test token** on your production site
2. **Check the console logs** - you should see:
   ```
   📋 GitHub config: owner=memehause, repo=memehause-assets, branch=main
   🔑 GitHub token present: YES
   ✅ Token data stored in GitHub: [URL]
   ```

3. **If you still see errors**, check:
   - Vercel environment variables are set correctly
   - Token has the right permissions (repo scope)
   - Repository exists and is accessible
   - Redeploy was completed

## Debugging

If the token is still not working after redeploy:

1. **Check Vercel Environment Variables**:
   - Go to Settings → Environment Variables
   - Verify `GITHUB_TOKEN` is set
   - Check it's enabled for the right environments (Production, Preview, Development)

2. **Check Server Logs**:
   - Look for the debug logs we added
   - Should show: `🔑 GitHub token present: YES` or `NO`

3. **Test API Route Directly**:
   ```bash
   curl -X POST https://your-site.vercel.app/api/github/store-token \
     -H "Content-Type: application/json" \
     -d '{"tokenData": {...}}'
   ```

4. **Verify Token Permissions**:
   - Token needs `repo` scope
   - Token should have access to the repository

## Benefits

1. **Fresh Environment Variables**: Reads env vars fresh each time
2. **No Caching Issues**: Avoids module-level caching problems
3. **Better Debugging**: Added logging to help diagnose issues
4. **More Reliable**: Works correctly in Next.js server-side contexts

## Related Files

- `app/lib/githubOnlyStorage.ts` - Main storage functions (updated)
- `app/api/github/store-token/route.ts` - API route (uses updated functions)
- `app/api/github/add-creator/route.ts` - API route (uses updated functions)
- `app/api/github/get-creators/route.ts` - API route (uses updated functions)

## Next Steps

1. ✅ Code updated to read env vars at runtime
2. ⚠️ **Redeploy on Vercel** (required!)
3. Test token creation
4. Verify GitHub storage works
5. Check server logs for debug info

---

**Note**: The token you provided (`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`) looks valid. After redeploying, it should work correctly.

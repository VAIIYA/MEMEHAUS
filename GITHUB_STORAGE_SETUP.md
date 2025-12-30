# GitHub Storage Setup Guide

This guide will help you set up GitHub storage for MemeHaus token metadata and images.

## Prerequisites

1. A GitHub account
2. A GitHub Personal Access Token with repository permissions
3. A GitHub repository to store assets

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `memehause-assets` (or any name you prefer)
3. Make it **public** so assets can be accessed via raw URLs
4. Initialize with a README

## Step 2: Create a Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "MemeHaus Storage"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `public_repo` (Access public repositories)
5. Click "Generate token"
6. **Copy the token immediately** - you won't be able to see it again

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Required
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_NETWORK=mainnet-beta

# GitHub Storage (Required for token creation)
GITHUB_TOKEN=your_github_token_here
GITHUB_OWNER=your_github_username
GITHUB_REPO=memehause-assets
GITHUB_BRANCH=main

# Optional - Lighthouse.storage for additional redundancy
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=your_lighthouse_key_here
```

## Step 4: Test the Setup

Run the GitHub storage test script:

```bash
node test-github-storage.js
```

You should see:
- ✅ GitHub connection successful
- Repository information displayed
- 🎉 GitHub storage is properly configured and working!

## Step 5: Repository Structure

The GitHub repository will automatically create the following structure:

```
memehause-assets/
├── images/           # Token images
├── metadata/         # Token metadata JSON files
├── tokens/          # Token data records
└── README.md
```

## Troubleshooting

### Connection Failed
- Verify your GitHub token is correct
- Check that the repository exists and is public
- Ensure your token has the correct permissions

### Permission Denied
- Make sure your token has `repo` and `public_repo` scopes
- Verify you have write access to the repository

### Repository Not Found
- Check the `GITHUB_OWNER` and `GITHUB_REPO` variables
- Ensure the repository name matches exactly

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your GitHub token secure
- Consider using GitHub's fine-grained personal access tokens for better security
- Regularly rotate your tokens

## Production Deployment

For production deployment (Vercel, Netlify, etc.):

1. Add the environment variables to your deployment platform
2. Use the same GitHub repository or create a production-specific one
3. Consider using GitHub's organization-level tokens for better security

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test the GitHub connection using the test script
4. Check GitHub's API status page for any outages
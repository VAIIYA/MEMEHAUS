#!/usr/bin/env node

/**
 * GitHub Storage Connection Test
 * Tests the GitHub storage functionality for MemeHaus
 */

const { testGitHubConnection, getGitHubRepoInfo } = require('./app/lib/githubStorageBridge');

async function testGitHubStorage() {
  console.log('🧪 Testing GitHub Storage Connection...\n');
  
  try {
    // Test basic connection
    console.log('1. Testing GitHub connection...');
    const connected = await testGitHubConnection();
    
    if (connected) {
      console.log('✅ GitHub connection successful\n');
      
      // Get repository info
      console.log('2. Getting repository information...');
      const repoInfo = await getGitHubRepoInfo();
      
      if (repoInfo) {
        console.log('✅ Repository information retrieved:');
        console.log(`   Name: ${repoInfo.name}`);
        console.log(`   Full Name: ${repoInfo.fullName}`);
        console.log(`   Description: ${repoInfo.description || 'No description'}`);
        console.log(`   URL: ${repoInfo.url}`);
        console.log(`   Default Branch: ${repoInfo.defaultBranch}`);
        console.log(`   Private: ${repoInfo.private}`);
        console.log(`   Size: ${repoInfo.size} KB`);
        console.log(`   Stars: ${repoInfo.stars}`);
        console.log(`   Forks: ${repoInfo.forks}\n`);
      } else {
        console.log('❌ Failed to get repository information\n');
      }
      
      console.log('🎉 GitHub storage is properly configured and working!');
      
    } else {
      console.log('❌ GitHub connection failed');
      console.log('\nTroubleshooting steps:');
      console.log('1. Check if GITHUB_TOKEN is set in your environment');
      console.log('2. Verify the token has the correct permissions');
      console.log('3. Ensure the repository exists and is accessible');
      console.log('4. Check your network connection');
    }
    
  } catch (error) {
    console.error('❌ Error testing GitHub storage:', error);
    console.log('\nCommon issues:');
    console.log('1. Missing GITHUB_TOKEN environment variable');
    console.log('2. Invalid GitHub token');
    console.log('3. Repository not found or inaccessible');
    console.log('4. Network connectivity issues');
  }
}

// Run the test
testGitHubStorage().catch(console.error);
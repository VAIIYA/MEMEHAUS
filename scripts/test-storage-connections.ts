/**
 * Test script to verify storage connections
 * Tests MongoDB and GitHub connections (Supabase removed)
 * 
 * Usage:
 *   npm run test:storage
 *   or
 *   tsx scripts/test-storage-connections.ts
 */

async function testMongoDB() {
  console.log('\n📊 Testing MongoDB Connection...');
  try {
    const { testMongoDBConnection } = await import('../app/lib/mongodbStorage');
    const isConnected = await testMongoDBConnection();
    
    if (isConnected) {
      console.log('✅ MongoDB: Connected');
      return true;
    } else {
      console.log('❌ MongoDB: Not connected');
      console.log('   Check: MONGODB_URI environment variable');
      return false;
    }
  } catch (error) {
    console.error('❌ MongoDB: Error testing connection:', error);
    return false;
  }
}

// Supabase test removed - using MongoDB only

async function testGitHub() {
  console.log('\n📊 Testing GitHub Connection...');
  try {
    const { testGitHubConnection } = await import('../app/lib/githubOnlyStorage');
    const isConnected = await testGitHubConnection();
    
    if (isConnected) {
      console.log('✅ GitHub: Connected');
      return true;
    } else {
      console.log('❌ GitHub: Not connected');
      console.log('   Check: GITHUB_TOKEN environment variable');
      return false;
    }
  } catch (error) {
    console.error('❌ GitHub: Error testing connection:', error);
    return false;
  }
}

async function checkEnvironmentVariables() {
  console.log('\n🔍 Checking Environment Variables...');
  
  const vars = {
    'MONGODB_URI': process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
    'GITHUB_TOKEN': process.env.GITHUB_TOKEN ? '✅ Set' : '❌ Missing',
  };
  
  // Check for Vercel-specific variable names
  const vercelVars = {
    'DATABASE_URL': process.env.DATABASE_URL ? '✅ Set (might be MongoDB)' : '❌ Missing',
  };
  
  console.log('\nStandard Variables:');
  Object.entries(vars).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
  
  console.log('\nVercel Integration Variables:');
  Object.entries(vercelVars).forEach(([key, value]) => {
    console.log(`   ${key}: ${value}`);
  });
}

async function runTests() {
  console.log('🚀 Testing Storage Connections\n');
  console.log('=' .repeat(50));
  
  // Check environment variables first
  await checkEnvironmentVariables();
  
  // Test connections
  const results = {
    mongodb: await testMongoDB(),
    github: await testGitHub(),
  };
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 Summary:');
  console.log(`   MongoDB: ${results.mongodb ? '✅ Connected' : '❌ Not Connected'}`);
  console.log(`   GitHub: ${results.github ? '✅ Connected' : '❌ Not Connected'}`);
  
  const allConnected = results.mongodb && results.github;
  
  if (allConnected) {
    console.log('\n✅ All storage systems connected!');
  } else {
    console.log('\n⚠️ Some storage systems are not connected.');
    console.log('   MongoDB is required for token storage.');
    console.log('   If using Vercel integrations, variables may be set automatically.');
    console.log('   Check Vercel dashboard → Project Settings → Environment Variables');
  }
  
  return results;
}

// Run tests
runTests().catch(console.error);


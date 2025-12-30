/**
 * Test script for fee distribution API
 * 
 * Usage:
 *   npm run test:fee-distribution
 *   or
 *   ts-node scripts/test-fee-distribution-api.ts
 * 
 * Make sure to set the following environment variables:
 *   - NEXT_PUBLIC_SOLANA_RPC_URL
 *   - SERVER_WALLET_PRIVATE_KEY (for server-side testing)
 */

import fetch from 'node-fetch';

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const TEST_TOKEN_MINT = process.env.TEST_TOKEN_MINT || '';
const EXCLUDE_WALLET = process.env.EXCLUDE_WALLET || '';

/**
 * Test GET endpoint - Check creator list
 */
async function testGetCreatorList(tokenMint: string) {
  console.log('\n📋 Testing GET /api/fees/distribute');
  console.log(`   Token Mint: ${tokenMint}`);
  
  try {
    const url = `${API_BASE_URL}/api/fees/distribute?tokenMint=${tokenMint}`;
    console.log(`   URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ GET request successful!');
      console.log(`   Total Creators: ${data.totalCreators}`);
      console.log(`   Creators: ${data.creators.join(', ')}`);
      console.log(`   Last Updated: ${data.lastUpdated || 'N/A'}`);
      return data;
    } else {
      console.error('❌ GET request failed:');
      console.error(`   Error: ${data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error making GET request:', error);
    return null;
  }
}

/**
 * Test POST endpoint - Distribute fees
 */
async function testPostDistribution(tokenMint: string, excludeWallet?: string) {
  console.log('\n💰 Testing POST /api/fees/distribute');
  console.log(`   Token Mint: ${tokenMint}`);
  if (excludeWallet) {
    console.log(`   Exclude Wallet: ${excludeWallet}`);
  }
  
  try {
    const url = `${API_BASE_URL}/api/fees/distribute`;
    const body = {
      tokenMint,
      ...(excludeWallet && { excludeWallet })
    };
    
    console.log(`   URL: ${url}`);
    console.log(`   Body:`, JSON.stringify(body, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ POST request successful!');
      console.log(`   Message: ${data.message}`);
      console.log(`   Total Recipients: ${data.totalRecipients}`);
      console.log(`   Total Amount: ${data.totalAmount}`);
      
      if (data.distributions && data.distributions.length > 0) {
        console.log(`\n   Distribution Batches:`);
        data.distributions.forEach((dist: any, idx: number) => {
          console.log(`   Batch ${idx + 1}:`);
          console.log(`     Transaction: ${dist.transactionSignature}`);
          console.log(`     Recipients: ${dist.recipients.length}`);
          console.log(`     Amount per recipient: ${dist.amountPerRecipient}`);
          console.log(`     Total amount: ${dist.totalAmount}`);
          console.log(`     View on explorer: https://solscan.io/tx/${dist.transactionSignature}`);
        });
      }
      
      return data;
    } else {
      console.error('❌ POST request failed:');
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error making POST request:', error);
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`);
    }
    return null;
  }
}

/**
 * Test error cases
 */
async function testErrorCases() {
  console.log('\n🧪 Testing Error Cases');
  
  // Test 1: Missing tokenMint
  console.log('\n   1. Testing missing tokenMint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/fees/distribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    if (!data.success && data.error?.includes('tokenMint')) {
      console.log('   ✅ Correctly rejected missing tokenMint');
    } else {
      console.log('   ⚠️ Unexpected response:', data);
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
  }
  
  // Test 2: Invalid tokenMint format
  console.log('\n   2. Testing invalid tokenMint format...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/fees/distribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenMint: 'invalid-address' }),
    });
    const data = await response.json();
    if (!data.success) {
      console.log('   ✅ Correctly rejected invalid tokenMint');
    } else {
      console.log('   ⚠️ Unexpected success:', data);
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
  }
  
  // Test 3: GET without tokenMint
  console.log('\n   3. Testing GET without tokenMint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/fees/distribute`);
    const data = await response.json();
    if (!data.success && data.error?.includes('tokenMint')) {
      console.log('   ✅ Correctly rejected missing tokenMint');
    } else {
      console.log('   ⚠️ Unexpected response:', data);
    }
  } catch (error) {
    console.log('   ❌ Error:', error);
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🚀 Starting Fee Distribution API Tests');
  console.log(`   API Base URL: ${API_BASE_URL}`);
  console.log(`   Test Token Mint: ${TEST_TOKEN_MINT || 'NOT SET'}`);
  console.log(`   Exclude Wallet: ${EXCLUDE_WALLET || 'NOT SET'}`);
  
  if (!TEST_TOKEN_MINT) {
    console.error('\n❌ TEST_TOKEN_MINT environment variable is required');
    console.log('\nUsage:');
    console.log('  TEST_TOKEN_MINT=<token_mint> npm run test:fee-distribution');
    console.log('  or');
    console.log('  TEST_TOKEN_MINT=<token_mint> EXCLUDE_WALLET=<wallet> npm run test:fee-distribution');
    process.exit(1);
  }
  
  // Test 1: GET creator list
  const creatorList = await testGetCreatorList(TEST_TOKEN_MINT);
  
  // Test 2: POST distribution (only if there are creators)
  if (creatorList && creatorList.totalCreators > 0) {
    console.log(`\n   Found ${creatorList.totalCreators} creators. Proceeding with distribution test...`);
    await testPostDistribution(TEST_TOKEN_MINT, EXCLUDE_WALLET || undefined);
  } else {
    console.log('\n   ⚠️ No creators found. Skipping distribution test.');
    console.log('   Create a token first to add creators to the list.');
  }
  
  // Test 3: Error cases
  await testErrorCases();
  
  console.log('\n✅ Tests completed!');
}

// Run tests
runTests().catch(console.error);



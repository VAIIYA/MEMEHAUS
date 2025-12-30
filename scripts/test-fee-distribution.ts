/**
 * Test script for fee distribution system
 * 
 * Usage:
 *   npx tsx scripts/test-fee-distribution.ts
 * 
 * This script helps verify:
 * 1. Server wallet private key is configured
 * 2. Creator list system works
 * 3. Fee distribution API is accessible
 */

import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Test configuration
const SERVER_WALLET_PRIVATE_KEY = process.env.SERVER_WALLET_PRIVATE_KEY;
const SERVER_WALLET_ADDRESS = '7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e';
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

async function testServerWalletKey() {
  console.log('🧪 Testing Server Wallet Private Key...\n');
  
  if (!SERVER_WALLET_PRIVATE_KEY) {
    console.error('❌ SERVER_WALLET_PRIVATE_KEY is not set in environment variables');
    console.log('   Set it in .env.local or Vercel environment variables');
    return false;
  }
  
  console.log('✅ SERVER_WALLET_PRIVATE_KEY is set');
  
  try {
    // Try to load keypair
    let keypair: Keypair;
    try {
      // Try base58 first
      const privateKeyBytes = bs58.decode(SERVER_WALLET_PRIVATE_KEY);
      keypair = Keypair.fromSecretKey(privateKeyBytes);
      console.log('✅ Private key loaded (base58 format)');
    } catch (base58Error) {
      // Try base64
      try {
        const privateKeyBytes = Buffer.from(SERVER_WALLET_PRIVATE_KEY, 'base64');
        keypair = Keypair.fromSecretKey(privateKeyBytes);
        console.log('✅ Private key loaded (base64 format)');
      } catch (base64Error) {
        console.error('❌ Failed to decode private key (tried base58 and base64)');
        return false;
      }
    }
    
    // Verify public key matches
    const expectedPublicKey = new PublicKey(SERVER_WALLET_ADDRESS);
    if (!keypair.publicKey.equals(expectedPublicKey)) {
      console.error('❌ Private key does not match expected server wallet address');
      console.log(`   Expected: ${SERVER_WALLET_ADDRESS}`);
      console.log(`   Got: ${keypair.publicKey.toBase58()}`);
      return false;
    }
    
    console.log('✅ Private key matches server wallet address');
    
    // Check wallet balance
    const connection = new Connection(RPC_URL, 'confirmed');
    const balance = await connection.getBalance(keypair.publicKey);
    const balanceSOL = balance / 1e9;
    
    console.log(`✅ Server wallet balance: ${balanceSOL} SOL`);
    
    if (balanceSOL < 0.1) {
      console.warn('⚠️  Warning: Server wallet has low balance (< 0.1 SOL)');
      console.warn('   You may need more SOL for transaction fees');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing server wallet:', error);
    return false;
  }
}

async function testCreatorList() {
  console.log('\n🧪 Testing Creator List System...\n');
  
  try {
    const { getCreatorList } = await import('../app/lib/githubOnlyStorage');
    const creatorList = await getCreatorList();
    
    console.log('✅ Creator list retrieved from GitHub');
    console.log(`   Total creators: ${creatorList.totalCreators}`);
    console.log(`   Last updated: ${creatorList.lastUpdated || 'Never'}`);
    
    if (creatorList.creators.length > 0) {
      console.log('   Creators:');
      creatorList.creators.slice(0, 5).forEach((addr, idx) => {
        console.log(`     ${idx + 1}. ${addr}`);
      });
      if (creatorList.creators.length > 5) {
        console.log(`     ... and ${creatorList.creators.length - 5} more`);
      }
    } else {
      console.log('   ℹ️  No creators yet (list will be created on first token creation)');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing creator list:', error);
    return false;
  }
}

async function testDistributionAPI() {
  console.log('\n🧪 Testing Fee Distribution API...\n');
  
  // This would require the API to be running
  // For now, just check if the endpoint file exists
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const apiPath = path.join(process.cwd(), 'app', 'api', 'fees', 'distribute', 'route.ts');
    
    if (fs.existsSync(apiPath)) {
      console.log('✅ Distribution API endpoint exists');
      console.log('   Endpoint: POST /api/fees/distribute');
      console.log('   To test: Deploy to Vercel and call the endpoint');
      return true;
    } else {
      console.error('❌ Distribution API endpoint not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking API endpoint:', error);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Fee Distribution System Test\n');
  console.log('=' .repeat(50));
  
  const results = {
    serverWallet: false,
    creatorList: false,
    distributionAPI: false,
  };
  
  results.serverWallet = await testServerWalletKey();
  results.creatorList = await testCreatorList();
  results.distributionAPI = await testDistributionAPI();
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results:\n');
  console.log(`   Server Wallet: ${results.serverWallet ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Creator List: ${results.creatorList ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Distribution API: ${results.distributionAPI ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! System is ready.');
    console.log('\n📋 Next Steps:');
    console.log('   1. Deploy to Vercel with SERVER_WALLET_PRIVATE_KEY set');
    console.log('   2. Create a test token on devnet');
    console.log('   3. Test fee distribution via API');
    console.log('   4. Verify transactions on Solana explorer');
  } else {
    console.log('\n⚠️  Some tests failed. Please fix the issues above.');
  }
}

// Run tests
runTests().catch(console.error);


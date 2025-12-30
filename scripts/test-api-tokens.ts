/**
 * Test script to check if the API returns tokens from MongoDB
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });
dotenv.config();

import { listTokensFromMongoDB } from '../app/lib/mongodbStorage';

async function testAPI() {
  try {
    console.log('🧪 Testing MongoDB token retrieval...\n');
    
    // Test direct MongoDB call
    console.log('1. Direct MongoDB call:');
    const tokens = await listTokensFromMongoDB(100);
    console.log(`   Found ${tokens.length} tokens in MongoDB`);
    
    if (tokens.length > 0) {
      console.log('\n   Tokens:');
      tokens.forEach((token, i) => {
        console.log(`   ${i + 1}. ${token.name} (${token.symbol})`);
        console.log(`      Mint: ${token.mintAddress}`);
        console.log(`      Supply: ${token.totalSupply}`);
        console.log(`      Created: ${token.createdAt}`);
        console.log('');
      });
    } else {
      console.log('   ⚠️  No tokens found in MongoDB!');
    }
    
    // Test API endpoint (if server is running)
    console.log('\n2. Testing API endpoint:');
    try {
      const response = await fetch('http://localhost:3000/api/tokens?page=0&limit=10');
      const data = await response.json();
      
      console.log(`   API Response: success=${data.success}`);
      console.log(`   Tokens returned: ${data.tokens?.length || 0}`);
      console.log(`   Source: ${data.source || 'unknown'}`);
      console.log(`   Stats: ${JSON.stringify(data.stats)}`);
      
      if (data.tokens && data.tokens.length > 0) {
        console.log('\n   API Tokens:');
        data.tokens.forEach((token: any, i: number) => {
          console.log(`   ${i + 1}. ${token.name} (${token.symbol})`);
          console.log(`      Mint: ${token.mintAddress || token.mint_address}`);
        });
      }
    } catch (apiError) {
      console.log('   ⚠️  API test failed (server might not be running):', apiError);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testAPI();

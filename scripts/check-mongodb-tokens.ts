/**
 * Quick script to check what tokens are in MongoDB
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });
dotenv.config();

import { listTokensFromMongoDB } from '../app/lib/mongodbStorage';

async function checkTokens() {
  try {
    console.log('📊 Checking tokens in MongoDB...\n');
    
    const tokens = await listTokensFromMongoDB(100);
    
    if (tokens.length === 0) {
      console.log('❌ No tokens found in MongoDB');
      return;
    }
    
    console.log(`✅ Found ${tokens.length} token(s) in MongoDB:\n`);
    
    tokens.forEach((token, index) => {
      console.log(`${index + 1}. ${token.name} (${token.symbol})`);
      console.log(`   Mint: ${token.mintAddress}`);
      console.log(`   Supply: ${token.totalSupply}`);
      console.log(`   Creator: ${token.creatorWallet || 'Unknown'}`);
      console.log(`   Created: ${token.createdAt}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkTokens();

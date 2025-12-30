/**
 * List all tokens in MongoDB
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });
dotenv.config();

import { listTokensFromMongoDB } from '../app/lib/mongodbStorage';

async function listTokens() {
  try {
    console.log('📊 Fetching tokens from MongoDB...\n');
    
    const tokens = await listTokensFromMongoDB(100);
    
    if (tokens.length === 0) {
      console.log('❌ No tokens found in MongoDB');
      return;
    }
    
    console.log(`✅ Found ${tokens.length} token(s) in MongoDB:\n`);
    console.log('═══════════════════════════════════════════════════════\n');
    
    tokens.forEach((token, index) => {
      console.log(`${index + 1}. ${token.name} (${token.symbol})`);
      console.log(`   Mint Address: ${token.mintAddress}`);
      console.log(`   Total Supply: ${token.totalSupply}`);
      console.log(`   Creator Wallet: ${token.creatorWallet || 'Unknown'}`);
      console.log(`   Decimals: ${token.decimals}`);
      console.log(`   Image URL: ${token.imageUrl || 'None'}`);
      console.log(`   Metadata URI: ${token.metadataUri || 'None'}`);
      console.log(`   Created: ${token.createdAt}`);
      console.log('');
    });
    
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\n✅ These tokens should appear on your frontpage!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listTokens();

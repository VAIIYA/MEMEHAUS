/**
 * Update token names in MongoDB with known token information
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });
dotenv.config();

import { MongoClient } from 'mongodb';

// Known token information
const KNOWN_TOKENS: Record<string, { name: string; symbol: string }> = {
  '8GRqqRPcTGfQVXRuuFgt9uqowEdwRnLyZE6gogFpA8xb': { 
    name: 'MemeHaus', 
    symbol: 'MEMEHAUS' 
  },
  'E5tfCyfYvaY7i9FzoDrfwtMfc9Ve9oGyfgmLmPV3A13X': { 
    name: 'MEMEDOGE', 
    symbol: 'MEMEDOGE' 
  },
};

async function updateTokenNames() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not set in .env.local');
    process.exit(1);
  }

  let client: MongoClient | null = null;

  try {
    console.log('🔄 Connecting to MongoDB...');
    client = new MongoClient(mongoUri);
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db('memehaus');
    const tokensCollection = db.collection('tokens');

    console.log('📝 Updating token names...\n');

    for (const [mintAddress, tokenInfo] of Object.entries(KNOWN_TOKENS)) {
      try {
        const result = await tokensCollection.updateOne(
          { mint_address: mintAddress },
          {
            $set: {
              name: tokenInfo.name,
              symbol: tokenInfo.symbol,
              updated_at: new Date(),
            },
          }
        );

        if (result.matchedCount > 0) {
          if (result.modifiedCount > 0) {
            console.log(`✅ Updated: ${tokenInfo.name} (${tokenInfo.symbol})`);
          } else {
            console.log(`ℹ️  Already correct: ${tokenInfo.name} (${tokenInfo.symbol})`);
          }
        } else {
          console.log(`⚠️  Token not found: ${mintAddress}`);
        }
      } catch (error) {
        console.error(`❌ Error updating ${mintAddress}:`, error);
      }
    }

    console.log('\n✅ Update complete!');
    console.log('🎉 Your tokens should now show correct names on the frontpage!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Disconnected from MongoDB');
    }
  }
}

updateTokenNames();

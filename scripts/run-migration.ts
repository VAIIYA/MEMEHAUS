/**
 * Standalone migration script to migrate tokens from GitHub to MongoDB
 * This can run directly without needing the Next.js server
 * 
 * Usage: npx tsx scripts/run-migration.ts
 */

// Load environment variables
import * as dotenv from 'dotenv';
import * as path from 'path';

// Try to load .env.local first, then .env
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });
dotenv.config(); // Also try .env

// Log which env vars are loaded (without values)
console.log('Environment check:');
console.log('  GITHUB_TOKEN:', process.env.GITHUB_TOKEN ? '✅ Set' : '❌ Not set');
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('');

import { listTokens } from '../app/lib/githubOnlyStorage';
import { storeTokenDataInMongoDB, storeCreatorWalletInMongoDB, listTokensFromMongoDB } from '../app/lib/mongodbStorage';

async function migrateTokens() {
  try {
    console.log('🔄 Starting migration from GitHub to MongoDB...');
    console.log('');
    
    // First, check what's already in MongoDB
    console.log('📊 Checking existing tokens in MongoDB...');
    const existingMongoTokens = await listTokensFromMongoDB(1000);
    console.log(`   Found ${existingMongoTokens.length} tokens already in MongoDB`);
    console.log('');
    
    // Fetch all tokens from GitHub
    console.log('📥 Fetching tokens from GitHub...');
    let githubTokens;
    try {
      githubTokens = await listTokens(1000); // Get up to 1000 tokens
    } catch (error) {
      if (error instanceof Error && error.message.includes('GitHub token not configured')) {
        console.error('❌ GitHub token not configured. Please set GITHUB_TOKEN in your .env.local file.');
        console.error('');
        console.error('If you don\'t have tokens in GitHub, but they should be in MongoDB,');
        console.error('the migration may have already completed, or tokens are stored elsewhere.');
        return;
      }
      throw error;
    }
    
    if (!githubTokens || githubTokens.length === 0) {
      console.log('✅ No tokens found in GitHub to migrate');
      return;
    }
    
    console.log(`📦 Found ${githubTokens.length} tokens in GitHub`);
    console.log('');
    
    const results = {
      migrated: 0,
      skipped: 0,
      errors: [] as Array<{ token: string; error: string }>,
      creators: 0
    };
    
    // Migrate each token to MongoDB
    for (let i = 0; i < githubTokens.length; i++) {
      const token = githubTokens[i];
      const progress = `[${i + 1}/${githubTokens.length}]`;
      
      try {
        // Store token data in MongoDB
        const tokenResult = await storeTokenDataInMongoDB(token);
        
        if (tokenResult.success) {
          results.migrated++;
          console.log(`✅ ${progress} Migrated token: ${token.symbol} (${token.mintAddress})`);
          
          // Also store creator wallet if available
          if (token.creatorWallet) {
            try {
              const creatorResult = await storeCreatorWalletInMongoDB(
                token.creatorWallet,
                token.mintAddress
              );
              
              if (creatorResult.success) {
                results.creators++;
              }
            } catch (creatorError) {
              // Don't fail the migration for creator storage errors
              console.warn(`   ⚠️  Failed to store creator wallet: ${creatorError instanceof Error ? creatorError.message : 'Unknown error'}`);
            }
          }
        } else {
          results.skipped++;
          results.errors.push({
            token: token.symbol || token.mintAddress,
            error: tokenResult.error || 'Unknown error'
          });
          console.warn(`⚠️  ${progress} Failed to migrate token ${token.symbol}: ${tokenResult.error}`);
        }
      } catch (error) {
        results.skipped++;
        results.errors.push({
          token: token.symbol || token.mintAddress || 'unknown',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`❌ ${progress} Error migrating token ${token.symbol}:`, error);
      }
    }
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Migration complete!');
    console.log(`   Total tokens in GitHub: ${githubTokens.length}`);
    console.log(`   ✅ Migrated: ${results.migrated}`);
    console.log(`   ⚠️  Skipped: ${results.skipped}`);
    console.log(`   👥 Creators stored: ${results.creators}`);
    console.log('═══════════════════════════════════════════════════════');
    
    if (results.errors.length > 0) {
      console.log('');
      console.log(`⚠️  ${results.errors.length} errors occurred:`);
      results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.token}: ${error.error}`);
      });
    }
    
    if (results.migrated > 0) {
      console.log('');
      console.log('🎉 Success! Your tokens should now appear on the frontpage.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateTokens().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

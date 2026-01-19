/**
 * Standalone migration script to migrate tokens from GitHub to MongoDB
 * This is now retired as MongoDB is the primary storage.
 * 
 * Usage: npx tsx scripts/run-migration.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Try to load .env.local first, then .env
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });
dotenv.config();

async function migrateTokens() {
  console.log('🔄 Migration from GitHub is now retired. Manual migration only.');
  console.log('MongoDB is now the primary storage for MemeHaus.');
}

// Run the migration
migrateTokens().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

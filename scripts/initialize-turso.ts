/**
 * Initialize Turso Database Schema
 * Run this once after setting up Turso environment variables
 * 
 * Usage:
 *   npx tsx scripts/initialize-turso.ts
 * 
 * Required environment variables:
 *   TURSO_DATABASE_URL
 *   TURSO_AUTH_TOKEN
 */

import { initializeTursoSchema, testTursoConnection } from '../app/lib/tursoStorage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🔧 Turso Database Initialization');
  console.log('================================\n');

  // Check environment variables
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (!tursoUrl || !tursoToken) {
    console.error('❌ Missing required environment variables:');
    if (!tursoUrl) console.error('   - TURSO_DATABASE_URL');
    if (!tursoToken) console.error('   - TURSO_AUTH_TOKEN');
    console.error('\nPlease set these in your .env file or environment.');
    process.exit(1);
  }

  console.log('✅ Environment variables found');
  console.log(`   Database URL: ${tursoUrl.replace(/\/\/[^@]+@/, '//***@')}`);

  // Test connection
  console.log('\n🔄 Testing Turso connection...');
  const connected = await testTursoConnection();

  if (!connected) {
    console.error('❌ Failed to connect to Turso. Please check your credentials.');
    process.exit(1);
  }

  // Initialize schema
  console.log('\n🔄 Initializing database schema...');
  const initialized = await initializeTursoSchema();

  if (!initialized) {
    console.error('❌ Failed to initialize schema.');
    process.exit(1);
  }

  console.log('\n✅ Turso database initialized successfully!');
  console.log('\nNext steps:');
  console.log('   1. Your Turso database is ready to use as a fallback to MongoDB');
  console.log('   2. Token data will be stored in both databases automatically');
  console.log('   3. If MongoDB fails, Turso will serve as backup');
}

main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

#!/usr/bin/env tsx
/**
 * Generate a secure random seed for MemeHaus vault addresses
 * 
 * Usage:
 *   npm run generate-vault-seed
 *   or
 *   tsx scripts/generate-vault-seed.ts
 * 
 * This will generate a cryptographically secure random seed
 * that should be stored as MEMEHAUS_VAULT_SEED environment variable
 */

import { randomBytes } from 'crypto';

/**
 * Generate a secure random seed
 * @param length - Length of seed in bytes (default: 32)
 * @returns Hex-encoded seed string
 */
function generateSecureSeed(length: number = 32): string {
  const bytes = randomBytes(length);
  return bytes.toString('hex');
}

/**
 * Generate a human-readable seed phrase
 * @returns Seed phrase string
 */
function generateSeedPhrase(): string {
  const words = [
    'memehaus', 'vault', 'liquidity', 'community', 'solana',
    'token', 'distribution', 'secure', 'deterministic', 'keypair',
    'blockchain', 'defi', 'crypto', 'wallet', 'address'
  ];
  
  const selectedWords: string[] = [];
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    selectedWords.push(words[randomIndex]);
  }
  
  return selectedWords.join('-') + '-' + Date.now().toString(36);
}

// Main execution
function main() {
  console.log('🔐 MemeHaus Vault Seed Generator\n');
  console.log('Generating secure vault seed...\n');
  
  // Generate hex seed (recommended for production)
  const hexSeed = generateSecureSeed(32);
  console.log('✅ Hex Seed (Recommended for Production):');
  console.log('─'.repeat(60));
  console.log(hexSeed);
  console.log('─'.repeat(60));
  console.log('\n📋 Add this to your .env.local file:');
  console.log(`MEMEHAUS_VAULT_SEED=${hexSeed}\n`);
  
  // Generate human-readable seed (alternative)
  const phraseSeed = generateSeedPhrase();
  console.log('✅ Human-Readable Seed (Alternative):');
  console.log('─'.repeat(60));
  console.log(phraseSeed);
  console.log('─'.repeat(60));
  console.log('\n📋 Or use this in your .env.local file:');
  console.log(`MEMEHAUS_VAULT_SEED=${phraseSeed}\n`);
  
  console.log('⚠️  IMPORTANT SECURITY NOTES:');
  console.log('   1. Never commit this seed to version control');
  console.log('   2. Store it securely (use .env.local, not .env)');
  console.log('   3. Use the same seed across all environments for consistency');
  console.log('   4. If you change the seed, all vault addresses will change');
  console.log('   5. Keep a backup of this seed in a secure location\n');
  
  console.log('🚀 For Vercel/Production:');
  console.log('   1. Go to your Vercel project settings');
  console.log('   2. Navigate to Environment Variables');
  console.log('   3. Add: MEMEHAUS_VAULT_SEED');
  console.log('   4. Paste the seed value');
  console.log('   5. Select all environments (Production, Preview, Development)\n');
  
  return hexSeed;
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { generateSecureSeed, generateSeedPhrase };


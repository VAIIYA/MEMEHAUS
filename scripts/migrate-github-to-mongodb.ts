/**
 * Migration script to migrate tokens from GitHub to MongoDB
 * 
 * Usage:
 * 1. Make sure your dev server is running: npm run dev
 * 2. Run this script: npx tsx scripts/migrate-github-to-mongodb.ts
 * 
 * Or call the API endpoint directly:
 * curl -X POST http://localhost:3000/api/migrate/github-to-mongodb
 */

async function migrateTokens() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const migrationUrl = `${baseUrl}/api/migrate/github-to-mongodb`;
  
  console.log('🔄 Starting migration from GitHub to MongoDB...');
  console.log(`📡 Calling: ${migrationUrl}`);
  
  try {
    const response = await fetch(migrationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Migration completed successfully!');
      console.log(`   Total tokens in GitHub: ${result.total}`);
      console.log(`   Migrated: ${result.migrated}`);
      console.log(`   Skipped: ${result.skipped}`);
      console.log(`   Creators stored: ${result.creators}`);
      
      if (result.errors && result.errors.length > 0) {
        console.log(`\n⚠️  ${result.errors.length} errors occurred:`);
        result.errors.forEach((error: any, index: number) => {
          console.log(`   ${index + 1}. ${error.token}: ${error.error}`);
        });
      }
    } else {
      console.error('❌ Migration failed:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error calling migration endpoint:', error);
    console.error('\n💡 Make sure your dev server is running: npm run dev');
    process.exit(1);
  }
}

// Check migration status first
async function checkStatus() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const statusUrl = `${baseUrl}/api/migrate/github-to-mongodb`;
  
  try {
    const response = await fetch(statusUrl);
    const result = await response.json();
    
    if (result.success) {
      console.log('📊 Migration Status:');
      console.log(`   MongoDB tokens: ${result.mongodb.count}`);
      console.log(`   GitHub tokens: ${result.github.count}`);
      console.log(`   Needs migration: ${result.needsMigration ? 'Yes' : 'No'}`);
      
      if (result.needsMigration) {
        console.log('\n🔄 Running migration...\n');
        await migrateTokens();
      } else {
        console.log('\n✅ All tokens are already migrated!');
      }
    }
  } catch (error) {
    console.error('❌ Error checking status:', error);
    console.error('\n💡 Make sure your dev server is running: npm run dev');
    process.exit(1);
  }
}

// Run status check first, then migrate if needed
checkStatus();

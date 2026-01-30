import { TokenData } from './types';
import {
  storeTokenDataInMongoDB,
  storeCreatorWalletInMongoDB,
  getTokenDataFromMongoDB,
  getCreatorDataFromMongoDB,
  listTokensFromMongoDB,
  getAllCreatorsFromMongoDB,
  testMongoDBConnection,
} from './mongodbStorage';
import {
  storeTokenDataInTurso,
  storeCreatorWalletInTurso,
  getTokenDataFromTurso,
  getCreatorDataFromTurso,
  listTokensFromTurso,
  getAllCreatorsFromTurso,
  testTursoConnection,
  initializeTursoSchema,
} from './tursoStorage';

export interface StorageResult {
  success: boolean;
  error?: string;
  id?: string;
  source?: 'mongodb' | 'turso' | 'both' | 'none';
}

/**
 * Unified storage service that uses MongoDB as primary and Turso as fallback
 * This provides redundancy and ensures data is always stored even if one database fails
 */

/**
 * Store token data in both MongoDB and Turso
 * MongoDB is primary, Turso is fallback/backup
 */
export async function storeTokenData(
  tokenData: TokenData
): Promise<StorageResult> {
  const results: {
    mongodb: { success: boolean; error?: string };
    turso: { success: boolean; error?: string };
  } = {
    mongodb: { success: false },
    turso: { success: false },
  };

  console.log(`🔄 Storing token data for ${tokenData.symbol}...`);

  // Try MongoDB first
  try {
    const mongoResult = await storeTokenDataInMongoDB(tokenData);
    results.mongodb = mongoResult;
    if (mongoResult.success) {
      console.log(`✅ Token stored in MongoDB: ${tokenData.mintAddress}`);
    } else {
      console.warn(`⚠️ MongoDB storage failed: ${mongoResult.error}`);
    }
  } catch (error) {
    console.error('❌ MongoDB storage error:', error);
    results.mongodb = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Try Turso as backup (runs in parallel with MongoDB)
  try {
    const tursoResult = await storeTokenDataInTurso(tokenData);
    results.turso = tursoResult;
    if (tursoResult.success) {
      console.log(`✅ Token stored in Turso: ${tokenData.mintAddress}`);
    } else {
      console.warn(`⚠️ Turso storage failed: ${tursoResult.error}`);
    }
  } catch (error) {
    console.error('❌ Turso storage error:', error);
    results.turso = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Determine overall success
  if (results.mongodb.success && results.turso.success) {
    return {
      success: true,
      id: tokenData.id,
      source: 'both',
    };
  } else if (results.mongodb.success) {
    return {
      success: true,
      id: tokenData.id,
      source: 'mongodb',
    };
  } else if (results.turso.success) {
    return {
      success: true,
      id: tokenData.id,
      source: 'turso',
    };
  } else {
    return {
      success: false,
      error: `All storage methods failed. MongoDB: ${results.mongodb.error}, Turso: ${results.turso.error}`,
      source: 'none',
    };
  }
}

/**
 * Store creator wallet data in both MongoDB and Turso
 */
export async function storeCreatorWallet(
  walletAddress: string,
  tokenMint: string
): Promise<StorageResult> {
  const results: {
    mongodb: { success: boolean; error?: string };
    turso: { success: boolean; error?: string };
  } = {
    mongodb: { success: false },
    turso: { success: false },
  };

  console.log(`🔄 Storing creator wallet: ${walletAddress}...`);

  // Try MongoDB first
  try {
    const mongoResult = await storeCreatorWalletInMongoDB(walletAddress, tokenMint);
    results.mongodb = mongoResult;
    if (mongoResult.success) {
      console.log(`✅ Creator stored in MongoDB: ${walletAddress}`);
    }
  } catch (error) {
    console.error('❌ MongoDB creator storage error:', error);
    results.mongodb = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Try Turso as backup
  try {
    const tursoResult = await storeCreatorWalletInTurso(walletAddress, tokenMint);
    results.turso = tursoResult;
    if (tursoResult.success) {
      console.log(`✅ Creator stored in Turso: ${walletAddress}`);
    }
  } catch (error) {
    console.error('❌ Turso creator storage error:', error);
    results.turso = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Determine overall success
  if (results.mongodb.success || results.turso.success) {
    return {
      success: true,
      id: walletAddress,
      source: results.mongodb.success && results.turso.success ? 'both' : 
              results.mongodb.success ? 'mongodb' : 'turso',
    };
  } else {
    return {
      success: false,
      error: `All storage methods failed. MongoDB: ${results.mongodb.error}, Turso: ${results.turso.error}`,
    };
  }
}

/**
 * Get token data - tries MongoDB first, falls back to Turso
 */
export async function getTokenData(
  mintAddress: string
): Promise<TokenData | null> {
  // Try MongoDB first
  try {
    const mongoData = await getTokenDataFromMongoDB(mintAddress);
    if (mongoData) {
      console.log(`✅ Token data retrieved from MongoDB: ${mintAddress}`);
      return mongoData;
    }
  } catch (error) {
    console.warn('⚠️ MongoDB retrieval failed:', error);
  }

  // Fall back to Turso
  try {
    const tursoData = await getTokenDataFromTurso(mintAddress);
    if (tursoData) {
      console.log(`✅ Token data retrieved from Turso (fallback): ${mintAddress}`);
      return tursoData;
    }
  } catch (error) {
    console.warn('⚠️ Turso retrieval failed:', error);
  }

  console.log(`ℹ️ Token not found in any database: ${mintAddress}`);
  return null;
}

/**
 * Get creator data - tries MongoDB first, falls back to Turso
 */
export async function getCreatorData(
  walletAddress: string
): Promise<{
  wallet_address: string;
  created_tokens: string[];
  total_tokens_created: number;
  first_token_created_at: string | Date;
  updated_at: string | Date;
} | null> {
  // Try MongoDB first
  try {
    const mongoData = await getCreatorDataFromMongoDB(walletAddress);
    if (mongoData) {
      console.log(`✅ Creator data retrieved from MongoDB: ${walletAddress}`);
      return mongoData;
    }
  } catch (error) {
    console.warn('⚠️ MongoDB creator retrieval failed:', error);
  }

  // Fall back to Turso
  try {
    const tursoData = await getCreatorDataFromTurso(walletAddress);
    if (tursoData) {
      console.log(`✅ Creator data retrieved from Turso (fallback): ${walletAddress}`);
      return {
        ...tursoData,
        first_token_created_at: new Date(tursoData.first_token_created_at),
        updated_at: new Date(tursoData.updated_at),
      };
    }
  } catch (error) {
    console.warn('⚠️ Turso creator retrieval failed:', error);
  }

  return null;
}

/**
 * List all tokens - combines results from both databases
 * Prefers MongoDB data when duplicates exist
 */
export async function listTokens(limit: number = 50): Promise<TokenData[]> {
  let mongoTokens: TokenData[] = [];
  let tursoTokens: TokenData[] = [];

  // Get from MongoDB
  try {
    mongoTokens = await listTokensFromMongoDB(limit);
    console.log(`✅ Listed ${mongoTokens.length} tokens from MongoDB`);
  } catch (error) {
    console.warn('⚠️ MongoDB list failed:', error);
  }

  // Get from Turso (for backup/completeness)
  try {
    tursoTokens = await listTokensFromTurso(limit);
    console.log(`✅ Listed ${tursoTokens.length} tokens from Turso`);
  } catch (error) {
    console.warn('⚠️ Turso list failed:', error);
  }

  // Merge results, preferring MongoDB data
  const mintAddresses = new Set(mongoTokens.map(t => t.mintAddress));
  const uniqueTursoTokens = tursoTokens.filter(t => !mintAddresses.has(t.mintAddress));

  const allTokens = [...mongoTokens, ...uniqueTursoTokens];

  // Sort by createdAt descending
  allTokens.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  console.log(`✅ Total unique tokens: ${allTokens.length}`);
  return allTokens.slice(0, limit);
}

/**
 * Get all creators - combines results from both databases
 */
export async function getAllCreators(): Promise<string[]> {
  let mongoCreators: string[] = [];
  let tursoCreators: string[] = [];

  // Get from MongoDB
  try {
    mongoCreators = await getAllCreatorsFromMongoDB();
  } catch (error) {
    console.warn('⚠️ MongoDB creators list failed:', error);
  }

  // Get from Turso
  try {
    tursoCreators = await getAllCreatorsFromTurso();
  } catch (error) {
    console.warn('⚠️ Turso creators list failed:', error);
  }

  // Combine and deduplicate
  const allCreators = Array.from(new Set([...mongoCreators, ...tursoCreators]));
  console.log(`✅ Total unique creators: ${allCreators.length}`);
  return allCreators;
}

/**
 * Test all database connections
 */
export async function testAllConnections(): Promise<{
  mongodb: boolean;
  turso: boolean;
}> {
  console.log('🔄 Testing all database connections...');

  const [mongodb, turso] = await Promise.all([
    testMongoDBConnection(),
    testTursoConnection(),
  ]);

  console.log(`Database connections - MongoDB: ${mongodb ? '✅' : '❌'}, Turso: ${turso ? '✅' : '❌'}`);

  return { mongodb, turso };
}

/**
 * Initialize Turso schema (call this once on deployment)
 */
export async function initializeTurso(): Promise<boolean> {
  console.log('🔄 Initializing Turso schema...');
  return await initializeTursoSchema();
}

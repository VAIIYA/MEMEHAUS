import { createClient, Client } from '@libsql/client';
import { TokenData } from './types';

// Turso configuration
function getTursoConfig() {
  return {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  };
}

// Create Turso client
let tursoClient: Client | null = null;

async function getTursoClient(): Promise<Client | null> {
  const config = getTursoConfig();

  if (!config.url || !config.authToken) {
    return null;
  }

  if (tursoClient) {
    return tursoClient;
  }

  try {
    tursoClient = createClient({
      url: config.url,
      authToken: config.authToken,
    });

    console.log('✅ Turso client connected');
    return tursoClient;
  } catch (error) {
    console.error('❌ Failed to connect to Turso:', error);
    return null;
  }
}

export interface TursoStorageResult {
  success: boolean;
  error?: string;
  id?: string;
}

/**
 * Initialize Turso database schema
 * Call this once to set up the tables
 */
export async function initializeTursoSchema(): Promise<boolean> {
  try {
    const client = await getTursoClient();
    if (!client) {
      console.error('❌ Turso not configured');
      return false;
    }

    // Create tokens table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS tokens (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        symbol TEXT NOT NULL,
        description TEXT,
        total_supply TEXT NOT NULL,
        creator_wallet TEXT NOT NULL,
        mint_address TEXT UNIQUE NOT NULL,
        token_account TEXT NOT NULL,
        initial_price REAL NOT NULL,
        vesting_period INTEGER NOT NULL,
        community_fee REAL NOT NULL,
        decimals INTEGER NOT NULL,
        image_url TEXT,
        metadata_uri TEXT NOT NULL,
        token_creation_signature TEXT NOT NULL,
        fee_transaction_signature TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Create creators table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS creators (
        wallet_address TEXT PRIMARY KEY,
        created_tokens TEXT, -- JSON array of mint addresses
        total_tokens_created INTEGER DEFAULT 1,
        first_token_created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Create indexes for better performance
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_tokens_mint_address ON tokens(mint_address);
      CREATE INDEX IF NOT EXISTS idx_tokens_creator_wallet ON tokens(creator_wallet);
      CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at);
      CREATE INDEX IF NOT EXISTS idx_creators_wallet ON creators(wallet_address);
    `);

    console.log('✅ Turso schema initialized');
    return true;
  } catch (error) {
    console.error('❌ Error initializing Turso schema:', error);
    return false;
  }
}

/**
 * Store token data in Turso (backup storage)
 * @param tokenData - Token data to store
 * @returns Storage result
 */
export async function storeTokenDataInTurso(
  tokenData: TokenData
): Promise<TursoStorageResult> {
  try {
    console.log(`🔄 Storing token data in Turso for ${tokenData.symbol}...`);

    const client = await getTursoClient();

    if (!client) {
      const config = getTursoConfig();
      console.warn('⚠️ Turso not configured:', {
        hasUrl: !!config.url,
        hasAuthToken: !!config.authToken,
      });
      return {
        success: false,
        error: 'Turso not configured. Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variable',
      };
    }

    // Insert or replace token data
    await client.execute({
      sql: `
        INSERT INTO tokens (
          id, name, symbol, description, total_supply, creator_wallet,
          mint_address, token_account, initial_price, vesting_period,
          community_fee, decimals, image_url, metadata_uri,
          token_creation_signature, fee_transaction_signature, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(mint_address) DO UPDATE SET
          name = excluded.name,
          symbol = excluded.symbol,
          description = excluded.description,
          total_supply = excluded.total_supply,
          creator_wallet = excluded.creator_wallet,
          token_account = excluded.token_account,
          initial_price = excluded.initial_price,
          vesting_period = excluded.vesting_period,
          community_fee = excluded.community_fee,
          decimals = excluded.decimals,
          image_url = excluded.image_url,
          metadata_uri = excluded.metadata_uri,
          token_creation_signature = excluded.token_creation_signature,
          fee_transaction_signature = excluded.fee_transaction_signature,
          updated_at = excluded.updated_at
      `,
      args: [
        tokenData.id,
        tokenData.name,
        tokenData.symbol,
        tokenData.description,
        tokenData.totalSupply,
        tokenData.creatorWallet,
        tokenData.mintAddress,
        tokenData.tokenAccount,
        tokenData.initialPrice,
        tokenData.vestingPeriod,
        tokenData.communityFee,
        tokenData.decimals,
        tokenData.imageUrl || null,
        tokenData.metadataUri,
        tokenData.tokenCreationSignature,
        tokenData.feeTransactionSignature || null,
        tokenData.createdAt,
        new Date().toISOString(),
      ],
    });

    console.log(`✅ Token data stored in Turso: ${tokenData.mintAddress}, imageUrl: ${tokenData.imageUrl || 'NOT SET'}`);

    return {
      success: true,
      id: tokenData.id,
    };

  } catch (error) {
    console.error('❌ Error storing token data in Turso:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Store creator/wallet data in Turso
 * @param walletAddress - Creator wallet address
 * @param tokenMint - Token mint address they created
 * @returns Storage result
 */
export async function storeCreatorWalletInTurso(
  walletAddress: string,
  tokenMint: string
): Promise<TursoStorageResult> {
  try {
    console.log(`🔄 Storing creator wallet in Turso: ${walletAddress}...`);

    const client = await getTursoClient();

    if (!client) {
      return {
        success: false,
        error: 'Turso not configured',
      };
    }

    // Check if creator already exists
    const existing = await client.execute({
      sql: 'SELECT * FROM creators WHERE wallet_address = ?',
      args: [walletAddress],
    });

    if (existing.rows.length > 0) {
      // Creator exists, update tokens array and count
      const row = existing.rows[0];
      const existingTokens = row.created_tokens ? JSON.parse(row.created_tokens as string) : [];
      
      if (!existingTokens.includes(tokenMint)) {
        existingTokens.push(tokenMint);
      }

      await client.execute({
        sql: `
          UPDATE creators 
          SET created_tokens = ?, 
              total_tokens_created = total_tokens_created + 1,
              updated_at = ?
          WHERE wallet_address = ?
        `,
        args: [
          JSON.stringify(existingTokens),
          new Date().toISOString(),
          walletAddress,
        ],
      });
    } else {
      // New creator
      await client.execute({
        sql: `
          INSERT INTO creators (
            wallet_address, created_tokens, total_tokens_created,
            first_token_created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?)
        `,
        args: [
          walletAddress,
          JSON.stringify([tokenMint]),
          1,
          new Date().toISOString(),
          new Date().toISOString(),
        ],
      });
    }

    console.log(`✅ Creator wallet stored in Turso: ${walletAddress}`);

    return {
      success: true,
      id: walletAddress,
    };

  } catch (error) {
    console.error('❌ Error storing creator wallet in Turso:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get token data from Turso
 * @param mintAddress - Token mint address
 * @returns Token data or null if not found
 */
export async function getTokenDataFromTurso(
  mintAddress: string
): Promise<TokenData | null> {
  try {
    const client = await getTursoClient();

    if (!client) {
      return null;
    }

    const result = await client.execute({
      sql: 'SELECT * FROM tokens WHERE mint_address = ?',
      args: [mintAddress],
    });

    if (result.rows.length === 0) {
      return null;
    }

    const token = result.rows[0];

    return {
      id: token.id as string,
      name: token.name as string,
      symbol: token.symbol as string,
      description: token.description as string,
      totalSupply: token.total_supply as string,
      creatorWallet: token.creator_wallet as string,
      mintAddress: token.mint_address as string,
      tokenAccount: token.token_account as string,
      initialPrice: token.initial_price as number,
      vestingPeriod: token.vesting_period as number,
      communityFee: token.community_fee as number,
      decimals: token.decimals as number,
      imageUrl: token.image_url as string | undefined,
      metadataUri: token.metadata_uri as string,
      tokenCreationSignature: token.token_creation_signature as string,
      feeTransactionSignature: token.fee_transaction_signature as string,
      createdAt: token.created_at as string,
    };
  } catch (error) {
    console.error('❌ Error retrieving token data from Turso:', error);
    return null;
  }
}

/**
 * Get creator data from Turso
 * @param walletAddress - Creator wallet address
 * @returns Creator data or null if not found
 */
export async function getCreatorDataFromTurso(
  walletAddress: string
): Promise<{
  wallet_address: string;
  created_tokens: string[];
  total_tokens_created: number;
  first_token_created_at: string;
  updated_at: string;
} | null> {
  try {
    const client = await getTursoClient();

    if (!client) {
      return null;
    }

    const result = await client.execute({
      sql: 'SELECT * FROM creators WHERE wallet_address = ?',
      args: [walletAddress],
    });

    if (result.rows.length === 0) {
      return null;
    }

    const creator = result.rows[0];

    return {
      wallet_address: creator.wallet_address as string,
      created_tokens: creator.created_tokens ? JSON.parse(creator.created_tokens as string) : [],
      total_tokens_created: creator.total_tokens_created as number,
      first_token_created_at: creator.first_token_created_at as string,
      updated_at: creator.updated_at as string,
    };
  } catch (error) {
    console.error('❌ Error retrieving creator data from Turso:', error);
    return null;
  }
}

/**
 * List all tokens from Turso
 * @param limit - Maximum number of tokens to retrieve
 * @returns Array of token data
 */
export async function listTokensFromTurso(
  limit: number = 50
): Promise<TokenData[]> {
  try {
    const client = await getTursoClient();

    if (!client) {
      return [];
    }

    const result = await client.execute({
      sql: 'SELECT * FROM tokens ORDER BY created_at DESC LIMIT ?',
      args: [limit],
    });

    return result.rows.map((token) => ({
      id: token.id as string,
      name: token.name as string,
      symbol: token.symbol as string,
      description: token.description as string,
      totalSupply: token.total_supply as string,
      creatorWallet: token.creator_wallet as string,
      mintAddress: token.mint_address as string,
      tokenAccount: token.token_account as string,
      initialPrice: token.initial_price as number,
      vestingPeriod: token.vesting_period as number,
      communityFee: token.community_fee as number,
      decimals: token.decimals as number,
      imageUrl: token.image_url as string | undefined,
      metadataUri: token.metadata_uri as string,
      tokenCreationSignature: token.token_creation_signature as string,
      feeTransactionSignature: token.fee_transaction_signature as string,
      createdAt: token.created_at as string,
    }));
  } catch (error) {
    console.error('❌ Error listing tokens from Turso:', error);
    return [];
  }
}

/**
 * Get all creators from Turso (for fee distribution)
 * @returns Array of creator wallet addresses
 */
export async function getAllCreatorsFromTurso(): Promise<string[]> {
  try {
    const client = await getTursoClient();

    if (!client) {
      return [];
    }

    const result = await client.execute({
      sql: 'SELECT wallet_address FROM creators',
      args: [],
    });

    return result.rows.map((row) => row.wallet_address as string);
  } catch (error) {
    console.error('❌ Error retrieving creators from Turso:', error);
    return [];
  }
}

/**
 * Test Turso connection
 * @returns Connection test result
 */
export async function testTursoConnection(): Promise<boolean> {
  try {
    const client = await getTursoClient();

    if (!client) {
      console.error('❌ Turso not configured');
      return false;
    }

    // Test by executing a simple query
    await client.execute('SELECT 1');

    console.log('✅ Turso connection successful');
    return true;
  } catch (error) {
    console.error('❌ Turso connection failed:', error);
    return false;
  }
}

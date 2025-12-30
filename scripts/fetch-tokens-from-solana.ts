/**
 * Script to fetch token data from Solana blockchain and store in MongoDB
 * 
 * Usage: npx tsx scripts/fetch-tokens-from-solana.ts
 */

// Load environment variables
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });
dotenv.config();

import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';
import { Metaplex } from '@metaplex-foundation/js';
import { storeTokenDataInMongoDB, storeCreatorWalletInMongoDB } from '../app/lib/mongodbStorage';
import { TokenData } from '../app/lib/githubOnlyStorage';

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

// RPC endpoint from environment or default
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

async function fetchTokenFromSolana(mintAddress: string): Promise<TokenData | null> {
  try {
    console.log(`\n📡 Fetching token data for ${mintAddress}...`);
    
    const connection = new Connection(RPC_URL, 'confirmed');
    const mintPublicKey = new PublicKey(mintAddress);
    
    // 1. Get mint account info (supply, decimals, etc.)
    console.log('   Fetching mint account info...');
    const mintInfo = await getMint(connection, mintPublicKey);
    const totalSupply = Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals);
    
    console.log(`   ✅ Mint info: ${totalSupply} tokens, ${mintInfo.decimals} decimals`);
    
    // 2. Get metadata using Metaplex JS SDK
    console.log('   Fetching metadata account...');
    let metadataName = '';
    let metadataSymbol = '';
    let metadataUri = '';
    let metadataJson: any = null;
    let creatorWallet = '';
    
    try {
      const metaplex = Metaplex.make(connection);
      const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey });
      
      if (nft) {
        metadataName = nft.name;
        metadataSymbol = nft.symbol;
        metadataUri = nft.uri;
        creatorWallet = nft.updateAuthorityAddress.toBase58();
        
        console.log(`   ✅ Metadata found: ${metadataName} (${metadataSymbol})`);
        
        // Fetch the metadata JSON from URI if available
        if (metadataUri) {
          try {
            console.log(`   Fetching metadata JSON from: ${metadataUri}`);
            const response = await fetch(metadataUri);
            if (response.ok) {
              metadataJson = await response.json();
              console.log(`   ✅ Metadata JSON fetched`);
            } else {
              console.warn(`   ⚠️  Failed to fetch metadata JSON: ${response.status}`);
            }
          } catch (uriError) {
            console.warn(`   ⚠️  Error fetching metadata JSON:`, uriError);
          }
        }
      }
    } catch (metadataError: any) {
      // Try alternative method: fetch metadata account directly
      if (metadataError.message?.includes('AccountNotFound') || metadataError.message?.includes('not found')) {
        console.warn(`   ⚠️  Metaplex fetch failed, trying direct account fetch...`);
        
        try {
          // Derive metadata PDA
          const [metadataPDA] = PublicKey.findProgramAddressSync(
            [
              Buffer.from('metadata'),
              TOKEN_METADATA_PROGRAM_ID.toBuffer(),
              mintPublicKey.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
          );
          
          // Get account info
          const accountInfo = await connection.getAccountInfo(metadataPDA);
          if (accountInfo) {
            console.log(`   ✅ Metadata account found, but parsing failed. Using fallback names.`);
            // We'll use the mint address to derive a name
            metadataName = `Token ${mintAddress.slice(0, 8)}`;
            metadataSymbol = mintAddress.slice(0, 4).toUpperCase();
          }
        } catch (directError) {
          console.warn(`   ⚠️  Direct fetch also failed:`, directError);
        }
      } else {
        console.warn(`   ⚠️  Error fetching metadata:`, metadataError.message);
      }
    }
    
    // 3. Fallback to mint authority if no metadata creator found
    if (!creatorWallet && mintInfo.mintAuthority) {
      creatorWallet = mintInfo.mintAuthority.toBase58();
    }
    
    // 4. Get associated token account for creator (if available)
    let tokenAccount = '';
    if (creatorWallet) {
      try {
        const { getAssociatedTokenAddress } = await import('@solana/spl-token');
        const ata = await getAssociatedTokenAddress(
          mintPublicKey,
          new PublicKey(creatorWallet),
          false,
          undefined
        );
        tokenAccount = ata.toBase58();
      } catch (error) {
        // Token account might not exist yet
      }
    }
    
    // Use known token names as fallback
    const knownToken = KNOWN_TOKENS[mintAddress];
    const finalName = metadataName || knownToken?.name || 'Unknown Token';
    const finalSymbol = metadataSymbol || knownToken?.symbol || 'UNKNOWN';
    
    // 5. Build TokenData object
    const tokenData: TokenData = {
      id: `${finalSymbol.toLowerCase()}-${Date.now()}`,
      name: finalName,
      symbol: finalSymbol,
      description: metadataJson?.description || finalName || 'Token created on MemeHaus',
      totalSupply: totalSupply.toString(),
      creatorWallet: creatorWallet || '',
      mintAddress: mintAddress,
      tokenAccount: tokenAccount,
      initialPrice: 0, // We don't have this from on-chain data
      vestingPeriod: 12, // Default
      communityFee: 10, // Default
      decimals: mintInfo.decimals,
      imageUrl: metadataJson?.image || metadataJson?.properties?.files?.[0]?.uri || '',
      metadataUri: metadataUri || '',
      tokenCreationSignature: '', // We don't have this from on-chain
      feeTransactionSignature: '', // We don't have this from on-chain
      createdAt: new Date().toISOString(), // Use current time as we don't have creation time
    };
    
    console.log(`   ✅ Token data prepared:`);
    console.log(`      Name: ${tokenData.name}`);
    console.log(`      Symbol: ${tokenData.symbol}`);
    console.log(`      Supply: ${tokenData.totalSupply}`);
    console.log(`      Creator: ${tokenData.creatorWallet || 'Unknown'}`);
    
    return tokenData;
    
  } catch (error) {
    console.error(`   ❌ Error fetching token ${mintAddress}:`, error);
    return null;
  }
}

async function fetchAndStoreTokens(mintAddresses: string[]) {
  try {
    console.log('🔄 Starting token fetch from Solana blockchain...');
    console.log(`📡 RPC Endpoint: ${RPC_URL}`);
    console.log(`📋 Tokens to fetch: ${mintAddresses.length}`);
    console.log('');
    
    const results = {
      fetched: 0,
      stored: 0,
      creators: 0,
      errors: [] as Array<{ mint: string; error: string }>,
    };
    
    for (const mintAddress of mintAddresses) {
      try {
        // Fetch token data from Solana
        const tokenData = await fetchTokenFromSolana(mintAddress);
        
        if (!tokenData) {
          results.errors.push({
            mint: mintAddress,
            error: 'Failed to fetch token data'
          });
          continue;
        }
        
        results.fetched++;
        
        // Store in MongoDB
        console.log(`   💾 Storing in MongoDB...`);
        const storeResult = await storeTokenDataInMongoDB(tokenData);
        
        if (storeResult.success) {
          results.stored++;
          console.log(`   ✅ Stored in MongoDB`);
          
          // Also store creator wallet if available
          if (tokenData.creatorWallet) {
            try {
              const creatorResult = await storeCreatorWalletInMongoDB(
                tokenData.creatorWallet,
                tokenData.mintAddress
              );
              
              if (creatorResult.success) {
                results.creators++;
                console.log(`   ✅ Stored creator wallet`);
              }
            } catch (creatorError) {
              console.warn(`   ⚠️  Failed to store creator wallet:`, creatorError);
            }
          }
        } else {
          results.errors.push({
            mint: mintAddress,
            error: storeResult.error || 'Failed to store in MongoDB'
          });
          console.error(`   ❌ Failed to store: ${storeResult.error}`);
        }
        
      } catch (error) {
        results.errors.push({
          mint: mintAddress,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`   ❌ Error processing ${mintAddress}:`, error);
      }
    }
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Fetch and store complete!');
    console.log(`   📥 Fetched from Solana: ${results.fetched}`);
    console.log(`   💾 Stored in MongoDB: ${results.stored}`);
    console.log(`   👥 Creators stored: ${results.creators}`);
    console.log(`   ❌ Errors: ${results.errors.length}`);
    console.log('═══════════════════════════════════════════════════════');
    
    if (results.errors.length > 0) {
      console.log('');
      console.log('Errors:');
      results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.mint}: ${error.error}`);
      });
    }
    
    if (results.stored > 0) {
      console.log('');
      console.log('🎉 Success! Your tokens should now appear on the frontpage.');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Token addresses to fetch - these will update existing tokens in MongoDB
const TOKEN_ADDRESSES = [
  '8GRqqRPcTGfQVXRuuFgt9uqowEdwRnLyZE6gogFpA8xb', // MemeHaus
  'E5tfCyfYvaY7i9FzoDrfwtMfc9Ve9oGyfgmLmPV3A13X', // MEMEDOGE
];

// Known token names (fallback if metadata fetch fails)
const KNOWN_TOKENS: Record<string, { name: string; symbol: string }> = {
  '8GRqqRPcTGfQVXRuuFgt9uqowEdwRnLyZE6gogFpA8xb': { name: 'MemeHaus', symbol: 'MEMEHAUS' },
  'E5tfCyfYvaY7i9FzoDrfwtMfc9Ve9oGyfgmLmPV3A13X': { name: 'MEMEDOGE', symbol: 'MEMEDOGE' },
};

// Run the fetch and store
fetchAndStoreTokens(TOKEN_ADDRESSES).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

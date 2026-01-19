import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import bs58 from 'bs58';
import { getAllCreatorsFromMongoDB } from '../../../lib/mongodbStorage';
import { PDAService } from '../../../lib/pdaService';

export const dynamic = 'force-dynamic';

// Server wallet - in production, load from secure environment variable
const SERVER_WALLET_PRIVATE_KEY = process.env.SERVER_WALLET_PRIVATE_KEY;
const SERVER_WALLET_ADDRESS = '7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e';

/**
 * API endpoint to distribute community fees to previous creators
 * This requires server wallet private key to sign transactions for fees
 * and derives token-specific vault keys for token movement
 * 
 * POST /api/fees/distribute
 * Body: {
 *   tokenMint: string,
 *   excludeWallet?: string (current creator to exclude)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check if server wallet key is configured
    if (!SERVER_WALLET_PRIVATE_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Server wallet private key not configured. This endpoint requires server-side execution.'
      }, { status: 500 });
    }

    const body = await request.json();
    const { tokenMint, excludeWallet } = body;

    if (!tokenMint) {
      return NextResponse.json({
        success: false,
        error: 'tokenMint is required'
      }, { status: 400 });
    }

    // Get RPC endpoint
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');

    // Load server wallet keypair (used for paying GAS fees)
    let serverWalletKeypair: Keypair;
    try {
      const privateKeyBytes = bs58.decode(SERVER_WALLET_PRIVATE_KEY);
      serverWalletKeypair = Keypair.fromSecretKey(privateKeyBytes);
    } catch (e) {
      try {
        const privateKeyBytes = Buffer.from(SERVER_WALLET_PRIVATE_KEY, 'base64');
        serverWalletKeypair = Keypair.fromSecretKey(privateKeyBytes);
      } catch (err) {
        return NextResponse.json({
          success: false,
          error: 'Invalid private key format.'
        }, { status: 400 });
      }
    }

    const serverWallet = serverWalletKeypair.publicKey;
    const tokenMintPubkey = new PublicKey(tokenMint);

    // Derive community vault keypair for this specific token
    const vaultKeypair = await PDAService.getCommunityVaultKeypair(tokenMintPubkey);
    const vaultPubKey = vaultKeypair.publicKey;

    // Get vault token account (source of distribution)
    const vaultTokenAccount = await getAssociatedTokenAddress(
      tokenMintPubkey,
      vaultPubKey,
      false,
      TOKEN_PROGRAM_ID
    );

    // Get vault token account balance
    let availableBalance: bigint;
    try {
      const balance = await connection.getTokenAccountBalance(vaultTokenAccount);
      availableBalance = BigInt(balance.value.amount);
    } catch (balanceError) {
      return NextResponse.json({
        success: false,
        error: `Vault account for token ${tokenMint} does not exist or has no tokens.`
      }, { status: 400 });
    }

    if (availableBalance === BigInt(0)) {
      return NextResponse.json({
        success: false,
        error: 'No community fees available to distribute in this vault'
      }, { status: 400 });
    }

    // Get previous creators from MongoDB (excluding current creator)
    const allCreators = await getAllCreatorsFromMongoDB();
    const previousCreators = allCreators.filter(
      addr => !excludeWallet || addr !== excludeWallet
    );

    if (previousCreators.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No previous creators to distribute fees to',
        distributions: []
      });
    }

    // Calculate distribution amounts (split equally)
    const amountPerCreator = availableBalance / BigInt(previousCreators.length);
    const remainder = availableBalance % BigInt(previousCreators.length);

    console.log(`📊 Distributing ${availableBalance.toString()} from vault ${vaultPubKey.toBase58()} to ${previousCreators.length} creators`);

    // Create distribution transactions (batch into groups)
    const BATCH_SIZE = 5; // Smaller batch to ensure we stay under transaction size limits
    const distributionResults = [];

    for (let i = 0; i < previousCreators.length; i += BATCH_SIZE) {
      const batch = previousCreators.slice(i, i + BATCH_SIZE);
      const transaction = new Transaction();

      for (let j = 0; j < batch.length; j++) {
        const creatorWallet = new PublicKey(batch[j]);

        const amount = (i === 0 && j === 0) ? amountPerCreator + remainder : amountPerCreator;
        if (amount === BigInt(0)) continue;

        // Get or create recipient token account (paid by server wallet)
        const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          serverWalletKeypair,
          tokenMintPubkey,
          creatorWallet
        );

        // Transfer from vault to recipient
        transaction.add(
          createTransferInstruction(
            vaultTokenAccount,
            recipientTokenAccount.address,
            vaultPubKey, // Owner
            amount,
            [],
            TOKEN_PROGRAM_ID
          )
        );
      }

      if (transaction.instructions.length === 0) continue;

      const { blockhash } = await connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = serverWallet;

      // Vault signs for token movement, Server Wallet signs for gas fees
      transaction.sign(vaultKeypair, serverWalletKeypair);

      const signature = await connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3,
      });

      await connection.confirmTransaction(signature, 'confirmed');

      distributionResults.push({
        transactionSignature: signature,
        recipients: batch,
        amount: (amountPerCreator * BigInt(batch.length) + (i === 0 ? remainder : BigInt(0))).toString()
      });
    }

    return NextResponse.json({
      success: true,
      message: `Distributed fees from vault to ${previousCreators.length} creators`,
      totalRecipients: previousCreators.length,
      totalAmount: availableBalance.toString(),
      distributions: distributionResults
    });

  } catch (error) {
    console.error('❌ Error distributing fees:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

/**
 * GET endpoint to check distribution status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenMint = searchParams.get('tokenMint');

    if (!tokenMint) {
      return NextResponse.json({
        success: false,
        error: 'tokenMint query parameter is required'
      }, { status: 400 });
    }

    // Get creator list from MongoDB
    const creators = await getAllCreatorsFromMongoDB();

    return NextResponse.json({
      success: true,
      totalCreators: creators.length,
      creators: creators,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error getting distribution status:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}


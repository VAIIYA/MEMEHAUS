import { NextRequest, NextResponse } from 'next/server';
import { getTokenDataFromMongoDB } from '../../../lib/mongodbStorage';
import { PriceService } from '../../../services/priceService';
import { Connection, PublicKey } from '@solana/web3.js';
import { fetchTokenMetadataFromChain } from '../../../lib/onChainMetadata';
import { BondingCurveService } from '../../../services/bondingCurveService';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { mintAddress: string } }
) {
  try {
    const { mintAddress } = params;

    if (!mintAddress) {
      return NextResponse.json(
        { success: false, error: 'Mint address is required' },
        { status: 400 }
      );
    }

    // Validate mint address format
    let mintPubkey: PublicKey;
    try {
      mintPubkey = new PublicKey(mintAddress);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid Solana address format' },
        { status: 400 }
      );
    }

    console.log('API: Fetching token data for:', mintAddress);

    // Get token data from MongoDB
    let tokenData = await getTokenDataFromMongoDB(mintAddress);

    // If MongoDB doesn't have the token or missing name/symbol, fetch from on-chain
    if (!tokenData || !tokenData.name || !tokenData.symbol || tokenData.name === 'Unknown Token' || tokenData.symbol === 'UNK') {
      console.log('API: Token not in MongoDB or missing metadata, fetching from on-chain...');
      const onChainData = await fetchTokenMetadataFromChain(mintAddress);

      if (onChainData) {
        // Merge on-chain data with MongoDB data (if exists) or create new token data
        tokenData = {
          id: tokenData?.id || `${onChainData.symbol.toLowerCase()}-${Date.now()}`,
          name: onChainData.name,
          symbol: onChainData.symbol,
          description: tokenData?.description || '',
          totalSupply: tokenData?.totalSupply || onChainData.totalSupply,
          creatorWallet: tokenData?.creatorWallet || '',
          mintAddress: mintAddress,
          tokenAccount: tokenData?.tokenAccount || '',
          initialPrice: tokenData?.initialPrice || 0,
          vestingPeriod: tokenData?.vestingPeriod || 0,
          communityFee: tokenData?.communityFee || 0,
          decimals: onChainData.decimals,
          imageUrl: tokenData?.imageUrl,
          metadataUri: tokenData?.metadataUri || '',
          tokenCreationSignature: tokenData?.tokenCreationSignature || '',
          feeTransactionSignature: tokenData?.feeTransactionSignature || '',
          createdAt: tokenData?.createdAt || new Date().toISOString(),
        };
      } else if (!tokenData) {
        // If we can't get on-chain data either, return error
        return NextResponse.json(
          { success: false, error: 'Token not found. The token may not exist on Solana.' },
          { status: 404 }
        );
      }
    }

    // Get current price and market data
    let priceData = { price: 0, priceChange24h: 0, volume24h: 0 };
    let bondingCurveData = null;

    try {
      // 1. Try Bonding Curve first
      const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
      const connection = new Connection(endpoint, 'confirmed');
      const bondingCurveService = new BondingCurveService(connection);

      try {
        const curveState = await bondingCurveService.getCurveState(mintPubkey);
        if (curveState && !curveState.complete) {
          const currentPrice = bondingCurveService.getCurrentPrice(curveState);
          priceData.price = currentPrice;
          bondingCurveData = {
            complete: false,
            liquidtyVaultSol: curveState.realSolReserves.toString(),
            liquidtyVaultTokens: curveState.realTokenReserves.toString(),
            progress: (Number(curveState.realSolReserves) / Number(BondingCurveService.SOL_GRADUATION_TARGET)) * 100
          };
        }
      } catch (curveError: any) {
        console.log('API: Token not on bonding curve or error:', curveError.message);
      }

      // 2. Fallback to Jupiter if not on bonding curve or if price is still 0
      if (priceData.price === 0) {
        const priceService = new PriceService();
        const jupPrice = await priceService.getTokenPrice(mintAddress);
        if (jupPrice) {
          priceData = jupPrice;
        }
      }
    } catch (priceError) {
      console.warn('API: Price fetch failed:', priceError);
    }

    // Get holder count
    let holders = 0;
    try {
      const holdersResponse = await fetch(
        `${request.nextUrl.origin}/api/token/holders?mintAddress=${mintAddress}`
      );
      if (holdersResponse.ok) {
        const holdersData = await holdersResponse.json();
        if (holdersData.success && holdersData.holders !== undefined) {
          holders = holdersData.holders;
        }
      }
    } catch (error) {
      console.error('API: Error fetching holders:', error);
    }

    // Calculate market cap
    let marketCap = 0;
    if (priceData.price > 0) {
      const supply = parseFloat(tokenData.totalSupply);
      marketCap = supply * priceData.price;
    }

    // Return token data with market information
    const response = {
      success: true,
      token: {
        ...tokenData,
        mint_address: tokenData.mintAddress,
        total_supply: tokenData.totalSupply,
        creator_wallet: tokenData.creatorWallet,
        token_account: tokenData.tokenAccount,
        initial_price: tokenData.initialPrice,
        vesting_period: tokenData.vestingPeriod,
        community_fee: tokenData.communityFee,
        image_url: tokenData.imageUrl,
        metadata_uri: tokenData.metadataUri || '',
        token_creation_signature: tokenData.tokenCreationSignature,
        fee_transaction_signature: tokenData.feeTransactionSignature,
        created_at: tokenData.createdAt,
        // Market data
        price: priceData.price,
        priceChange24h: priceData.priceChange24h,
        volume24h: priceData.volume24h,
        marketCap: marketCap,
        holders: holders,
        bondingCurve: bondingCurveData
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API: Error fetching token data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch token data',
      },
      { status: 500 }
    );
  }
}


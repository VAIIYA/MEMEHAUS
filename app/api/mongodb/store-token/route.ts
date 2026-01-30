import { NextRequest, NextResponse } from 'next/server';
import { storeTokenData, storeCreatorWallet } from '../../../lib/unifiedStorage';
import { TokenData } from '../../../lib/types';

export const dynamic = 'force-dynamic';

/**
 * API route to store token data in both MongoDB and Turso
 * POST /api/mongodb/store-token
 * Now uses unified storage with MongoDB primary + Turso fallback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenData, creatorWallet } = body;

    if (!tokenData) {
      return NextResponse.json({
        success: false,
        error: 'Token data is required'
      }, { status: 400 });
    }

    // Store token data in both databases
    const tokenResult = await storeTokenData(tokenData as TokenData);

    // Also store creator wallet if provided
    let creatorResult = null;
    if (creatorWallet && tokenData.mintAddress) {
      creatorResult = await storeCreatorWallet(
        creatorWallet,
        tokenData.mintAddress
      );
    }

    return NextResponse.json({
      success: tokenResult.success,
      tokenId: tokenResult.id,
      source: tokenResult.source,
      creatorStored: creatorResult?.success || false,
      creatorSource: creatorResult?.source,
      error: tokenResult.error
    });
  } catch (error) {
    console.error('Error storing token data:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

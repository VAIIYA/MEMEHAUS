import { NextRequest, NextResponse } from 'next/server';
import { getTokenDataFromMongoDB } from '../../../../lib/mongodbStorage';
import { TokenMetadata } from '../../../../lib/types';

export const dynamic = 'force-dynamic';

/**
 * API route to serve Metaplex-compliant JSON metadata for a token
 * GET /api/token/[mintAddress]/metadata
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { mintAddress: string } }
) {
    try {
        const { mintAddress } = params;

        if (!mintAddress) {
            return NextResponse.json({
                success: false,
                error: 'Mint address is required'
            }, { status: 400 });
        }

        // Fetch token data from MongoDB
        const tokenData = await getTokenDataFromMongoDB(mintAddress);

        if (!tokenData) {
            return NextResponse.json({
                success: false,
                error: 'Token metadata not found'
            }, { status: 404 });
        }

        // Format the response as Metaplex-compliant JSON metadata
        const metadata: TokenMetadata = {
            name: tokenData.name,
            symbol: tokenData.symbol,
            description: tokenData.description,
            image: tokenData.imageUrl || '',
            attributes: [
                {
                    trait_type: 'Initial Price',
                    value: tokenData.initialPrice
                },
                {
                    trait_type: 'Total Supply',
                    value: tokenData.totalSupply
                },
                {
                    trait_type: 'Created At',
                    value: tokenData.createdAt
                },
                {
                    trait_type: 'Decimals',
                    value: tokenData.decimals
                }
            ],
            properties: {
                files: [
                    {
                        type: 'image/png',
                        uri: tokenData.imageUrl || ''
                    }
                ],
                category: 'image',
                creators: [
                    {
                        address: tokenData.creatorWallet,
                        share: 100
                    }
                ]
            }
        };

        return NextResponse.json(metadata, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching token metadata:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

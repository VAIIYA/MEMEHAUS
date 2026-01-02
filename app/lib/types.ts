export interface TokenMetadata {
    name: string;
    symbol: string;
    description: string;
    image: string;
    attributes: Array<{
        trait_type: string;
        value: string | number;
    }>;
    properties: {
        files: Array<{
            type: string;
            uri: string;
        }>;
        category: string;
        creators: Array<{
            address: string;
            share: number;
        }>;
    };
}

export interface TokenData {
    id: string;
    name: string;
    symbol: string;
    description: string;
    totalSupply: string;
    creatorWallet: string;
    mintAddress: string;
    tokenAccount: string;
    initialPrice: number;
    vestingPeriod: number;
    communityFee: number;
    decimals: number;
    imageUrl?: string;
    metadataUri: string;
    tokenCreationSignature: string;
    feeTransactionSignature: string;
    createdAt: string;
}

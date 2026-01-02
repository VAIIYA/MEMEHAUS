import { uploadTokenImage, uploadTokenMetadata, testLighthouseConnection } from './lighthouse';
import { TokenMetadata } from './types';

export interface StorageProvider {
  name: string;
  uploadImage: (file: File, symbol: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  uploadMetadata: (metadata: TokenMetadata, symbol: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  testConnection: () => Promise<boolean>;
}

/**
 * Lighthouse Storage Provider
 */
export const lighthouseProvider: StorageProvider = {
  name: 'Lighthouse',
  uploadImage: async (file: File, symbol: string) => {
    try {
      const result = await uploadTokenImage(file, symbol);
      return {
        success: true,
        url: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
  uploadMetadata: async (metadata: TokenMetadata, symbol: string) => {
    try {
      const result = await uploadTokenMetadata(metadata, symbol);
      return {
        success: true,
        url: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
  testConnection: testLighthouseConnection,
};

/**
 * Available storage providers - only Lighthouse now
 */
export const storageProviders: StorageProvider[] = [
  lighthouseProvider,
];

/**
 * Get the best available storage provider
 * @returns Best available provider or null if none available
 */
export async function getBestStorageProvider(): Promise<StorageProvider | null> {
  const isAvailable = await lighthouseProvider.testConnection();
  return isAvailable ? lighthouseProvider : null;
}

/**
 * Upload token image with Lighthouse
 * @param file - Image file to upload
 * @param symbol - Token symbol
 * @returns Upload result
 */
export async function uploadTokenImageWithFallback(
  file: File,
  symbol: string
): Promise<{ success: boolean; url?: string; provider?: string; error?: string }> {
  const result = await lighthouseProvider.uploadImage(file, symbol);
  return {
    success: result.success,
    url: result.url,
    provider: lighthouseProvider.name,
    error: result.error,
  };
}

/**
 * Upload token metadata with Lighthouse
 * @param metadata - Token metadata
 * @param symbol - Token symbol
 * @returns Upload result
 */
export async function uploadTokenMetadataWithFallback(
  metadata: TokenMetadata,
  symbol: string
): Promise<{ success: boolean; url?: string; provider?: string; error?: string }> {
  const result = await lighthouseProvider.uploadMetadata(metadata, symbol);
  return {
    success: result.success,
    url: result.url,
    provider: lighthouseProvider.name,
    error: result.error,
  };
}

/**
 * Test available storage providers
 * @returns Test results
 */
export async function testAllStorageProviders(): Promise<{
  lighthouse: boolean;
}> {
  return {
    lighthouse: await lighthouseProvider.testConnection(),
  };
}

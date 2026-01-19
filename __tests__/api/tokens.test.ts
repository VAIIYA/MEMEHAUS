// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {
    url: string;
    constructor(url: string) {
      this.url = url;
    }
  },
  NextResponse: {
    json: jest.fn((data) => ({
      json: async () => data,
    })),
  },
}));

import { GET } from '../../app/api/tokens/route';

// Mock MongoDB storage
jest.mock('../../app/lib/mongodbStorage', () => ({
  listTokensFromMongoDB: jest.fn(),
}));

import { TokenData } from '../../app/lib/types';
const { listTokensFromMongoDB } = require('../../app/lib/mongodbStorage');

describe('/api/tokens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns tokens with pagination from MongoDB', async () => {
    const mockTokens = [
      {
        id: '1',
        name: 'Test Token 1',
        symbol: 'TEST1',
        totalSupply: '1000000',
        creatorWallet: 'wallet1',
        mintAddress: 'mint1',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Test Token 2',
        symbol: 'TEST2',
        totalSupply: '2000000',
        creatorWallet: 'wallet2',
        mintAddress: 'mint2',
        createdAt: new Date().toISOString(),
      },
    ];

    listTokensFromMongoDB.mockResolvedValue(mockTokens);

    const request = {
      url: 'http://localhost:3000/api/tokens?page=0&limit=2',
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.tokens).toHaveLength(2);
    expect(data.pagination.page).toBe(0);
    expect(data.pagination.limit).toBe(2);
    expect(data.stats.totalTokens).toBe(2);
  });

  it('handles empty results from MongoDB gracefully', async () => {
    listTokensFromMongoDB.mockResolvedValue([]);

    const request = {
      url: 'http://localhost:3000/api/tokens',
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.tokens).toEqual([]);
    expect(data.stats.totalTokens).toBe(0);
  });

  it('handles errors from MongoDB gracefully', async () => {
    listTokensFromMongoDB.mockRejectedValue(new Error('MongoDB connection failed'));

    const request = {
      url: 'http://localhost:3000/api/tokens',
    } as any;
    const response = await GET(request);
    const data = await response.json();

    // The route is designed to return an empty array on error rather than failing
    expect(data.success).toBe(true);
    expect(data.tokens).toEqual([]);
    expect(data.error).toBeDefined();
  });
});

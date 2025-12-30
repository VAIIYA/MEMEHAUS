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

// Mock GitHub storage
jest.mock('../../app/lib/githubOnlyStorage', () => ({
  listTokens: jest.fn(),
}));

const { listTokens } = require('../../app/lib/githubOnlyStorage');

describe('/api/tokens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns tokens with pagination', async () => {
    const mockTokens = [
      {
        id: '1',
        name: 'Test Token 1',
        symbol: 'TEST1',
        totalSupply: '1000000',
        creatorWallet: 'wallet1',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Test Token 2',
        symbol: 'TEST2',
        totalSupply: '2000000',
        creatorWallet: 'wallet2',
        createdAt: new Date().toISOString(),
      },
    ];

    listTokens.mockResolvedValue(mockTokens);

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

  it('handles pagination correctly', async () => {
    const mockTokens = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      name: `Token ${i}`,
      symbol: `T${i}`,
      totalSupply: '1000000',
      creatorWallet: `wallet${i}`,
      createdAt: new Date().toISOString(),
    }));

    listTokens.mockResolvedValue(mockTokens);

    const request = {
      url: 'http://localhost:3000/api/tokens?page=1&limit=5',
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.tokens).toHaveLength(5);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(5);
  });

  it('returns error response when listTokens fails', async () => {
    listTokens.mockRejectedValue(new Error('GitHub connection failed'));

    const request = {
      url: 'http://localhost:3000/api/tokens',
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
    expect(data.tokens).toEqual([]);
  });

  it('calculates platform stats correctly', async () => {
    const mockTokens = [
      {
        id: '1',
        name: 'Token 1',
        symbol: 'T1',
        creatorWallet: 'wallet1',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Token 2',
        symbol: 'T2',
        creatorWallet: 'wallet1', // Same wallet
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Token 3',
        symbol: 'T3',
        creatorWallet: 'wallet2',
        createdAt: new Date().toISOString(),
      },
    ];

    listTokens.mockResolvedValue(mockTokens);

    const request = {
      url: 'http://localhost:3000/api/tokens',
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(data.stats.totalTokens).toBe(3);
    expect(data.stats.totalUsers).toBe(2); // 2 unique wallets
  });

  it('uses default pagination when not provided', async () => {
    listTokens.mockResolvedValue([]);

    const request = {
      url: 'http://localhost:3000/api/tokens',
    } as any;
    const response = await GET(request);
    const data = await response.json();

    expect(data.pagination.page).toBe(0);
    expect(data.pagination.limit).toBe(10);
  });
});


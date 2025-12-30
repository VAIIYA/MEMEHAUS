import { renderHook, waitFor } from '@testing-library/react';
import { useTokenCreation } from '../../app/hooks/useTokenCreation';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Mock wallet adapter
jest.mock('@solana/wallet-adapter-react', () => ({
  useWallet: jest.fn(),
  useConnection: jest.fn(),
}));

jest.mock('../../app/lib/rpcTest', () => ({
  getBestRPCEndpoint: jest.fn().mockResolvedValue('https://api.mainnet-beta.solana.com'),
  testCurrentConnection: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../app/services/tokenService');

describe('useTokenCreation', () => {
  const mockSignTransaction = jest.fn();
  const mockPublicKey = { toBase58: () => 'test-wallet-address' };

  beforeEach(() => {
    jest.clearAllMocks();

    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: mockPublicKey,
      signTransaction: mockSignTransaction,
    });

    (useConnection as jest.Mock).mockReturnValue({
      connection: {
        rpcEndpoint: 'https://api.mainnet-beta.solana.com',
      },
    });
  });

  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useTokenCreation());

    expect(result.current.isCreating).toBe(false);
    expect(result.current.creationResult).toBeNull();
    expect(result.current.estimatedCost).toBe(0);
    expect(result.current.canCreate).toBe(true);
  });

  it('returns canCreate as false when wallet is not connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: false,
      publicKey: null,
      signTransaction: null,
    });

    const { result } = renderHook(() => useTokenCreation());

    expect(result.current.canCreate).toBe(false);
  });

  it('returns canCreate as false when publicKey is missing', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: null,
      signTransaction: mockSignTransaction,
    });

    const { result } = renderHook(() => useTokenCreation());

    expect(result.current.canCreate).toBe(false);
  });

  it('returns canCreate as false when signTransaction is missing', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: mockPublicKey,
      signTransaction: null,
    });

    const { result } = renderHook(() => useTokenCreation());

    expect(result.current.canCreate).toBe(false);
  });

  it('resets creation state', () => {
    const { result } = renderHook(() => useTokenCreation());

    result.current.resetCreation();

    expect(result.current.creationResult).toBeNull();
    expect(result.current.estimatedCost).toBe(0);
  });
});


import { SwapService, SwapParams } from '../../app/services/swapService';
import { Connection } from '@solana/web3.js';

// Mock dependencies
jest.mock('../../app/services/priceService');
jest.mock('../../app/services/tokenService');

describe('SwapService', () => {
  let service: SwapService;

  beforeEach(() => {
    service = new SwapService('https://api.mainnet-beta.solana.com');
  });

  describe('validateSwapParams', () => {
    it('validates correct swap parameters', () => {
      const params: SwapParams = {
        inputMint: 'So11111111111111111111111111111111111111112',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        inputAmount: '1000000',
        slippageBps: 50, // 0.5%
        userPublicKey: 'test-public-key',
      };

      const result = service.validateSwapParams(params);
      expect(result.valid).toBe(true);
    });

    it('rejects missing input mint', () => {
      const params: SwapParams = {
        inputMint: '',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        inputAmount: '1000000',
        slippageBps: 50,
        userPublicKey: 'test-public-key',
      };

      const result = service.validateSwapParams(params);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('rejects same input and output mints', () => {
      const params: SwapParams = {
        inputMint: 'So11111111111111111111111111111111111111112',
        outputMint: 'So11111111111111111111111111111111111111112',
        inputAmount: '1000000',
        slippageBps: 50,
        userPublicKey: 'test-public-key',
      };

      const result = service.validateSwapParams(params);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('different');
    });

    it('rejects zero input amount', () => {
      const params: SwapParams = {
        inputMint: 'So11111111111111111111111111111111111111112',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        inputAmount: '0',
        slippageBps: 50,
        userPublicKey: 'test-public-key',
      };

      const result = service.validateSwapParams(params);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('greater than 0');
    });

    it('rejects invalid slippage', () => {
      const params: SwapParams = {
        inputMint: 'So11111111111111111111111111111111111111112',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        inputAmount: '1000000',
        slippageBps: 0,
        userPublicKey: 'test-public-key',
      };

      const result = service.validateSwapParams(params);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('slippage');
    });
  });

  describe('formatSlippage', () => {
    it('formats slippage from basis points to percentage', () => {
      expect(service.formatSlippage(50)).toBe('0.50'); // 0.5%
      expect(service.formatSlippage(100)).toBe('1.00'); // 1%
      expect(service.formatSlippage(500)).toBe('5.00'); // 5%
    });
  });

  describe('percentageToBps', () => {
    it('converts percentage to basis points', () => {
      expect(service.percentageToBps(0.5)).toBe(50);
      expect(service.percentageToBps(1)).toBe(100);
      expect(service.percentageToBps(5)).toBe(500);
    });
  });

  describe('calculatePriceImpact', () => {
    it('calculates price impact correctly', () => {
      const quote = {
        inputAmount: '1000000',
        outputAmount: '950000',
        priceImpact: 5.0,
      } as any;

      const impact = service.calculatePriceImpact(quote);
      expect(impact).toBe(5.0);
    });

    it('returns 0 for invalid quote', () => {
      expect(service.calculatePriceImpact(null as any)).toBe(0);
      expect(service.calculatePriceImpact({ inputAmount: '0' } as any)).toBe(0);
    });
  });
});


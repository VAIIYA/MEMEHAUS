import { FeeService } from '../../app/services/feeService';
import { PublicKey } from '@solana/web3.js';

describe('FeeService', () => {
  describe('calculateDeveloperFee', () => {
    it('calculates developer fee correctly (0.1%)', () => {
      const amount = 1000;
      const result = FeeService.calculateDeveloperFee(amount, 6);

      expect(result.developerFee).toBe(0.1); // 0.1%
      expect(result.developerFeeAmount).toBe(1); // 0.1% of 1000
      expect(result.totalFee).toBe(1);
      expect(result.netAmount).toBe(999);
    });

    it('handles zero amount', () => {
      const result = FeeService.calculateDeveloperFee(0, 6);

      expect(result.developerFeeAmount).toBe(0);
      expect(result.totalFee).toBe(0);
      expect(result.netAmount).toBe(0);
    });

    it('handles different decimals', () => {
      const amount = 1000000; // 1 token with 6 decimals
      const result = FeeService.calculateDeveloperFee(amount, 6);

      expect(result.developerFeeAmount).toBe(1000); // 0.1% of 1M
      expect(result.netAmount).toBe(999000);
    });
  });

  describe('getDeveloperWallet', () => {
    it('returns correct developer wallet address', () => {
      const wallet = FeeService.getDeveloperWallet();
      
      expect(wallet).toBeInstanceOf(PublicKey);
      expect(wallet.toBase58()).toBe('EpfmoiBoNFEofbACjZo1vpyqXUy5Fq9ZtPrGVwok5fb3');
    });
  });

  describe('getDeveloperFeeRate', () => {
    it('returns fee rate as percentage', () => {
      const rate = FeeService.getDeveloperFeeRate();
      
      expect(rate).toBe(0.1); // 0.1%
    });
  });

  describe('formatFeeAmount', () => {
    it('formats fee amount with default decimals', () => {
      const formatted = FeeService.formatFeeAmount(1.234567);
      
      expect(formatted).toBe('1.234567');
    });

    it('formats fee amount with custom decimals', () => {
      const formatted = FeeService.formatFeeAmount(1.234567, 2);
      
      expect(formatted).toBe('1.23');
    });
  });

  describe('calculateFeeUSD', () => {
    it('calculates fee in USD correctly', () => {
      const tokenAmount = 1000;
      const tokenPrice = 0.5; // $0.50 per token
      const feeUSD = FeeService.calculateFeeUSD(tokenAmount, tokenPrice);
      
      // 0.1% of 1000 tokens * $0.50 = $0.50
      expect(feeUSD).toBe(0.5);
    });

    it('handles zero token amount', () => {
      const feeUSD = FeeService.calculateFeeUSD(0, 0.5);
      
      expect(feeUSD).toBe(0);
    });
  });
});


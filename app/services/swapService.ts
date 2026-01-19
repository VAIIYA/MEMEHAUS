import { Connection, PublicKey, Transaction, VersionedTransaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { PriceService, SwapQuote } from './priceService';
import { TokenService } from './tokenService';
import { BondingCurveService } from './bondingCurveService';
import { PDAService } from '../lib/pdaService';

export interface SwapParams {
  inputMint: string;
  outputMint: string;
  inputAmount: string;
  slippageBps: number;
  userPublicKey: string;
}

export interface SwapResult {
  success: boolean;
  transactionSignature?: string;
  error?: string;
  quote?: SwapQuote;
}

export class SwapService {
  private connection: Connection;
  private priceService: PriceService;
  private bondingCurveService: BondingCurveService;

  constructor(endpoint: string) {
    this.connection = new Connection(endpoint, 'confirmed');
    this.priceService = new PriceService();
    this.bondingCurveService = new BondingCurveService(this.connection);
  }

  async executeSwap(
    params: SwapParams,
    signTransaction: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>
  ): Promise<SwapResult> {
    try {
      console.log('Starting swap execution...', params);

      // Check if this is a bonding curve swap
      const isSOLInput = params.inputMint === 'So11111111111111111111111111111111111111112';
      const tokenMint = isSOLInput ? params.outputMint : params.inputMint;

      try {
        const mintPubkey = new PublicKey(tokenMint);
        const curveState = await this.bondingCurveService.getCurveState(mintPubkey);

        if (!curveState.complete) {
          console.log('Executing bonding curve swap');

          if (isSOLInput) {
            // SOL -> Token (Buy)
            const liquidityVaultSolAccount = await PDAService.getLiquidityVaultPublicKey(mintPubkey);

            const transaction = new Transaction().add(
              SystemProgram.transfer({
                fromPubkey: new PublicKey(params.userPublicKey),
                toPubkey: liquidityVaultSolAccount,
                lamports: BigInt(params.inputAmount),
              })
            );

            const { blockhash } = await this.connection.getLatestBlockhash('confirmed');
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = new PublicKey(params.userPublicKey);

            const signedTransaction = await signTransaction(transaction);
            const signature = await this.connection.sendRawTransaction(
              (signedTransaction as Transaction).serialize(),
              { skipPreflight: false, preflightCommitment: 'confirmed' }
            );

            console.log('Bonding curve buy transaction sent:', signature);
            const confirmed = await TokenService.confirmTransactionRobust(this.connection, signature, 30);

            if (!confirmed) {
              return { success: false, error: 'Transaction not confirmed', transactionSignature: signature };
            }

            // Trigger token distribution server-side (optional/mocked for now)
            // In a real app, a backend listener would detect this and send tokens

            return { success: true, transactionSignature: signature };
          } else {
            // Token -> SOL (Sell)
            // Selling tokens on the bonding curve requires sending tokens to the vault
            // and the vault sending SOL back. This usually needs a program or server-side execution.
            return { success: false, error: 'Selling tokens on bonding curve is not yet implemented' };
          }
        }
      } catch (curveError) {
        console.log('Not a bonding curve token or error, falling back to Jupiter:', curveError);
      }

      // Step 1: Get swap quote from Jupiter (via PriceService)
      const quote = await this.priceService.getSwapQuote(
        params.inputMint,
        params.outputMint,
        params.inputAmount,
        params.slippageBps
      );

      if (!quote) {
        return {
          success: false,
          error: 'Failed to get swap quote'
        };
      }

      console.log('Swap quote received:', quote);

      // Step 2: Get swap transaction
      const swapTransaction = await this.priceService.getSwapTransaction(quote);

      if (!swapTransaction) {
        return {
          success: false,
          error: 'Failed to get swap transaction'
        };
      }

      console.log('Swap transaction received');

      // Step 3: Deserialize and sign transaction
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(swapTransaction, 'base64')
      );

      // Step 4: Sign the transaction
      const signedTransaction = await signTransaction(transaction);

      console.log('Transaction signed, sending to network...');

      // Step 5: Send transaction
      const signature = await this.connection.sendTransaction(signedTransaction as VersionedTransaction, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3
      });

      console.log('Transaction sent, signature:', signature);

      // Step 6: Wait for confirmation using robust polling
      const confirmed = await TokenService.confirmTransactionRobust(this.connection, signature, 30);

      if (!confirmed) {
        return {
          success: false,
          error: 'Transaction was not confirmed within the timeout period',
          quote
        };
      }

      console.log('Swap completed successfully!');

      return {
        success: true,
        transactionSignature: signature,
        quote
      };

    } catch (error) {
      console.error('Swap execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getSwapPreview(params: SwapParams): Promise<SwapQuote | null> {
    try {
      // Check if this is a bonding curve swap
      // We assume it's a bonding curve swap if it involves a MemeHaus token that hasn't graduated
      // For now, let's treat any swap involving a token where we can find a Liquidity Vault 
      // and it has tokens as a bonding curve candidate.

      const isSOLInput = params.inputMint === 'So11111111111111111111111111111111111111112';
      const tokenMint = isSOLInput ? params.outputMint : params.inputMint;

      try {
        const mintPubkey = new PublicKey(tokenMint);
        const curveState = await this.bondingCurveService.getCurveState(mintPubkey);

        if (!curveState.complete) {
          console.log('Using bonding curve for swap preview');
          const inputAmountBI = BigInt(params.inputAmount);

          let outputAmount: bigint;
          let priceImpact: number;

          if (isSOLInput) {
            // SOL -> Token (Buy)
            outputAmount = this.bondingCurveService.getAmountOut(inputAmountBI, curveState);
            const currentPrice = this.bondingCurveService.getCurrentPrice(curveState);
            const executionPrice = Number(inputAmountBI) / Number(outputAmount);
            priceImpact = ((executionPrice - currentPrice) / currentPrice) * 100;
          } else {
            // Token -> SOL (Sell)
            outputAmount = this.bondingCurveService.getSolOut(inputAmountBI, curveState);
            const currentPrice = this.bondingCurveService.getCurrentPrice(curveState);
            const executionPrice = Number(outputAmount) / Number(inputAmountBI);
            priceImpact = ((currentPrice - executionPrice) / currentPrice) * 100;
          }

          return {
            inputMint: params.inputMint,
            outputMint: params.outputMint,
            inputAmount: params.inputAmount,
            outputAmount: outputAmount.toString(),
            priceImpact,
            fee: 0, // Fee logic can be added later
            routes: [], // No routes for bonding curve
            swapTransaction: '' // Will be generated in executeSwap
          };
        }
      } catch (curveError) {
        console.log('Not a bonding curve token or error fetching state, falling back to Jupiter:', curveError);
      }

      // Fallback to Jupiter
      return await this.priceService.getSwapQuote(
        params.inputMint,
        params.outputMint,
        params.inputAmount,
        params.slippageBps
      );
    } catch (error) {
      console.error('Error getting swap preview:', error);
      return null;
    }
  }

  async getExchangeRate(inputMint: string, outputMint: string): Promise<number> {
    return await this.priceService.getExchangeRate(inputMint, outputMint);
  }

  // Validate swap parameters
  validateSwapParams(params: SwapParams): { valid: boolean; error?: string } {
    if (!params.inputMint || !params.outputMint) {
      return { valid: false, error: 'Input and output mints are required' };
    }

    if (params.inputMint === params.outputMint) {
      return { valid: false, error: 'Input and output tokens must be different' };
    }

    if (!params.inputAmount || parseFloat(params.inputAmount) <= 0) {
      return { valid: false, error: 'Input amount must be greater than 0' };
    }

    if (!params.userPublicKey) {
      return { valid: false, error: 'User public key is required' };
    }

    if (params.slippageBps < 1 || params.slippageBps > 10000) {
      return { valid: false, error: 'Slippage must be between 0.01% and 100%' };
    }

    return { valid: true };
  }

  // Calculate price impact
  calculatePriceImpact(quote: SwapQuote): number {
    if (!quote || parseFloat(quote.inputAmount) === 0) {
      return 0;
    }

    return Math.abs(quote.priceImpact);
  }

  // Format slippage from basis points to percentage
  formatSlippage(slippageBps: number): string {
    return (slippageBps / 100).toFixed(2);
  }

  // Convert percentage to basis points
  percentageToBps(percentage: number): number {
    return Math.round(percentage * 100);
  }
} 
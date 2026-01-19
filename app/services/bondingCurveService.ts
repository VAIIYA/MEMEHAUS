import { Connection, PublicKey } from '@solana/web3.js';
import { getAccount } from '@solana/spl-token';
import { PDAService } from '../lib/pdaService';

export interface BondingCurveState {
  virtualSolReserves: bigint;
  virtualTokenReserves: bigint;
  realSolReserves: bigint;
  realTokenReserves: bigint;
  tokenTotalSupply: bigint;
  complete: boolean;
}

/**
 * BondingCurveService implements the virtual constant product market maker (VCPMM)
 * logic used for token pricing before graduation to Raydium.
 */
export class BondingCurveService {
  // Constant values used by pump.fun-style curves
  // Initial Virtual SOL: 30 SOL
  public static readonly INITIAL_VIRTUAL_SOL = BigInt(30 * 1_000_000_000); // 30 SOL in lamports
  
  // Total tokens in bonding curve: 700M (70% of 1B)
  public static readonly REAL_TOKEN_RESERVE = BigInt(700_000_000 * 1_000_000_000); // 700M with 9 decimals
  
  // SOL needed to graduate: 80 SOL
  public static readonly SOL_GRADUATION_TARGET = BigInt(80 * 1_000_000_000); // 80 SOL in lamports
  
  /**
   * Initial Virtual Tokens: 962,500,000
   * This value is calculated such that when 700M tokens are sold, 80 SOL is raised.
   * (30 + 80) = (30 * Tv0) / (Tv0 - 700M) => Tv0 = 962.5M
   */
  public static readonly INITIAL_VIRTUAL_TOKENS = BigInt(962_500_000 * 1_000_000_000);
  
  public static readonly K = BondingCurveService.INITIAL_VIRTUAL_SOL * BondingCurveService.INITIAL_VIRTUAL_TOKENS;

  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Get the current state of the bonding curve for a token
   */
  async getCurveState(mintAddress: PublicKey): Promise<BondingCurveState> {
    const liquidityVaultTokenAccount = await PDAService.getLiquidityVaultTokenAccount(mintAddress);
    const liquidityVaultSolAccount = await PDAService.getLiquidityVaultPublicKey(mintAddress);
    
    // Fetch remaining tokens in vault
    const tokenAccount = await getAccount(this.connection, liquidityVaultTokenAccount);
    const realTokenReserves = tokenAccount.amount;
    
    // Fetch SOL raised in vault
    const realSolReserves = BigInt(await this.connection.getBalance(liquidityVaultSolAccount));
    
    const tokensSold = BondingCurveService.REAL_TOKEN_RESERVE - realTokenReserves;
    const virtualTokenReserves = BondingCurveService.INITIAL_VIRTUAL_TOKENS - tokensSold;
    const virtualSolReserves = BondingCurveService.K / virtualTokenReserves;
    
    return {
      virtualSolReserves,
      virtualTokenReserves,
      realSolReserves,
      realTokenReserves,
      tokenTotalSupply: BigInt(1_000_000_000 * 1_000_000_000),
      complete: realSolReserves >= BondingCurveService.SOL_GRADUATION_TARGET
    };
  }

  /**
   * Calculate tokens out for a given SOL input
   */
  getAmountOut(solIn: bigint, state: BondingCurveState): bigint {
    const newVirtualSolReserves = state.virtualSolReserves + solIn;
    const newVirtualTokenReserves = BondingCurveService.K / newVirtualSolReserves;
    const tokensOut = state.virtualTokenReserves - newVirtualTokenReserves;
    
    // Cannot buy more than what's left in the curve
    return tokensOut > state.realTokenReserves ? state.realTokenReserves : tokensOut;
  }

  /**
   * Calculate SOL out for a given token input
   */
  getSolOut(tokensIn: bigint, state: BondingCurveState): bigint {
    const newVirtualTokenReserves = state.virtualTokenReserves + tokensIn;
    const newVirtualSolReserves = BondingCurveService.K / newVirtualTokenReserves;
    const solOut = state.virtualSolReserves - newVirtualSolReserves;
    
    // Fee deduction would happen here or in the swap service
    return solOut;
  }

  /**
   * Calculate current price in SOL per token
   */
  getCurrentPrice(state: BondingCurveState): number {
    return Number(state.virtualSolReserves) / Number(state.virtualTokenReserves);
  }
}

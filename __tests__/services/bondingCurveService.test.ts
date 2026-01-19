import { BondingCurveService } from '../../app/services/bondingCurveService';
import { Connection, PublicKey } from '@solana/web3.js';
import { PDAService } from '../../app/lib/pdaService';

// Mock dependencies
jest.mock('../../app/lib/pdaService');
jest.mock('@solana/spl-token', () => ({
    getAccount: jest.fn(),
    TOKEN_PROGRAM_ID: new (require('@solana/web3.js').PublicKey)('TokenkegQFEZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
}));

describe('BondingCurveService', () => {
    let service: BondingCurveService;
    let mockConnection: jest.Mocked<Connection>;
    const mockMint = new PublicKey('Mint111111111111111111111111111111111111111');

    beforeEach(() => {
        mockConnection = {
            getBalance: jest.fn(),
            getAccountInfo: jest.fn(),
        } as any;
        service = new BondingCurveService(mockConnection);

        (PDAService.getLiquidityVaultTokenAccount as jest.Mock).mockResolvedValue(new PublicKey('VaultToken1111111111111111111111111111111'));
        (PDAService.getLiquidityVaultPublicKey as jest.Mock).mockResolvedValue(new PublicKey('VaultSol11111111111111111111111111111111'));
    });

    describe('getCurveState', () => {
        it('calculates curve state correctly at start', async () => {
            const { getAccount } = require('@solana/spl-token');
            getAccount.mockResolvedValue({
                amount: BondingCurveService.REAL_TOKEN_RESERVE,
            });
            mockConnection.getBalance.mockResolvedValue(0);

            const state = await service.getCurveState(mockMint);

            expect(state.virtualSolReserves).toBe(BondingCurveService.INITIAL_VIRTUAL_SOL);
            expect(state.virtualTokenReserves).toBe(BondingCurveService.INITIAL_VIRTUAL_TOKENS);
            expect(state.realTokenReserves).toBe(BondingCurveService.REAL_TOKEN_RESERVE);
            expect(state.complete).toBe(false);
        });

        it('calculates curve state correctly after some sales', async () => {
            const tokensSold = BigInt(100_000_000 * 1_000_000_000); // 100M sold
            const remainingTokens = BondingCurveService.REAL_TOKEN_RESERVE - tokensSold;

            const { getAccount } = require('@solana/spl-token');
            getAccount.mockResolvedValue({
                amount: remainingTokens,
            });
            mockConnection.getBalance.mockResolvedValue(5_000_000_000); // 5 SOL raised

            const state = await service.getCurveState(mockMint);

            expect(state.virtualTokenReserves).toBe(BondingCurveService.INITIAL_VIRTUAL_TOKENS - tokensSold);
            expect(state.virtualSolReserves).toBe(BondingCurveService.K / state.virtualTokenReserves);
        });
    });

    describe('getAmountOut', () => {
        it('calculates tokens out for SOL in', () => {
            const state = {
                virtualSolReserves: BondingCurveService.INITIAL_VIRTUAL_SOL,
                virtualTokenReserves: BondingCurveService.INITIAL_VIRTUAL_TOKENS,
                realSolReserves: BigInt(0),
                realTokenReserves: BondingCurveService.REAL_TOKEN_RESERVE,
                tokenTotalSupply: BigInt(1_000_000_000 * 1_000_000_000),
                complete: false,
            };

            const solIn = BigInt(1_000_000_000); // 1 SOL
            const tokensOut = service.getAmountOut(solIn, state);

            // S_v_new = 31 SOL
            // T_v_new = K / 31
            // tokensOut = T_v_old - T_v_new
            const expectedNewTokens = BondingCurveService.K / (BondingCurveService.INITIAL_VIRTUAL_SOL + solIn);
            const expectedTokensOut = BondingCurveService.INITIAL_VIRTUAL_TOKENS - expectedNewTokens;

            expect(tokensOut).toBe(expectedTokensOut);
        });
    });

    describe('getSolOut', () => {
        it('calculates SOL out for tokens in', () => {
            const tokensIn = BigInt(10_000_000 * 1_000_000_000); // 10M tokens
            const state = {
                virtualSolReserves: BondingCurveService.INITIAL_VIRTUAL_SOL + BigInt(5_000_000_000), // Some tokens already sold
                virtualTokenReserves: BondingCurveService.INITIAL_VIRTUAL_TOKENS - BigInt(40_000_000 * 1_000_000_000),
                realSolReserves: BigInt(5_000_000_000),
                realTokenReserves: BondingCurveService.REAL_TOKEN_RESERVE - BigInt(40_000_000 * 1_000_000_000),
                tokenTotalSupply: BigInt(1_000_000_000 * 1_000_000_000),
                complete: false,
            };

            const solOut = service.getSolOut(tokensIn, state);

            const expectedNewTokens = state.virtualTokenReserves + tokensIn;
            const expectedNewSol = BondingCurveService.K / expectedNewTokens;
            const expectedSolOut = state.virtualSolReserves - expectedNewSol;

            expect(solOut).toBe(expectedSolOut);
        });
    });
});

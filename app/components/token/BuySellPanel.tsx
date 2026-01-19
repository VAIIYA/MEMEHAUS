'use client';

import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowUpDown, Settings } from 'lucide-react';
import { useSwap } from '../../hooks/useSwap';
import { SwapToken } from '../../hooks/useSwap';

interface BuySellPanelProps {
  tokenMint: string;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: number;
}

export const BuySellPanel: React.FC<BuySellPanelProps> = ({
  tokenMint,
  tokenSymbol,
  tokenName,
  tokenDecimals,
}) => {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const {
    swapState,
    setFromToken,
    setToToken,
    setFromAmount,
    setSlippage,
    executeSwap,
    canSwap,
    isExecuting,
    formatPrice,
    formatBalance,
    loadUserTokens,
    loadMemeHausTokens,
    userTokens,
    memeHausTokens,
  } = useSwap();

  // Load MemeHaus tokens when component mounts to ensure token is available for swapping
  React.useEffect(() => {
    loadMemeHausTokens();
  }, [loadMemeHausTokens]);

  // Set tokens based on buy/sell
  React.useEffect(() => {
    if (connected) {
      loadUserTokens();
    }
  }, [connected, loadUserTokens]);

  // Setup tokens when tab or token changes
  React.useEffect(() => {
    if (!connected) return;

    const setupTokens = async () => {
      try {
        // Ensure tokens are loaded
        if (userTokens.length === 0) {
          await loadUserTokens();
        }

        // Find SOL token from loaded user tokens (has actual balance)
        const solTokenFromUser = userTokens.find(
          t => t.mint === 'So11111111111111111111111111111111111111112'
        );

        console.log('SOL token from userTokens:', solTokenFromUser);

        // Use actual SOL token if found, otherwise create default
        const SOL_TOKEN: SwapToken = solTokenFromUser || {
          mint: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL',
          name: 'Solana',
          balance: '0',
          price: 0,
          priceChange24h: 0,
          decimals: 9,
        };

        // Find the target token from MemeHaus tokens or user tokens
        const targetTokenFromMemeHaus: SwapToken | undefined = memeHausTokens.find((t: SwapToken) => t.mint === tokenMint);
        const targetTokenFromUser: SwapToken | undefined = userTokens.find((t: SwapToken) => t.mint === tokenMint);

        // Use token from MemeHaus list (has price) or user tokens (has balance), or create default
        const userBalance = targetTokenFromUser ? targetTokenFromUser.balance : '0';
        const memeHausPrice = targetTokenFromMemeHaus ? targetTokenFromMemeHaus.price : 0;
        const memeHausPriceChange = targetTokenFromMemeHaus ? targetTokenFromMemeHaus.priceChange24h : 0;

        const TOKEN: SwapToken = targetTokenFromMemeHaus || targetTokenFromUser || {
          mint: tokenMint,
          symbol: tokenSymbol,
          name: tokenName,
          balance: userBalance,
          price: memeHausPrice,
          priceChange24h: memeHausPriceChange,
          decimals: tokenDecimals,
        };

        console.log('Setting up tokens - SOL balance:', SOL_TOKEN.balance, 'Token:', TOKEN.symbol);

        if (activeTab === 'buy') {
          // Buying: SOL -> Token
          setFromToken(SOL_TOKEN);
          setToToken(TOKEN);
        } else {
          // Selling: Token -> SOL
          setFromToken(TOKEN);
          setToToken(SOL_TOKEN);
        }
      } catch (error) {
        console.error('Error setting up tokens:', error);
      }
    };

    setupTokens();
  }, [activeTab, tokenMint, tokenSymbol, tokenName, tokenDecimals, connected, setFromToken, setToToken, loadUserTokens, userTokens, memeHausTokens]);

  // Update SOL balance when userTokens updates (in case balance loads after initial setup)
  React.useEffect(() => {
    if (!connected || activeTab !== 'buy') return;

    const solTokenFromUser = userTokens.find(
      t => t.mint === 'So11111111111111111111111111111111111111112'
    );

    if (solTokenFromUser && swapState.fromToken?.mint === 'So11111111111111111111111111111111111111112') {
      // Update the fromToken (SOL) with the actual balance
      if (swapState.fromToken.balance !== solTokenFromUser.balance) {
        console.log('Updating SOL balance from', swapState.fromToken.balance, 'to', solTokenFromUser.balance);
        setFromToken(solTokenFromUser);
      }
    }
  }, [userTokens, connected, activeTab, swapState.fromToken, setFromToken]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setFromAmount(value);
  };

  const handleSwap = async () => {
    if (!canSwap) return;
    const result = await executeSwap();
    if (result.success) {
      setAmount('');
      // Show success message
    }
  };

  const slippage = swapState.slippageBps / 100;

  if (!connected) {
    return (
      <div className="bg-white rounded-2xl border border-metamask-gray-100 p-6 shadow-sm">
        <p className="text-gray-500 mb-6 font-metamask text-sm text-center">Connect your secure wallet to trade {tokenSymbol}</p>
        <WalletMultiButton className="w-full !bg-metamask-purple hover:!bg-metamask-purple/90 !rounded-full !py-6 !font-metamask !font-bold transition-all shadow-lg !border-none" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-metamask-gray-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex space-x-1 bg-metamask-gray-50 rounded-full p-1">
          <button
            onClick={() => setActiveTab('buy')}
            className={`px-6 py-2 rounded-full font-metamask font-bold transition-all text-sm ${activeTab === 'buy'
                ? 'bg-metamask-orange text-white shadow-md'
                : 'text-gray-500 hover:text-metamask-purple'
              }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`px-6 py-2 rounded-full font-metamask font-bold transition-all text-sm ${activeTab === 'sell'
                ? 'bg-metamask-purple text-white shadow-md'
                : 'text-gray-500 hover:text-metamask-purple'
              }`}
          >
            Sell
          </button>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-metamask-gray-100 rounded-full transition-colors text-gray-400 hover:text-metamask-purple"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="bg-metamask-gray-50 rounded-2xl p-4 mb-6 border border-metamask-gray-100">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Slippage Tolerance</label>
          <div className="flex space-x-2">
            {[0.1, 0.5, 1.0].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value * 100)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${slippage === value
                    ? 'bg-metamask-purple text-white shadow-sm'
                    : 'bg-white text-gray-500 border border-metamask-gray-100 hover:border-metamask-purple/30'
                  }`}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* From Token */}
      <div className="bg-metamask-gray-50 rounded-2xl p-5 mb-4 border border-metamask-gray-100 group focus-within:border-metamask-orange/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spend Amount</span>
          {swapState.fromToken && (
            <span className="text-[10px] font-bold text-metamask-purple">
              Balance: {formatBalance(parseFloat(swapState.fromToken.balance), swapState.fromToken.decimals)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full border border-metamask-gray-100 flex items-center justify-center font-metamask-heading font-black text-metamask-purple shadow-sm">
            {swapState.fromToken?.symbol?.[0] || '?'}
          </div>
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="flex-1 bg-transparent text-3xl font-metamask-heading font-black text-metamask-purple outline-none placeholder:text-gray-200"
            min="0"
            step="any"
          />
          <div className="text-right">
            <div className="flex flex-col items-end">
              <span className="font-metamask font-black text-metamask-purple">{swapState.fromToken?.symbol || 'Select'}</span>
              <span className="text-xs text-gray-400 font-medium">
                ${swapState.fromToken ? formatPrice(swapState.fromToken.price, swapState.fromToken.decimals) : '0.00'}
              </span>
              {swapState.fromToken && parseFloat(swapState.fromToken.balance) > 0 && (
                <button
                  onClick={() => {
                    const maxBalance = parseFloat(swapState.fromToken!.balance);
                    handleAmountChange(maxBalance.toString());
                  }}
                  className="mt-1 px-3 py-1 text-[10px] font-black bg-metamask-orange/10 hover:bg-metamask-orange/20 text-metamask-orange rounded-full transition-colors uppercase tracking-widest"
                >
                  MAX
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center -my-3 relative z-10">
        <div className="p-3 bg-white border border-metamask-gray-100 rounded-full shadow-lg text-metamask-purple hover:scale-110 transition-transform cursor-pointer">
          <ArrowUpDown className="w-5 h-5" />
        </div>
      </div>

      {/* To Token */}
      <div className="bg-metamask-gray-50 rounded-2xl p-5 mb-6 border border-metamask-gray-100 group transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Receive Estimate</span>
          {swapState.toToken && (
            <span className="text-[10px] font-bold text-metamask-purple">
              Owned: {formatBalance(parseFloat(swapState.toToken.balance), swapState.toToken.decimals)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full border border-metamask-gray-100 flex items-center justify-center font-metamask-heading font-black text-metamask-orange shadow-sm">
            {swapState.toToken?.symbol?.[0] || '?'}
          </div>
          <div className="flex-1">
            <div className="text-3xl font-metamask-heading font-black text-metamask-purple">
              {swapState.toAmount ? formatBalance(parseFloat(swapState.toAmount), swapState.toToken?.decimals || 9) : '0.0'}
            </div>
          </div>
          <div className="text-right">
            <div className="flex flex-col items-end">
              <span className="font-metamask font-black text-metamask-purple">{swapState.toToken?.symbol || 'Select'}</span>
              <span className="text-xs text-gray-400 font-medium">
                ${swapState.toToken ? formatPrice(swapState.toToken.price, swapState.toToken.decimals) : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Rate */}
      {swapState.exchangeRate > 0 && (
        <div className="bg-metamask-gray-50 rounded-xl p-4 mb-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-dashed border-metamask-gray-200">
          <div className="flex justify-between items-center">
            <span>Market Price</span>
            <span className="text-metamask-purple">
              1 {swapState.fromToken?.symbol} ≈ {swapState.exchangeRate.toFixed(6)} {swapState.toToken?.symbol}
            </span>
          </div>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!canSwap || isExecuting}
        className={`w-full py-5 rounded-full font-metamask font-black text-lg transition-all shadow-xl active:scale-[0.98] ${canSwap && !isExecuting
            ? activeTab === 'buy'
              ? 'bg-metamask-orange text-white hover:bg-orange-600 shadow-orange-500/20'
              : 'bg-metamask-purple text-white hover:bg-purple-900 shadow-purple-500/20'
            : 'bg-metamask-gray-100 text-gray-400 cursor-not-allowed shadow-none'
          }`}
      >
        {isExecuting
          ? 'Processing Transaction...'
          : !canSwap
            ? 'Enter Amount'
            : activeTab === 'buy'
              ? `Buy ${tokenSymbol}`
              : `Sell ${tokenSymbol}`}
      </button>
    </div>
  );
};


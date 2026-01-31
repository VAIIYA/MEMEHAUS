'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
import {
  ArrowLeft,
  ArrowUpDown,
  Settings,
  Info,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  RefreshCw,
  AlertCircle,
  X,
  Search,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSwap, SwapToken } from '../hooks/useSwap';
import { WalletConnectButton } from '../components/WalletConnectButton';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WalletNotification } from '../components/WalletNotification';

export default function SwapPage() {

  // Token selection modal state
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenModalType, setTokenModalType] = useState<'from' | 'to'>('from');
  const [searchQuery, setSearchQuery] = useState('');
  const { connected } = useWallet();
  const {
    swapState,
    userTokens,
    memeHausTokens,
    isExecuting,
    setFromToken,
    setToToken,
    setFromAmount,
    setSlippage,
    swapTokens,
    executeSwap,
    loadUserTokens,
    loadMemeHausTokens,
    canSwap,
    formatPrice,
    formatBalance
  } = useSwap();

  // Extract slippage from swapState for easier access
  const slippage = swapState.slippageBps / 100; // Convert from basis points to percentage

  const [showSettings, setShowSettings] = useState(false);
  const [swapResult, setSwapResult] = useState<{ success: boolean; signature?: string; error?: string } | null>(null);

  const handleSwapTokens = () => {
    swapTokens();
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const handleSwap = async () => {
    if (!canSwap) return;

    const result = await executeSwap();
    setSwapResult({
      success: result.success,
      signature: result.transactionSignature,
      error: result.error
    });
  };

  const openTokenModal = (type: 'from' | 'to') => {
    setTokenModalType(type);
    setShowTokenModal(true);
    setSearchQuery('');
    // Reload MemeHaus tokens when opening modal
    if (type === 'to') {
      loadMemeHausTokens();
    }
  };

  const selectToken = (token: SwapToken) => {
    if (tokenModalType === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowTokenModal(false);
  };

  // Filter tokens based on modal type and search query
  const filteredTokens = useMemo(() => {
    if (tokenModalType === 'from') {
      // For "from" token, show user's tokens (SOL + tokens they own)
      let tokens = [...userTokens];

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        tokens = tokens.filter(token =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.mint.toLowerCase().includes(query)
        );
      }

      return tokens;
    } else {
      // For "to" token, ONLY show MemeHaus tokens
      let tokens = [...memeHausTokens];

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        tokens = tokens.filter(token =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.mint.toLowerCase().includes(query)
        );
      }

      return tokens;
    }
  }, [tokenModalType, searchQuery, userTokens, memeHausTokens]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Check if user is not connected and show connect wallet screen
  if (!connected) {
    return (
      <div className="min-h-screen bg-metamask-gray-50 text-metamask-black font-metamask">
        <Header />
        <div className="flex items-center justify-center py-32 px-4">
          <div className="max-w-md w-full text-center bg-white border border-metamask-gray-100 rounded-[32px] p-12 shadow-sm">
            <div className="w-20 h-20 bg-orange-50 text-metamask-orange rounded-full flex items-center justify-center mx-auto mb-8">
              <Zap className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-metamask-heading font-black text-metamask-purple mb-4">Connect Your Wallet</h1>
            <p className="text-metamask-black/60 mb-10 leading-relaxed">
              You need to connect your wallet to swap tokens. Connect your Solana wallet to get started.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <WalletConnectButton />
              <Link href="/" className="inline-flex items-center space-x-2 text-metamask-purple font-bold hover:text-metamask-orange transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-metamask-gray-50 text-metamask-black font-metamask">
      <WalletNotification />
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16 md:px-8">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-block bg-white shadow-sm border border-metamask-gray-100 rounded-full px-4 py-2 text-metamask-purple font-bold text-xs uppercase tracking-widest">
            Trading Desk
          </div>
          <h1 className="text-5xl md:text-6xl font-metamask-heading font-black mb-4 text-metamask-purple">Swap</h1>
          <p className="text-lg text-metamask-black/60">Trade tokens instantly with the best rates.</p>
        </div>

        {/* Swap Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-metamask-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-metamask-heading font-bold text-metamask-purple">Swap</h2>
              <div className="flex items-center space-x-3">
                {swapState.loading && (
                  <div className="flex items-center space-x-2 text-xs font-bold text-metamask-orange uppercase tracking-wider">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                )}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 text-metamask-black/40 hover:text-metamask-orange transition-colors bg-metamask-gray-50 rounded-full"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-metamask-gray-50 border border-metamask-gray-100 rounded-2xl p-6 mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-metamask-purple mb-4">Transaction Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-metamask-black/40 font-bold uppercase tracking-widest mb-3">Slippage Tolerance</label>
                    <div className="flex space-x-3">
                      {[0.1, 0.5, 1.0].map((value) => (
                        <button
                          key={value}
                          onClick={() => setSlippage(value * 100)} // Convert percentage to basis points
                          className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${slippage === value
                            ? 'bg-metamask-orange text-white shadow-md shadow-orange-500/20'
                            : 'bg-white border border-metamask-gray-100 text-metamask-black hover:border-metamask-orange'
                            }`}
                        >
                          {value}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* From Token */}
            <div className="bg-metamask-gray-50 border border-metamask-gray-100 rounded-3xl p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-metamask-black/40">From</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold ${swapState.loading ? 'text-metamask-orange' : 'text-metamask-black/40'}`}>
                    Balance: {swapState.fromToken ? formatBalance(parseFloat(swapState.fromToken.balance), swapState.fromToken.decimals) : '0.00'}
                  </span>
                  {connected && (
                    <button
                      onClick={loadUserTokens}
                      className="p-1 text-metamask-black/20 hover:text-metamask-purple transition-colors"
                      title="Refresh balance"
                      disabled={swapState.loading}
                    >
                      <RefreshCw className={`w-3 h-3 ${swapState.loading ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={swapState.fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="w-full bg-transparent text-3xl font-metamask-heading font-black text-metamask-purple outline-none placeholder-metamask-purple/20"
                  />
                  <div className="text-sm font-bold text-metamask-black/20 mt-1">
                    ${swapState.fromToken ? formatPrice(swapState.fromToken.price, swapState.fromToken.decimals) : '0.00'}
                  </div>
                </div>
                <button
                  onClick={() => openTokenModal('from')}
                  className="px-4 py-2 bg-white border border-metamask-gray-100 hover:border-metamask-orange rounded-2xl text-sm font-bold text-metamask-purple transition-all duration-300 shadow-sm flex items-center space-x-2 disabled:opacity-50"
                  disabled={swapState.loading || userTokens.length === 0}
                >
                  <div className="w-6 h-6 bg-metamask-gray-50 rounded-full flex items-center justify-center text-[10px]">
                    {swapState.fromToken?.symbol?.[0] || '?'}
                  </div>
                  <span>{swapState.loading && userTokens.length === 0 ? 'Loading...' : swapState.fromToken?.symbol || 'Select'}</span>
                </button>
              </div>
            </div>

            {/* Swap Direction Toggle */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={handleSwapTokens}
                className="p-4 bg-white border-4 border-metamask-gray-50 text-metamask-purple hover:text-metamask-orange hover:scale-110 rounded-full transition-all duration-300 shadow-md group"
              >
                <ArrowUpDown className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>

            {/* To Token */}
            <div className="bg-metamask-gray-50 border border-metamask-gray-100 rounded-3xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-metamask-black/40">To</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold ${swapState.loading ? 'text-metamask-orange' : 'text-metamask-black/40'}`}>
                    Balance: {swapState.toToken ? formatBalance(parseFloat(swapState.toToken.balance), swapState.toToken.decimals) : '0.00'}
                  </span>
                  {connected && (
                    <button
                      onClick={loadUserTokens}
                      className="p-1 text-metamask-black/20 hover:text-metamask-purple transition-colors"
                      title="Refresh balance"
                    >
                      <RefreshCw className={`w-3 h-3 ${swapState.loading ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={swapState.toAmount}
                    readOnly
                    className="w-full bg-transparent text-3xl font-metamask-heading font-black text-metamask-purple outline-none placeholder-metamask-purple/20"
                  />
                  <div className="text-sm font-bold text-metamask-black/20 mt-1">
                    ${swapState.toToken ? formatPrice(swapState.toToken.price, swapState.toToken.decimals) : '0.00'}
                  </div>
                </div>
                <button
                  onClick={() => openTokenModal('to')}
                  className="px-4 py-2 bg-white border border-metamask-gray-100 hover:border-metamask-orange rounded-2xl text-sm font-bold text-metamask-purple transition-all duration-300 shadow-sm flex items-center space-x-2 disabled:opacity-50"
                  disabled={memeHausTokens.length === 0}
                >
                  <div className="w-6 h-6 bg-metamask-gray-50 rounded-full flex items-center justify-center text-[10px]">
                    {swapState.toToken?.symbol?.[0] || '?'}
                  </div>
                  <span>{swapState.toToken?.symbol || (memeHausTokens.length === 0 ? 'No tokens' : 'Select')}</span>
                </button>
              </div>
            </div>

            {/* Exchange Rate & Price Impact */}
            {swapState.exchangeRate > 0 && (
              <div className="bg-metamask-gray-50 border border-metamask-gray-100 rounded-2xl p-4 mb-8 space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-metamask-black/40 uppercase tracking-widest">Rate</span>
                  <span className="text-metamask-purple">
                    1 {swapState.fromToken?.symbol} = {swapState.exchangeRate.toFixed(6)} {swapState.toToken?.symbol}
                  </span>
                </div>
                {swapState.priceImpact > 0 && (
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-metamask-black/40 uppercase tracking-widest">Price Impact</span>
                    <span className={swapState.priceImpact > 2 ? 'text-red-500' : 'text-metamask-green'}>
                      {swapState.priceImpact.toFixed(2)}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Warnings/Errors */}
            {swapState.fromToken && swapState.toToken && swapState.fromAmount && parseFloat(swapState.fromAmount) > 0 && !swapState.quote && !swapState.loading && (
              <div className="mb-6 p-4 bg-orange-50 border border-metamask-orange/20 rounded-2xl">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-metamask-orange mt-0.5" />
                  <p className="text-sm text-metamask-orange font-semibold">
                    Unable to get swap quote. Service may be unavailable.
                  </p>
                </div>
              </div>
            )}

            {swapState.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-500 font-semibold">{swapState.error}</p>
                </div>
              </div>
            )}

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              disabled={!canSwap || isExecuting || swapState.loading}
              className="w-full btn-primary disabled:opacity-50 disabled:bg-metamask-gray-100 disabled:text-metamask-black/40 disabled:shadow-none text-xl py-6"
            >
              {isExecuting ? (
                <div className="flex items-center justify-center space-x-3">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Swapping...</span>
                </div>
              ) :
                swapState.loading ? 'Getting quote...' :
                  !canSwap ? 'Enter an amount' :
                    `Swap Now`}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-12 space-y-6">
            <div className="bg-white border border-metamask-gray-100 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                  <Info className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-metamask-heading font-black text-metamask-purple">Why Trade Here?</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-4 p-4 hover:bg-metamask-gray-50 rounded-2xl transition-colors">
                  <Shield className="w-5 h-5 text-metamask-green" />
                  <span className="font-bold text-sm text-metamask-purple">Audited smart contracts</span>
                </div>
                <div className="flex items-center space-x-4 p-4 hover:bg-metamask-gray-50 rounded-2xl transition-colors">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-sm text-metamask-purple">Deep liquidity pools</span>
                </div>
                <div className="flex items-center space-x-4 p-4 hover:bg-metamask-gray-50 rounded-2xl transition-colors">
                  <Clock className="w-5 h-5 text-metamask-orange" />
                  <span className="font-bold text-sm text-metamask-purple">Lightning fast settlement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MemeHaus Tokens Overview */}
        {memeHausTokens.length > 0 && (
          <div className="mt-24">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-metamask-heading font-black text-metamask-purple mb-4">MemeHaus Specials</h2>
              <p className="text-metamask-black/60">Exclusive tokens launched on our platform.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {memeHausTokens.map((token, index) => (
                <div key={index} className="bg-white border border-metamask-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group cursor-pointer" onClick={() => {
                  setTokenModalType('to');
                  selectToken(token);
                }}>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-metamask-gray-50 rounded-full flex items-center justify-center text-xl font-black text-metamask-purple group-hover:bg-metamask-orange group-hover:text-white transition-colors">
                        {token.symbol[0]}
                      </div>
                      <div>
                        <div className="font-metamask-heading font-bold text-xl text-metamask-purple">{token.symbol}</div>
                        <div className="text-xs font-bold text-metamask-black/40 uppercase tracking-widest">{token.name}</div>
                      </div>
                    </div>
                    <div className="p-2 bg-metamask-gray-50 rounded-full group-hover:bg-orange-50 group-hover:text-metamask-orange transition-colors">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-metamask-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-metamask-black/40 uppercase tracking-widest">Price</span>
                      <span className="font-black text-metamask-purple">${formatPrice(token.price, token.decimals)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-metamask-black/40 uppercase tracking-widest">Growth</span>
                      <span className="font-bold text-metamask-green">+12.4%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Enhanced Token Selection Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-metamask-purple/20 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-metamask-gray-100 rounded-[40px] p-8 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-metamask-heading font-black text-metamask-purple">
                  Select {tokenModalType === 'from' ? 'Source' : 'Target'}
                </h3>
                <p className="text-sm text-metamask-black/40 font-bold uppercase tracking-widest mt-1">Choose a token to swap</p>
              </div>
              <button
                onClick={() => setShowTokenModal(false)}
                className="p-3 hover:bg-metamask-gray-50 rounded-full transition-colors text-metamask-black/20 hover:text-metamask-orange"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 text-metamask-purple">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-metamask-black/20" />
              <input
                type="text"
                placeholder="Search by name or address..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-metamask-gray-50 border border-metamask-gray-100 rounded-2xl text-metamask-purple font-bold placeholder-metamask-black/20 focus:outline-none focus:border-metamask-orange transition-colors"
              />
            </div>

            {/* Token List */}
            <div className="overflow-y-auto max-h-[50vh] pr-2 space-y-3 custom-scrollbar">
              {filteredTokens.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-metamask-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-metamask-black/10" />
                  </div>
                  <p className="text-metamask-black/40 font-bold uppercase tracking-widest text-sm">No tokens found</p>
                </div>
              ) : filteredTokens.map((token) => (
                <button
                  key={token.mint}
                  onClick={() => selectToken(token)}
                  className="w-full p-5 bg-metamask-gray-50 border border-transparent rounded-3xl hover:border-metamask-orange hover:bg-white transition-all duration-300 text-left group flex items-center justify-between shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-metamask-purple group-hover:bg-metamask-orange group-hover:text-white transition-colors border border-metamask-gray-100">
                      {token.symbol[0]}
                    </div>
                    <div>
                      <div className="font-metamask-heading font-bold text-lg text-metamask-purple">{token.symbol}</div>
                      <div className="text-xs font-bold text-metamask-black/40 uppercase tracking-widest">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-metamask-purple">{formatBalance(parseFloat(token.balance), token.decimals)}</div>
                    <div className="text-xs font-bold text-metamask-black/20">${formatPrice(token.price, token.decimals)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Swap Result Modal */}
      {swapResult && (
        <div className="fixed inset-0 bg-metamask-purple/20 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white border border-metamask-gray-100 rounded-[40px] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${swapResult.success ? 'bg-green-50 text-metamask-green' : 'bg-red-50 text-red-500'
              }`}>
              {swapResult.success ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
            </div>

            <h3 className="text-2xl font-metamask-heading font-black text-metamask-purple mb-2">
              {swapResult.success ? 'Swap Successful!' : 'Swap Failed'}
            </h3>

            <p className="text-metamask-black/60 mb-8 font-bold">
              {swapResult.success
                ? 'Your tokens have been exchanged successfully.'
                : swapResult.error || 'Something went wrong with your transaction.'}
            </p>

            {swapResult.success && swapResult.signature && (
              <a
                href={`https://solscan.io/tx/${swapResult.signature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-metamask-purple hover:text-metamask-orange font-bold mb-8 transition-colors"
              >
                <span>View on Solscan</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={() => setSwapResult(null)}
              className="w-full btn-primary py-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { WalletConnectButton } from '../../components/WalletConnectButton';
import { NetworkIndicator } from '../../components/NetworkIndicator';
import { TokenHeader } from '../../components/token/TokenHeader';
import { TokenStats } from '../../components/token/TokenStats';
import { BuySellPanel } from '../../components/token/BuySellPanel';
import { TokenChart } from '../../components/token/TokenChart';
import { TransactionFeed } from '../../components/token/TransactionFeed';

interface TokenData {
  name: string;
  symbol: string;
  imageUrl?: string;
  creatorWallet: string;
  createdAt: string;
  mintAddress: string;
  totalSupply: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  decimals: number;
  bondingCurve?: {
    complete: boolean;
    liquidtyVaultSol: string;
    liquidtyVaultTokens: string;
    progress: number;
  } | null;
}

export default function TokenPage() {
  const params = useParams();
  const mintAddress = params.mintAddress as string;
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!mintAddress) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/token/${mintAddress}`);
        const data = await response.json();

        if (data.success && data.token) {
          setTokenData(data.token);
        } else {
          setError(data.error || 'Token not found.');
        }
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Failed to load token data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
    // Refresh data every 30 seconds for live updates
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, [mintAddress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-metamask-purple">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-metamask-orange mb-4"></div>
            <p className="text-gray-500 font-metamask">Loading token details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="min-h-screen bg-white text-metamask-purple">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-metamask-heading font-black mb-4">Token Not Found</h1>
            <p className="text-gray-500 mb-8 max-w-md">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-metamask-purple text-white rounded-full font-metamask font-bold hover:bg-purple-900 shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-metamask-purple overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-metamask-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 py-4 md:px-8">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="bg-metamask-orange p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-md shadow-orange-500/10">
                  <Zap className="w-8 h-8 text-white fill-white" />
                </div>
                <h1 className="text-2xl font-metamask-heading font-black text-metamask-purple">MemeHaus</h1>
              </Link>
              <div className="hidden md:block">
                <NetworkIndicator />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <WalletConnectButton />
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column - Main Info (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2 text-gray-500 hover:text-metamask-orange font-metamask font-bold transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>All Tokens</span>
              </Link>
              <div className="text-[10px] font-bold text-metamask-orange bg-metamask-orange/10 px-4 py-1.5 rounded-full border border-metamask-orange/20 uppercase tracking-widest shadow-sm">
                Contract: {tokenData.mintAddress.slice(0, 12)}...
              </div>
            </div>

            <TokenHeader
              name={tokenData.name}
              symbol={tokenData.symbol}
              imageUrl={tokenData.imageUrl}
              creatorWallet={tokenData.creatorWallet}
              createdAt={tokenData.createdAt}
              mintAddress={tokenData.mintAddress}
            />

            <TokenStats
              price={tokenData.price}
              priceChange24h={tokenData.priceChange24h}
              marketCap={tokenData.marketCap}
              volume24h={tokenData.volume24h}
              holders={tokenData.holders}
              totalSupply={tokenData.totalSupply}
            />

            <TokenChart mintAddress={tokenData.mintAddress} />

            <TransactionFeed mintAddress={tokenData.mintAddress} />
          </div>

          {/* Right Column - Trade & Info (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Bonding Curve Progress */}
            {tokenData.bondingCurve && (
              <div className="bg-white rounded-2xl border border-metamask-gray-100 p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-metamask-orange opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="font-metamask font-black text-metamask-purple">Bonding Curve</h3>
                  <span className="text-metamask-orange font-metamask-heading font-black text-xl">{tokenData.bondingCurve.progress.toFixed(1)}%</span>
                </div>

                <div className="w-full bg-metamask-gray-50 rounded-full h-4 mb-6 overflow-hidden border border-metamask-gray-100 relative z-10">
                  <div
                    className="bg-metamask-orange h-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,92,22,0.3)] relative"
                    style={{ width: `${tokenData.bondingCurve.progress}%` }}
                  >
                    <div className="absolute top-0 right-0 w-8 h-full bg-white/30 skew-x-[-20deg]"></div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 relative z-10 font-metamask font-medium leading-relaxed">
                  When the bonding curve reaches 100%, the liquidity will be migrated to Raydium. 🚀
                </p>
              </div>
            )}

            <BuySellPanel
              tokenMint={tokenData.mintAddress}
              tokenSymbol={tokenData.symbol}
              tokenName={tokenData.name}
              tokenDecimals={tokenData.decimals || 9}
            />

            <div className="bg-white rounded-2xl border border-metamask-gray-100 p-8 shadow-sm">
              <h3 className="text-lg font-metamask-heading font-black text-metamask-purple mb-6">Asset Intelligence</h3>
              <p className="text-sm text-gray-500 font-metamask font-medium leading-relaxed mb-8">
                {tokenData.symbol} is a community-driven memecoin launched on MemeHaus.
                Full ownership has been renounced and the supply is permanently fixed.
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-metamask-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Creator</span>
                  <span className="text-sm font-mono font-bold text-metamask-orange">{tokenData.creatorWallet.slice(0, 4)}...{tokenData.creatorWallet.slice(-4)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-metamask-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Decimals</span>
                  <span className="text-sm font-mono font-bold text-metamask-purple">{tokenData.decimals || 9}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status</span>
                  <span className="text-sm font-metamask font-bold text-metamask-green flex items-center">
                    <span className="w-2 h-2 bg-metamask-green rounded-full mr-2 shadow-[0_0_8px_rgba(186,242,74,0.5)]" />
                    Verified Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

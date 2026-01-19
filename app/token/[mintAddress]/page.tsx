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
      <div className="min-h-screen bg-[#0d0e12] text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mb-4"></div>
            <p className="text-gray-400">Loading token details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="min-h-screen bg-[#0d0e12] text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Token Not Found</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-all"
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
    <div className="min-h-screen bg-[#0d0e12] text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 py-4 md:px-8">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-neon-cyan" />
                <h1 className="text-2xl font-orbitron font-bold text-white">MemeHaus</h1>
              </Link>
              <NetworkIndicator />
            </div>
            <WalletConnectButton />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column - Main Info (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Link>
              <div className="text-sm font-mono text-neon-cyan bg-neon-cyan/10 px-3 py-1 rounded-full border border-neon-cyan/20">
                {tokenData.mintAddress}
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
          <div className="lg:col-span-4 space-y-6">
            {/* Bonding Curve Progress */}
            {tokenData.bondingCurve && (
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Bonding Curve Progress</h3>
                  <span className="text-neon-cyan font-mono">{tokenData.bondingCurve.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-neon-cyan to-neon-blue h-full transition-all duration-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                    style={{ width: `${tokenData.bondingCurve.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  When the bonding curve reaches 100%, the liquidity will be migrated to Raydium.
                </p>
              </div>
            )}

            <BuySellPanel
              tokenMint={tokenData.mintAddress}
              tokenSymbol={tokenData.symbol}
              tokenName={tokenData.name}
              tokenDecimals={tokenData.decimals || 9}
            />

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <h3 className="font-bold mb-4">About {tokenData.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                {tokenData.symbol} is a community-driven memecoin launched on MemeHaus.
                Ownership is renounced and the supply is fixed at 1 Billion tokens.
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                  <span className="text-sm text-gray-400">Creator</span>
                  <span className="text-sm font-mono text-neon-cyan">{tokenData.creatorWallet.slice(0, 4)}...{tokenData.creatorWallet.slice(-4)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                  <span className="text-sm text-gray-400">Decimals</span>
                  <span className="text-sm font-mono text-white">{tokenData.decimals || 9}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Network</span>
                  <span className="text-sm text-white flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Solana Mainnet
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

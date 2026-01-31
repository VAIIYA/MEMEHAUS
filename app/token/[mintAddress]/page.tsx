'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { WalletNotification } from '../../components/WalletNotification';
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
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, [mintAddress]);

  if (loading) {
    return (
      <div className="min-h-screen bg-metamask-gray-50 text-metamask-purple">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-metamask-orange mb-4"></div>
            <p className="text-metamask-black/40 font-black uppercase tracking-widest text-xs">Loading on-chain data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="min-h-screen bg-metamask-gray-50 text-metamask-purple">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center bg-white border border-metamask-gray-100 rounded-[32px] p-12 shadow-sm max-w-md w-full">
            <h1 className="text-3xl font-metamask-heading font-black mb-4">Token Not Found</h1>
            <p className="text-metamask-black/60 mb-10 leading-relaxed font-bold">{error}</p>
            <Link
              href="/"
              className="btn-primary inline-flex py-4 px-10 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-metamask-gray-50 text-metamask-purple font-metamask">
      <WalletNotification />
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        {/* Left Column - Main Info (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2 text-metamask-black/40 hover:text-metamask-purple font-black uppercase tracking-widest text-[10px] transition-colors">
                <ArrowLeft className="w-3 h-3" />
                <span>Return to Feed</span>
              </Link>
              <div className="text-[10px] font-black text-metamask-orange bg-orange-50 px-4 py-1.5 rounded-full border border-metamask-gray-100 uppercase tracking-widest shadow-sm">
                CA: {tokenData.mintAddress.slice(0, 12)}...
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
            {tokenData.bondingCurve && (
              <div className="bg-white rounded-[40px] border border-metamask-gray-100 p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-metamask-orange/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="font-metamask-heading font-black text-metamask-purple">Bonding Curve</h3>
                  <span className="text-metamask-orange font-metamask-heading font-black text-2xl">{tokenData.bondingCurve.progress.toFixed(1)}%</span>
                </div>

                <div className="w-full bg-metamask-gray-50 rounded-full h-4 mb-6 overflow-hidden border border-metamask-gray-100 relative z-10 p-0.5">
                  <div
                    className="bg-metamask-orange h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,92,22,0.3)] relative"
                    style={{ width: `${tokenData.bondingCurve.progress}%` }}
                  >
                    <div className="absolute top-0 right-0 w-12 h-full bg-white/30 skew-x-[-20deg] animate-pulse"></div>
                  </div>
                </div>

                <p className="text-[10px] font-black uppercase tracking-widest text-metamask-black/40 relative z-10 leading-relaxed">
                  Curve Graduation triggers Raydium liquidity lock at 100%. 🚀
                </p>
              </div>
            )}

            <BuySellPanel
              tokenMint={tokenData.mintAddress}
              tokenSymbol={tokenData.symbol}
              tokenName={tokenData.name}
              tokenDecimals={tokenData.decimals || 9}
            />

            <div className="bg-white rounded-[40px] border border-metamask-gray-100 p-8 shadow-sm">
              <h3 className="text-xl font-metamask-heading font-black text-metamask-purple mb-8">Asset Intel</h3>
              <p className="text-sm text-metamask-black/60 font-bold leading-relaxed mb-10">
                {tokenData.symbol} represents a community-governed asset deployed on MemeHaus.
                All initial positions are transparent and supply is immutable.
              </p>

              <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b border-metamask-gray-50">
                  <span className="text-[10px] font-black text-metamask-black/20 uppercase tracking-widest">Creator</span>
                  <span className="text-xs font-mono font-black text-metamask-orange bg-orange-50 px-2 py-1 rounded-lg">{tokenData.creatorWallet.slice(0, 4)}...{tokenData.creatorWallet.slice(-4)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-metamask-gray-50">
                  <span className="text-[10px] font-black text-metamask-black/20 uppercase tracking-widest">Resolution</span>
                  <span className="text-xs font-mono font-black text-metamask-purple">{tokenData.decimals || 9} Units</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-[10px] font-black text-metamask-black/20 uppercase tracking-widest">Status</span>
                  <span className="text-xs font-black uppercase tracking-widest text-metamask-green flex items-center">
                    <span className="w-2 h-2 bg-metamask-green rounded-full mr-2 shadow-[0_0_8px_rgba(186,242,74,0.5)] animate-pulse" />
                    Verified Live
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

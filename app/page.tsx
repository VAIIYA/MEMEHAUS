'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Zap, TrendingUp, Clock, Users, Coins } from 'lucide-react';
import { WalletNotification } from './components/WalletNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

interface LaunchItem {
  name: string;
  symbol: string;
  totalSupply: string;
  communityDistribution: string;
  distributionRecipients: number;
  holders?: number;
  timeSinceLaunch: string;
  creatorWallet: string;
  mintAddress?: string;
  imageUrl?: string;
  price?: number;
  volume24h?: number;
}

// Helper function to format time since launch
// Only calculate on client to prevent hydration mismatches
const formatTimeSinceLaunch = (createdAt: string, isMounted: boolean = false): string => {
  // Return a placeholder during SSR or before mount to prevent hydration mismatch
  if (!isMounted) {
    return '...';
  }

  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 24) {
    const days = Math.floor(diffHours / 24);
    return `${days}d ${diffHours % 24}h`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
};

// Helper function to format large numbers
const formatLargeNumber = (num: string): string => {
  const numValue = parseFloat(num);
  if (numValue >= 1e9) {
    return `${(numValue / 1e9).toFixed(1)}B`;
  } else if (numValue >= 1e6) {
    return `${(numValue / 1e6).toFixed(1)}M`;
  } else if (numValue >= 1e3) {
    return `${(numValue / 1e3).toFixed(1)}K`;
  }
  return numValue.toLocaleString();
};

export default function Home() {
  const [recentTokens, setRecentTokens] = useState<LaunchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [platformStats, setPlatformStats] = useState({
    totalTokens: 0,
    totalVolume: '0',
    totalUsers: 0
  });

  // Track if component is mounted to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        console.log('Fetching recent tokens from API...');

        // Fetch recent tokens from API - show more tokens like Pump.fun
        const response = await fetch('/api/tokens?page=0&limit=20');
        const data = await response.json();

        console.log('API response:', data);

        if (data.success && data.tokens && data.tokens.length > 0) {
          // Transform tokens to LaunchItem format
          const launchItems: LaunchItem[] = await Promise.all(data.tokens.map(async (token: any) => {
            console.log('Processing token:', token);

            const mintAddress = token.mint_address || token.mintAddress;

            // Fetch holder count if mint address is available
            let holders = 0;
            if (mintAddress) {
              try {
                const holdersResponse = await fetch(`/api/token/holders?mintAddress=${mintAddress}`);
                const holdersData = await holdersResponse.json();
                if (holdersData.success && holdersData.holders !== undefined) {
                  holders = holdersData.holders;
                }
              } catch (error) {
                console.error('Error fetching holders:', error);
              }
            }

            return {
              name: token.name || 'Unknown Token',
              symbol: token.symbol || 'UNK',
              totalSupply: formatLargeNumber(token.total_supply || token.totalSupply || '0'),
              communityDistribution: '0', // Will be calculated later
              distributionRecipients: holders, // Use holders count
              holders: holders,
              timeSinceLaunch: formatTimeSinceLaunch(token.created_at || token.createdAt || new Date().toISOString(), mounted),
              creatorWallet: token.creator_wallet || token.creatorWallet || 'Unknown',
              mintAddress: mintAddress,
              imageUrl: (token.image_url || token.imageUrl) || undefined, // Ensure we don't pass empty strings
              price: token.price || 0,
              volume24h: token.volume_24h || token.volume24h || 0
            };
          }));

          console.log('Transformed launch items:', launchItems);
          setRecentTokens(launchItems);

          // Set platform stats from API
          if (data.stats) {
            setPlatformStats(data.stats);
          }
        } else {
          console.log('API returned no tokens or failed, using localStorage fallback');
          throw new Error('No tokens returned from API');
        }

      } catch (error) {
        console.error('Error fetching data:', error);

        // Try to get tokens from localStorage as fallback
        try {
          if (typeof window !== 'undefined') {
            const storedTokensStr = localStorage.getItem('memehaus_created_tokens');
            console.log('localStorage value:', storedTokensStr);

            if (storedTokensStr) {
              const storedTokens = JSON.parse(storedTokensStr);
              console.log('Parsed stored tokens:', storedTokens);

              if (Array.isArray(storedTokens) && storedTokens.length > 0) {
                const fallbackTokens: LaunchItem[] = await Promise.all(storedTokens.slice(0, 20).map(async (token: any) => {
                  const mintAddress = token.mintAddress;

                  // Fetch holder count if mint address is available
                  let holders = 0;
                  if (mintAddress) {
                    try {
                      const holdersResponse = await fetch(`/api/token/holders?mintAddress=${mintAddress}`);
                      const holdersData = await holdersResponse.json();
                      if (holdersData.success && holdersData.holders !== undefined) {
                        holders = holdersData.holders;
                      }
                    } catch (error) {
                      console.error('Error fetching holders:', error);
                    }
                  }

                  return {
                    name: token.name || 'Unknown',
                    symbol: token.symbol || 'UNK',
                    totalSupply: formatLargeNumber(token.totalSupply || '0'),
                    communityDistribution: '0',
                    distributionRecipients: holders,
                    holders: holders,
                    timeSinceLaunch: formatTimeSinceLaunch(token.createdAt || new Date().toISOString(), mounted),
                    creatorWallet: token.creatorWallet || 'Unknown',
                    mintAddress: mintAddress,
                    imageUrl: token.imageUrl,
                    price: token.price || 0,
                    volume24h: token.volume24h || 0
                  };
                }));

                console.log('Using localStorage tokens:', fallbackTokens);
                setRecentTokens(fallbackTokens);
                setPlatformStats({
                  totalTokens: storedTokens.length,
                  totalVolume: '0',
                  totalUsers: new Set(storedTokens.map((t: any) => t.creatorWallet).filter(Boolean)).size || 1
                });
              } else {
                console.log('localStorage tokens array is empty or invalid');
                setRecentTokens([]);
                setPlatformStats({
                  totalTokens: 0,
                  totalVolume: '0',
                  totalUsers: 0
                });
              }
            } else {
              console.log('No tokens found in localStorage');
              setRecentTokens([]);
              setPlatformStats({
                totalTokens: 0,
                totalVolume: '0',
                totalUsers: 0
              });
            }
          }
        } catch (localStorageError) {
          console.error('Error reading from localStorage:', localStorageError);
          setRecentTokens([]);
          setPlatformStats({
            totalTokens: 0,
            totalVolume: '0',
            totalUsers: 0
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-metamask-gray-50 text-metamask-black mobile-container w-full max-w-full overflow-x-hidden">
      <WalletNotification />
      <Header />

      {/* Hero Section */}
      <section className="px-4 py-20 md:px-8 md:py-32 bg-white flex items-center justify-center">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6 inline-block bg-metamask-gray-100 rounded-full px-4 py-2 text-metamask-purple font-metamask font-bold text-xs uppercase tracking-widest">
            Welcome to MemeHaus
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-metamask-heading font-black mb-8 leading-tight text-metamask-purple">
            Make a meme.<br />
            <span className="text-metamask-orange">Mint a dream.</span>
          </h2>
          <p className="text-xl md:text-2xl font-metamask text-metamask-black/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            The Haus is open. Every mint kicks 10% back to the early degenerates. Secure, transparent, and built for the community.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/create" className="w-full sm:w-auto px-10 py-5 bg-metamask-orange hover:bg-orange-600 rounded-full font-metamask font-bold text-lg text-white shadow-lg shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-1">
              Start Building
            </Link>
            <Link href="/swap" className="w-full sm:w-auto px-10 py-5 border-2 border-metamask-black hover:bg-metamask-gray-50 rounded-full font-metamask font-bold text-lg text-metamask-black transition-all duration-300 transform hover:-translate-y-1">
              Trade Memes
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 md:px-8 bg-metamask-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-metamask-gray-100 group hover:shadow-md transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Volume</div>
              </div>
              <div className="text-3xl font-metamask-heading font-black text-metamask-purple">
                ${formatLargeNumber(platformStats.totalVolume)}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-metamask-gray-100 group hover:shadow-md transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-orange-50 text-metamask-orange rounded-xl">
                  <Coins className="w-6 h-6" />
                </div>
                <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Launches</div>
              </div>
              <div className="text-3xl font-metamask-heading font-black text-metamask-purple">
                {platformStats.totalTokens}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-metamask-gray-100 group hover:shadow-md transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-green-50 text-green-500 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-gray-500 font-semibold uppercase text-xs tracking-wider">Creators</div>
              </div>
              <div className="text-3xl font-metamask-heading font-black text-metamask-purple">
                {platformStats.totalUsers}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Launches - MetaMask Style */}
      <section className="px-4 py-20 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h3 className="text-3xl font-metamask-heading font-black text-metamask-purple flex items-center space-x-3">
              <span>Recent Launches</span>
            </h3>
            <p className="text-gray-500 text-sm mt-2 font-metamask font-medium">
              Latest memecoins created on MemeHaus
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-metamask-gray-100 p-6 shadow-sm animate-pulse">
                    <div className="w-20 h-20 bg-metamask-gray-100 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-metamask-gray-100 rounded mb-2"></div>
                    <div className="h-3 bg-metamask-gray-100 rounded w-2/3 mx-auto"></div>
                  </div>
                ))}
              </>
            ) : recentTokens.length > 0 ? (
              recentTokens.map((launch, index) => {
                const solscanUrl = launch.mintAddress
                  ? `https://solscan.io/token/${launch.mintAddress}`
                  : '#';

                // Get image URL or generate fallback - ensure symbol and name are not null
                const safeSymbol = launch.symbol || 'UNK';
                const safeName = launch.name || 'Unknown Token';
                // Check if imageUrl exists and is not empty
                const hasImageUrl = launch.imageUrl && launch.imageUrl.trim().length > 0 && !launch.imageUrl.includes('placeholder');
                const imageUrl = hasImageUrl ? launch.imageUrl : `/api/token-image?symbol=${encodeURIComponent(safeSymbol)}&name=${encodeURIComponent(safeName)}`;

                // Extract optional values for type narrowing
                const price = launch.price;
                const volume24h = launch.volume24h;

                return (
                  <Link
                    key={index}
                    href={launch.mintAddress ? `/token/${launch.mintAddress}` : '#'}
                    className="group bg-white rounded-2xl border border-metamask-gray-100 hover:border-metamask-orange/30 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer block overflow-hidden"
                  >
                    {/* Token Image */}
                    <div className="relative w-full aspect-square bg-metamask-gray-50 flex items-center justify-center overflow-hidden border-b border-metamask-gray-100">
                      {hasImageUrl ? (
                        <img
                          src={imageUrl}
                          alt={safeName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `/api/token-image?symbol=${encodeURIComponent(safeSymbol)}&name=${encodeURIComponent(safeName)}`;
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-metamask-gray-100 rounded-full flex items-center justify-center font-metamask-heading font-bold text-3xl text-metamask-purple">
                          {safeSymbol[0] || '?'}
                        </div>
                      )}
                      {/* Time badge */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-metamask-purple shadow-sm flex items-center space-x-1 uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        <span>{launch.timeSinceLaunch}</span>
                      </div>
                    </div>

                    {/* Token Info */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h4 className="font-metamask font-bold text-lg text-metamask-purple mb-1 group-hover:text-metamask-orange transition-colors">
                          {safeName}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 font-mono text-xs">${safeSymbol}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="text-metamask-green font-bold text-xs">Active</span>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Supply</p>
                          <p className="text-sm font-metamask font-black text-metamask-purple">{launch.totalSupply}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Holders</p>
                          <p className="text-sm font-metamask font-black text-metamask-purple">{launch.holders !== undefined ? launch.holders : launch.distributionRecipients}</p>
                        </div>
                      </div>

                      {/* Price/Volume if available */}
                      {(price !== undefined || volume24h !== undefined) && (
                        <div className="mb-4 pt-4 border-t border-metamask-gray-50 flex justify-between items-center">
                          {price !== undefined && price > 0 && (
                            <span className="text-xs font-metamask font-bold text-metamask-purple">
                              ${price.toFixed(6)}
                            </span>
                          )}
                          {volume24h !== undefined && volume24h > 0 && (
                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                              Vol: ${formatLargeNumber(volume24h.toString())}
                            </span>
                          )}
                        </div>
                      )}

                      {/* View Button */}
                      <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-metamask-orange transition-colors">
                        <span>Details</span>
                        <Zap className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-metamask-gray-100">
                <div className="text-metamask-purple font-metamask-heading font-bold text-xl mb-4">
                  No tokens launched yet.
                </div>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Be the first to launch a memecoin on the most secure and community-focused platform on Solana.
                </p>
                <Link href="/create" className="inline-block px-10 py-4 bg-metamask-orange text-white rounded-full font-metamask font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/10">
                  Create Token
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section - MetaMask Style */}
      <section className="px-4 py-24 md:px-8 bg-white border-t border-metamask-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-metamask-purple rounded-[32px] p-12 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-metamask-orange rounded-full opacity-10 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-metamask-green rounded-full opacity-10 -ml-24 -mb-24"></div>

            <h3 className="text-3xl md:text-5xl font-metamask-heading font-black mb-6 relative z-10">
              Ready to launch your vision?
            </h3>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto relative z-10 font-metamask">
              Join thousands of creators who chose MemeHaus for its security, ease of use, and community rewards.
            </p>
            <div className="relative z-10">
              <Link href="/create" className="px-12 py-5 bg-metamask-orange text-white rounded-full font-metamask font-bold text-xl hover:bg-white hover:text-metamask-purple transition-all duration-300 shadow-xl shadow-black/20">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
} 
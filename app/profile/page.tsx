'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  Coins,
  TrendingUp,
  Clock,
  User,
  Wallet,
  Copy,
  CheckCircle,
  Shield,
  Award,
  RefreshCw,
  Zap,
  Settings
} from 'lucide-react';
import { WalletConnectButton } from '../components/WalletConnectButton';
import { NetworkIndicator } from '../components/NetworkIndicator';
import { TokenBalanceService, TokenAccount } from '../services/tokenBalanceService';
import { PriceService } from '../services/priceService';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WalletNotification } from '../components/WalletNotification';

interface TokenBalance {
  mint: string;
  symbol: string;
  name: string;
  balance: string;
  balanceRaw: number;
  decimals: number;
  price: number;
  value: number;
  logoURI?: string;
  priceChange24h?: number;
}

interface CreatedToken {
  name: string;
  symbol: string;
  mintAddress: string;
  totalSupply: string;
  createdAt: string;
  imageUrl?: string;
  value?: number;
  holders?: number;
}

type TabType = 'balances' | 'created' | 'settings';

export default function ProfilePage() {
  const { connected, publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const [activeTab, setActiveTab] = useState<TabType>('balances');
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [createdTokens, setCreatedTokens] = useState<CreatedToken[]>([]);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [totalValue, setTotalValue] = useState<number>(0);

  const tokenBalanceService = useMemo(() => new TokenBalanceService(connection.rpcEndpoint), [connection.rpcEndpoint]);
  const priceService = useMemo(() => new PriceService(), []);

  // Load user's token balances
  const loadBalances = async () => {
    if (!connected || !publicKey) {
      setTokenBalances([]);
      setSolBalance(0);
      setTotalValue(0);
      return;
    }

    try {
      setLoading(true);

      // Get SOL balance
      const solBalanceRaw = await tokenBalanceService.getSOLBalance(publicKey.toString());
      const solBalanceNum = parseFloat(solBalanceRaw);
      setSolBalance(solBalanceNum);

      // Get token accounts
      const tokenAccounts = await tokenBalanceService.getTokenAccounts(publicKey.toString()) || [];

      // Get prices for all tokens
      const mintAddresses = [
        'So11111111111111111111111111111111112', // SOL
        ...tokenAccounts.map(account => account.mint)
      ];

      const prices = await priceService.getMultipleTokenPrices(mintAddresses);
      const solPrice = prices.get('So11111111111111111111111111111111112')?.price || 0;

      // Build token balances list
      const balances: TokenBalance[] = [];

      // Add SOL
      const solValue = solBalanceNum * solPrice;
      balances.push({
        mint: 'So11111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Solana',
        balance: solBalanceRaw,
        balanceRaw: solBalanceNum,
        decimals: 9,
        price: solPrice,
        value: solValue,
        priceChange24h: prices.get('So11111111111111111111111111111111112')?.priceChange24h || 0
      });

      // Add other tokens
      tokenAccounts.forEach(account => {
        const price = prices.get(account.mint);
        if (price && parseFloat(account.balance) > 0) {
          const balanceNum = parseFloat(account.balance);
          balances.push({
            mint: account.mint,
            symbol: account.symbol || 'Unknown',
            name: account.name || 'Unknown Token',
            balance: account.balance,
            balanceRaw: balanceNum,
            decimals: account.decimals,
            price: price.price,
            value: balanceNum * price.price,
            logoURI: undefined,
            priceChange24h: price.priceChange24h
          });
        }
      });

      // Sort by value (highest first)
      balances.sort((a, b) => b.value - a.value);

      setTokenBalances(balances);

      // Calculate total value
      const total = balances.reduce((sum, token) => sum + token.value, 0);
      setTotalValue(total);

    } catch (error) {
      console.error('Error loading balances:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load created tokens
  const loadCreatedTokens = async () => {
    if (!connected || !publicKey) {
      setCreatedTokens([]);
      return;
    }

    try {
      const walletAddress = publicKey.toString();
      const response = await fetch(`/api/tokens?page=0&limit=100`);
      const data = await response.json();

      if (data.success && data.tokens) {
        const userTokens = data.tokens.filter((token: any) => {
          const creatorWallet = token.creator_wallet || token.creatorWallet;
          return creatorWallet && creatorWallet.toLowerCase() === walletAddress.toLowerCase();
        });

        const tokens: CreatedToken[] = userTokens.map((token: any) => {
          const mintAddress = token.mint_address || token.mintAddress;
          let value = 0;
          if (token.total_supply && token.price) {
            const supply = parseFloat(token.total_supply);
            value = supply * token.price;
          }

          return {
            name: token.name || 'Unknown Token',
            symbol: token.symbol || 'UNK',
            mintAddress: mintAddress || '',
            totalSupply: token.total_supply || token.totalSupply || '0',
            createdAt: token.created_at || token.createdAt || new Date().toISOString(),
            imageUrl: token.image_url || token.imageUrl,
            value: value,
            holders: token.holders || 0
          };
        });

        tokens.sort((a, b) => {
          try {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
            return dateB.getTime() - dateA.getTime();
          } catch (e) { return 0; }
        });

        setCreatedTokens(tokens);
      }
    } catch (error) {
      console.error('Error loading created tokens:', error);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      loadBalances();
      loadCreatedTokens();
    } else {
      setTokenBalances([]);
      setCreatedTokens([]);
      setSolBalance(0);
      setTotalValue(0);
      setLoading(false);
    }
  }, [connected, publicKey]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { }
  };

  const formatAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

  const formatValue = (value: number) => {
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';

    const diffMs = new Date().getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-metamask-gray-50 text-metamask-black font-metamask">
        <Header />
        <div className="flex items-center justify-center py-32 px-4">
          <div className="max-w-md w-full text-center bg-white border border-metamask-gray-100 rounded-[32px] p-12 shadow-sm">
            <div className="w-20 h-20 bg-orange-50 text-metamask-orange rounded-full flex items-center justify-center mx-auto mb-8">
              <User className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-metamask-heading font-black text-metamask-purple mb-4">Your Profile</h1>
            <p className="text-metamask-black/60 mb-10 leading-relaxed">
              Connect your wallet to view your tokens, activity, and manage your account.
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

  const walletAddress = publicKey?.toString() || '';

  return (
    <div className="min-h-screen bg-metamask-gray-50 text-metamask-black font-metamask">
      <WalletNotification />
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-16 md:px-8">
        {/* Profile Banner & Head */}
        <div className="relative mb-24">
          <div className="h-48 rounded-[40px] bg-gradient-to-r from-metamask-purple/5 to-metamask-orange/5 border border-metamask-gray-100 overflow-hidden shadow-sm relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,#ff5c16,transparent),radial-gradient(circle_at_70%_60%,#3d065f,transparent)]"></div>
          </div>

          <div className="absolute -bottom-12 left-8 flex flex-col md:flex-row md:items-end md:space-x-8">
            <div className="w-32 h-32 rounded-[32px] bg-white border-8 border-metamask-gray-50 p-2 shadow-xl">
              <div className="w-full h-full rounded-[24px] bg-gradient-to-br from-metamask-purple to-metamask-orange text-white flex items-center justify-center font-metamask-heading text-4xl font-black">
                {walletAddress?.[0]?.toUpperCase()}
              </div>
            </div>
            <div className="mt-4 md:mt-0 pb-2">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-metamask-heading font-black text-metamask-purple">
                  {formatAddress(walletAddress)}
                </h1>
                <button
                  onClick={() => copyToClipboard(walletAddress)}
                  className="p-2 hover:bg-white rounded-xl shadow-sm border border-metamask-gray-100 transition-all"
                  title="Copy address"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-metamask-green" /> : <Copy className="w-4 h-4 text-metamask-black/40" />}
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-metamask-black/40 bg-white px-3 py-1.5 rounded-full border border-metamask-gray-100">
                  <Shield className="w-3 h-3 text-metamask-green" />
                  <span>Verified Identity</span>
                </span>
                <a
                  href={`https://solscan.io/account/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-metamask-purple hover:text-metamask-orange transition-colors"
                >
                  <span>Solscan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border border-metamask-gray-100 rounded-[32px] p-8 shadow-sm group hover:border-metamask-orange transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-orange-50 text-metamask-orange rounded-2xl group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-metamask-black/20 uppercase tracking-widest">Portfolio</span>
            </div>
            <div className="text-3xl font-metamask-heading font-black text-metamask-purple">{formatValue(totalValue)}</div>
          </div>
          <div className="bg-white border border-metamask-gray-100 rounded-[32px] p-8 shadow-sm group hover:border-blue-500 transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-metamask-black/20 uppercase tracking-widest">Created</span>
            </div>
            <div className="text-3xl font-metamask-heading font-black text-metamask-purple">{createdTokens.length} <span className="text-sm font-bold text-metamask-black/40">Tokens</span></div>
          </div>
          <div className="bg-white border border-metamask-gray-100 rounded-[32px] p-8 shadow-sm group hover:border-metamask-green transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-green-50 text-metamask-green rounded-2xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-metamask-black/20 uppercase tracking-widest">Growth</span>
            </div>
            <div className="text-3xl font-metamask-heading font-black text-metamask-purple">+12.4% <span className="text-sm font-bold text-metamask-black/40">24h</span></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 md:space-x-4 bg-white border border-metamask-gray-100 p-2 rounded-full max-w-fit mb-12 shadow-sm">
          {[
            { id: 'balances', label: 'Balances', icon: Coins },
            { id: 'created', label: 'Created', icon: TrendingUp },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id
                ? 'bg-metamask-purple text-white shadow-lg'
                : 'text-metamask-black/40 hover:text-metamask-purple hover:bg-metamask-gray-50'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-metamask-gray-100 rounded-[48px] p-8 md:p-12 shadow-sm">
          {loading ? (
            <div className="text-center py-32">
              <RefreshCw className="w-12 h-12 text-metamask-orange animate-spin mx-auto mb-6" />
              <p className="text-metamask-black/40 font-black uppercase tracking-widest">Loading on-chain data...</p>
            </div>
          ) : activeTab === 'balances' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tokenBalances.length > 0 ? (
                tokenBalances.map((token) => (
                  <Link
                    key={token.mint}
                    href={token.mint === 'So11111111111111111111111111111111112' ? '#' : `/token/${token.mint}`}
                    className="bg-metamask-gray-50 border border-transparent rounded-[32px] p-8 hover:border-metamask-orange hover:bg-white hover:shadow-xl transition-all duration-500 group"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center font-metamask-heading text-xl font-black text-metamask-purple border border-metamask-gray-100 group-hover:bg-metamask-purple group-hover:text-white transition-colors">
                        {token.symbol[0]}
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-metamask-black/20 uppercase tracking-widest mb-1">Value</div>
                        <div className="font-metamask-heading font-black text-xl text-metamask-purple">{formatValue(token.value)}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-metamask-heading font-bold text-lg text-metamask-purple">{token.name}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-black text-metamask-black/40 uppercase tracking-widest">{token.symbol}</span>
                        <span className="font-black text-metamask-purple/60">{token.balanceRaw.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <Coins className="w-16 h-16 text-metamask-black/5 mx-auto mb-6" />
                  <p className="text-metamask-black/40 font-black uppercase tracking-widest">No tokens in this wallet</p>
                </div>
              )}
            </div>
          ) : activeTab === 'created' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {createdTokens.length > 0 ? (
                createdTokens.map((token) => (
                  <Link
                    key={token.mintAddress}
                    href={`/token/${token.mintAddress}`}
                    className="bg-metamask-gray-50 border border-transparent rounded-[32px] p-8 hover:border-metamask-orange hover:bg-white hover:shadow-xl transition-all duration-500 group"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center font-metamask-heading text-xl font-black text-metamask-purple border border-metamask-gray-100 group-hover:bg-metamask-orange group-hover:text-white transition-colors overflow-hidden">
                        {token.imageUrl ? <img src={token.imageUrl} alt="" className="w-full h-full object-cover" /> : token.symbol[0]}
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-metamask-black/20 uppercase tracking-widest mb-1">Creation Date</div>
                        <div className="font-black text-sm text-metamask-purple/60">{formatTimeAgo(token.createdAt)}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-metamask-heading font-bold text-lg text-metamask-purple">{token.name}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-black text-metamask-black/40 uppercase tracking-widest">{token.symbol}</span>
                        <span className="font-black text-metamask-purple/60">{token.holders} Holders</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <TrendingUp className="w-16 h-16 text-metamask-black/5 mx-auto mb-6" />
                  <h3 className="text-2xl font-metamask-heading font-black text-metamask-purple mb-4">No Coins Created</h3>
                  <Link href="/create" className="btn-primary inline-flex py-4 px-10 rounded-full text-sm font-black uppercase tracking-widest">
                    Create Now
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl">
              <h2 className="text-3xl font-metamask-heading font-black text-metamask-purple mb-8">Account Settings</h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-metamask-black/40 mb-4">Display Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full bg-metamask-gray-50 border border-metamask-gray-100 rounded-[20px] px-6 py-4 font-bold text-metamask-purple focus:outline-none focus:border-metamask-orange transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-metamask-black/40 mb-4">Bio</label>
                  <textarea
                    placeholder="Tell the world about yourself..."
                    className="w-full bg-metamask-gray-50 border border-metamask-gray-100 rounded-[20px] px-6 py-4 font-bold text-metamask-purple focus:outline-none focus:border-metamask-orange transition-colors h-32 resize-none"
                  ></textarea>
                </div>
                <button className="btn-primary py-4 px-10 rounded-full text-sm font-black uppercase tracking-widest">
                  Save Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


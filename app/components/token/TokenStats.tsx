'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Coins, BarChart3 } from 'lucide-react';

interface TokenStatsProps {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  totalSupply: string;
}

export const TokenStats: React.FC<TokenStatsProps> = ({
  price,
  priceChange24h,
  marketCap,
  volume24h,
  holders,
  totalSupply,
}) => {
  const formatValue = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return '$0.00';
    if (price < 0.000001) {
      return price.toExponential(2);
    } else if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  };

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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* Price */}
      <div className="bg-white rounded-xl border border-metamask-gray-100 p-4 shadow-sm group hover:border-metamask-orange/30 transition-all">
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign className="w-4 h-4 text-metamask-orange" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</span>
        </div>
        <div className="text-lg font-metamask font-black text-metamask-purple">{formatPrice(price)}</div>
        {priceChange24h !== 0 && (
          <div
            className={`text-[10px] mt-1 font-bold flex items-center space-x-1 ${priceChange24h >= 0 ? 'text-metamask-green' : 'text-red-500'
              }`}
          >
            {priceChange24h >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {priceChange24h >= 0 ? '+' : ''}
              {priceChange24h.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Market Cap */}
      <div className="bg-white rounded-xl border border-metamask-gray-100 p-4 shadow-sm group hover:border-metamask-purple/30 transition-all">
        <div className="flex items-center space-x-2 mb-2">
          <BarChart3 className="w-4 h-4 text-metamask-purple" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market Cap</span>
        </div>
        <div className="text-lg font-metamask font-black text-metamask-purple">{formatValue(marketCap)}</div>
      </div>

      {/* 24h Volume */}
      <div className="bg-white rounded-xl border border-metamask-gray-100 p-4 shadow-sm group hover:border-metamask-orange/30 transition-all">
        <div className="flex items-center space-x-2 mb-2">
          <BarChart3 className="w-4 h-4 text-metamask-orange" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">24h Volume</span>
        </div>
        <div className="text-lg font-metamask font-black text-metamask-purple">{formatValue(volume24h)}</div>
      </div>

      {/* 24h Change */}
      <div className="bg-white rounded-xl border border-metamask-gray-100 p-4 shadow-sm transition-all overflow-hidden relative">
        <div className="flex items-center space-x-2 mb-2 relative z-10">
          {priceChange24h >= 0 ? (
            <TrendingUp className="w-4 h-4 text-metamask-green" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">24h Change</span>
        </div>
        <div
          className={`text-lg font-metamask font-black relative z-10 ${priceChange24h >= 0 ? 'text-metamask-green' : 'text-red-500'
            }`}
        >
          {priceChange24h >= 0 ? '+' : ''}
          {priceChange24h.toFixed(2)}%
        </div>
        <div className={`absolute bottom-0 left-0 w-full h-1 ${priceChange24h >= 0 ? 'bg-metamask-green' : 'bg-red-500'} opacity-20`}></div>
      </div>

      {/* Holders */}
      <div className="bg-white rounded-xl border border-metamask-gray-100 p-4 shadow-sm group hover:border-metamask-purple/30 transition-all">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-4 h-4 text-metamask-purple" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Holders</span>
        </div>
        <div className="text-lg font-metamask font-black text-metamask-purple">{holders.toLocaleString()}</div>
      </div>

      {/* Total Supply */}
      <div className="bg-white rounded-xl border border-metamask-gray-100 p-4 shadow-sm group hover:border-metamask-orange/30 transition-all">
        <div className="flex items-center space-x-2 mb-2">
          <Coins className="w-4 h-4 text-metamask-orange" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supply</span>
        </div>
        <div className="text-lg font-metamask font-black text-metamask-purple">{formatLargeNumber(totalSupply)}</div>
      </div>
    </div>
  );
};


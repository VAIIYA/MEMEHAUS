'use client';

import React from 'react';
import { ExternalLink, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Transaction {
    id: string;
    type: 'buy' | 'sell';
    user: string;
    amount: number;
    sol: number;
    timestamp: string;
    signature: string;
}

interface TransactionFeedProps {
    mintAddress: string;
    transactions?: Transaction[];
}

export const TransactionFeed: React.FC<TransactionFeedProps> = ({ mintAddress, transactions = [] }) => {
    // Use provided transactions or generate mock data
    const feedItems = transactions.length > 0 ? transactions : [
        {
            id: '1',
            type: 'buy',
            user: '6xX...3Yt',
            amount: 1540000,
            sol: 1.5,
            timestamp: '2m ago',
            signature: '5xX...'
        },
        {
            id: '2',
            type: 'sell',
            user: '4jZ...9Pk',
            amount: 850000,
            sol: 0.8,
            timestamp: '5m ago',
            signature: '3jZ...'
        },
        {
            id: '3',
            type: 'buy',
            user: '9qW...2Lm',
            amount: 2500000,
            sol: 2.4,
            timestamp: '12m ago',
            signature: '8qW...'
        }
    ] as Transaction[];

    const formatAddress = (address: string) => {
        return address.length > 10 ? `${address.slice(0, 4)}...${address.slice(-4)}` : address;
    };

    return (
        <div className="bg-white rounded-2xl border border-metamask-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-metamask-heading font-black text-metamask-purple">Activity</h2>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-metamask-green rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Updates</span>
                </div>
            </div>

            <div className="space-y-3">
                {feedItems.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-metamask-gray-100 hover:border-metamask-orange/30 transition-all group">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl transition-colors ${tx.type === 'buy' ? 'bg-metamask-green/10 text-metamask-green group-hover:bg-metamask-green group-hover:text-white' : 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white'}`}>
                                {tx.type === 'buy' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className={`font-metamask font-black ${tx.type === 'buy' ? 'text-metamask-green' : 'text-red-500'}`}>
                                        {tx.type === 'buy' ? 'Buy' : 'Sell'}
                                    </span>
                                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{tx.timestamp}</span>
                                </div>
                                <div className="text-sm font-mono font-bold text-metamask-purple/60">
                                    {formatAddress(tx.user)}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 px-4 text-right">
                            <div className="font-metamask font-black text-metamask-purple">
                                {tx.sol.toFixed(2)} SOL
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {tx.amount.toLocaleString()} Tokens
                            </div>
                        </div>

                        <a
                            href={`https://solscan.io/tx/${tx.signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-metamask-gray-50 hover:bg-metamask-gray-100 rounded-xl transition-all text-gray-400 hover:text-metamask-orange"
                        >
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                ))}
            </div>

            <button className="w-full mt-8 py-4 rounded-full bg-metamask-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-metamask-gray-100 hover:text-metamask-purple transition-all border border-metamask-gray-100">
                View All History
            </button>
        </div>
    );
};

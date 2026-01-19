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
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Transactions</h2>
                <div className="text-sm text-gray-400">Live Updates</div>
            </div>

            <div className="space-y-4">
                {feedItems.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${tx.type === 'buy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                {tx.type === 'buy' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className={`font-bold ${tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                                        {tx.type === 'buy' ? 'Buy' : 'Sell'}
                                    </span>
                                    <span className="text-gray-400 text-xs">{tx.timestamp}</span>
                                </div>
                                <div className="text-sm font-mono text-gray-300">
                                    {formatAddress(tx.user)}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="font-bold">
                                {tx.sol.toFixed(2)} SOL
                            </div>
                            <div className="text-xs text-gray-400">
                                {tx.amount.toLocaleString()} ${'TOKEN'}
                            </div>
                        </div>

                        <a
                            href={`https://solscan.io/tx/${tx.signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                        </a>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-gray-800/50 text-gray-400 text-sm font-semibold hover:bg-gray-800 hover:text-white transition-all">
                View All Transactions
            </button>
        </div>
    );
};

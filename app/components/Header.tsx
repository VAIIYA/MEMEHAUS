'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Menu, X } from 'lucide-react';
import { WalletConnectButton } from './WalletConnectButton';
import { NetworkIndicator } from './NetworkIndicator';

export const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="px-4 py-8 md:px-8 bg-white border-b border-metamask-gray-100 sticky top-0 z-50 shadow-sm">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-2 md:space-x-4">
                    <Link href="/" className="flex items-center space-x-2 md:space-x-4">
                        <Zap className="w-8 h-8 text-metamask-orange" />
                        <h1 className="text-xl md:text-3xl font-metamask-heading font-bold text-metamask-purple tracking-tight">
                            MemeHaus
                        </h1>
                    </Link>
                    <div className="hidden sm:block">
                        <NetworkIndicator />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-metamask-black hover:text-metamask-orange transition-colors p-2"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* Desktop Navigation Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold text-sm">
                        Home
                    </Link>
                    <Link href="/swap" className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold text-sm">
                        Swap
                    </Link>
                    <Link href="/create" className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold text-sm">
                        Create
                    </Link>
                    <Link href="/profile" className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold text-sm">
                        Profile
                    </Link>
                    <a
                        href="https://luckyhaus.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold text-sm"
                    >
                        LuckyHaus
                    </a>
                    <a
                        href="https://x.com/i/communities/1955936302764855712"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold text-sm flex items-center space-x-1"
                    >
                        <span>Community</span>
                    </a>
                </div>

                <WalletConnectButton />
            </nav>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-metamask-gray-100">
                    <div className="flex flex-col space-y-4 pt-6">
                        <Link href="/" className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold" onClick={() => setMobileMenuOpen(false)}>
                            Home
                        </Link>
                        <Link href="/swap" className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold" onClick={() => setMobileMenuOpen(false)}>
                            Swap
                        </Link>
                        <Link href="/create" className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold" onClick={() => setMobileMenuOpen(false)}>
                            Create
                        </Link>
                        <Link href="/profile" className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold" onClick={() => setMobileMenuOpen(false)}>
                            Profile
                        </Link>
                        <a
                            href="https://luckyhaus.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-metamask-black hover:text-metamask-orange transition-colors font-metamask font-semibold"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            LuckyHaus
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
};

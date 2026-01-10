'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Users, Coins, TrendingUp, Heart, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-night text-white mobile-container w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <header className="px-4 py-6 md:px-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-neon-cyan" />
            <Link href="/" className="text-lg md:text-2xl font-orbitron font-bold bg-gradient-sexy bg-clip-text text-transparent">
              MemeHaus
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-electric-pink transition-colors font-inter font-medium">
              Home
            </Link>
            <Link href="/swap" className="text-gray-300 hover:text-electric-pink transition-colors font-inter font-medium">
              Swap
            </Link>
            <Link href="/create" className="text-gray-300 hover:text-electric-pink transition-colors font-inter font-medium">
              Create
            </Link>
            <Link href="/liquidity" className="text-gray-300 hover:text-electric-pink transition-colors font-inter font-medium">
              Liquidity
            </Link>
            <Link href="/autostake" className="text-gray-300 hover:text-electric-pink transition-colors font-inter font-medium">
              Auto-Stake
            </Link>
            <Link href="/profile" className="text-gray-300 hover:text-electric-pink transition-colors font-inter font-medium">
              Profile
            </Link>
            <Link href="/about" className="text-electric-pink font-inter font-medium">
              About
            </Link>
            <a
              href="https://luckyhaus.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-electric-pink transition-colors font-inter font-medium"
            >
              LuckyHaus
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-black mb-6 leading-tight">
            <span className="bg-gradient-sexy bg-clip-text text-transparent animate-pulse shadow-glow-sexy">
              Welcome to MemeHaus
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-inter text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate Solana memecoin launchpad where creativity meets crypto.
            Join the Haus and be part of the revolution.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 text-electric-pink">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 mb-6 font-inter leading-relaxed">
                MemeHaus is more than just a token creation platform. We're building a community-driven ecosystem
                where creativity, humor, and innovation come together to create the next generation of memecoins.
              </p>
              <p className="text-lg text-gray-300 mb-6 font-inter leading-relaxed">
                Every token created on MemeHaus contributes 10% back to the community, ensuring that early adopters
                and active participants are rewarded for their support and engagement.
              </p>
              <p className="text-lg text-gray-300 font-inter leading-relaxed">
                Built on Solana for lightning-fast transactions and minimal fees, MemeHaus makes it easy for anyone
                to launch their meme dreams into the crypto universe.
              </p>
            </div>
            <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Users className="w-12 h-12 text-electric-purple mx-auto mb-4" />
                  <h3 className="text-xl font-orbitron font-bold text-electric-purple mb-2">Community First</h3>
                  <p className="text-gray-400 text-sm">10% of every token goes back to the Haus</p>
                </div>
                <div className="text-center">
                  <Coins className="w-12 h-12 text-electric-blue mx-auto mb-4" />
                  <h3 className="text-xl font-orbitron font-bold text-electric-blue mb-2">Solana Powered</h3>
                  <p className="text-gray-400 text-sm">Lightning-fast transactions, minimal fees</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-electric-pink mx-auto mb-4" />
                  <h3 className="text-xl font-orbitron font-bold text-electric-pink mb-2">Easy Creation</h3>
                  <p className="text-gray-400 text-sm">Launch your meme in minutes</p>
                </div>
                <div className="text-center">
                  <Heart className="w-12 h-12 text-electric-cyan mx-auto mb-4" />
                  <h3 className="text-xl font-orbitron font-bold text-electric-cyan mb-2">Fun Focused</h3>
                  <p className="text-gray-400 text-sm">Where memes meet money</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 text-electric-purple">
              How MemeHaus Works
            </h2>
            <p className="text-xl text-gray-300 font-inter max-w-2xl mx-auto">
              Creating and launching your memecoin has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-sexy rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-orbitron font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-orbitron font-bold text-electric-pink mb-4">Create Your Token</h3>
              <p className="text-gray-300 font-inter">
                Design your meme token with a catchy name, symbol, and upload your favorite meme image.
                Set your supply and you're ready to launch.
              </p>
            </div>

            <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-sexy rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-orbitron font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-orbitron font-bold text-electric-purple mb-4">Launch & Share</h3>
              <p className="text-gray-300 font-inter">
                Deploy your token on Solana and share it with the community. Watch as traders discover
                your creation and join the fun.
              </p>
            </div>

            <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 text-center">
              <div className="w-16 h-16 bg-gradient-sexy rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-orbitron font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-orbitron font-bold text-electric-blue mb-4">Earn Rewards</h3>
              <p className="text-gray-300 font-inter">
                As your token grows, you and the community earn rewards. 10% of all transactions
                go back to MemeHaus holders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="px-4 py-16 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-16 h-16 text-neon-cyan mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6 text-neon-cyan">
            Join the MemeHaus Family
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-inter">
            Ready to turn your meme into a movement? Join thousands of creators who've already
            launched their tokens on MemeHaus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create" className="px-8 py-4 bg-gradient-sexy rounded-full font-inter font-bold text-lg hover:shadow-glow-sexy transition-all duration-300 transform hover:scale-105 inline-block text-center">
              Create Your Token
            </Link>
            <Link href="/" className="px-8 py-4 border-2 border-electric-pink rounded-full font-inter font-bold text-lg text-electric-pink hover:bg-electric-pink hover:text-white transition-all duration-300 inline-block text-center">
              Explore Tokens
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 md:px-8 border-t border-gray-700/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Zap className="w-6 h-6 text-neon-cyan" />
            <span className="font-orbitron font-bold text-lg">MemeHaus</span>
          </div>
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <Link href="/about" className="text-gray-400 hover:text-electric-pink transition-colors font-inter text-sm">
              About
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-electric-pink transition-colors font-inter text-sm">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-electric-pink transition-colors font-inter text-sm">
              Terms
            </Link>
          </div>
          <div className="text-gray-400 font-inter text-sm text-center md:text-left">
            <a
              href="https://vaiiya.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-electric-pink transition-colors"
            >
              © 2026 VAIIYA. Built on Solana.
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
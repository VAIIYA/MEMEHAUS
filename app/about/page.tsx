'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Users, Coins, TrendingUp, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WalletNotification } from '../components/WalletNotification';

export default function About() {
  return (
    <div className="min-h-screen bg-metamask-gray-50 text-metamask-purple font-metamask overflow-x-hidden">
      <WalletNotification />
      <Header />

      {/* Hero Section */}
      <section className="px-4 py-20 md:px-8 md:py-32 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-metamask-orange/5 rounded-full -mr-64 -mt-64 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-metamask-purple/5 rounded-full -ml-64 -mb-64 blur-3xl"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-block bg-orange-50 text-metamask-orange px-6 py-2 rounded-full border border-orange-100 mb-8 font-black uppercase tracking-widest text-xs animate-bounce shadow-sm">
            The Future of Memes 🚀
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-metamask-heading font-black mb-8 leading-tight text-metamask-purple tracking-tighter">
            Welcome to <br />
            <span className="text-metamask-orange drop-shadow-sm">MemeHaus</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-metamask-black/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            The premier Solana launchpad where viral potential meets institutional-grade execution.
            Join the Haus, build the movement.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/create" className="btn-primary py-5 px-10 rounded-full text-lg shadow-xl shadow-orange-500/20">
              Launch Your Vision
            </Link>
            <Link href="/" className="bg-white border-2 border-metamask-purple/10 text-metamask-purple font-black py-5 px-10 rounded-full text-lg hover:bg-metamask-purple hover:text-white transition-all duration-300 shadow-sm">
              Discover Tokens
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-24 md:px-8 bg-white/50 border-y border-metamask-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-[48px] border border-metamask-gray-100 p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-metamask-purple/5 rounded-full -mr-16 -mt-16"></div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                      <Users className="w-7 h-7 text-metamask-purple" />
                    </div>
                    <h3 className="text-xl font-metamask-heading font-black text-metamask-purple">Community DNA</h3>
                    <p className="text-xs font-bold text-metamask-black/40 leading-relaxed uppercase tracking-wider">Built by holders, for holders. 10% auto-reward mechanism.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                      <Coins className="w-7 h-7 text-metamask-orange" />
                    </div>
                    <h3 className="text-xl font-metamask-heading font-black text-metamask-purple">Solana Core</h3>
                    <p className="text-xs font-bold text-metamask-black/40 leading-relaxed uppercase tracking-wider">Sub-second finality. Minimal gas. Maximum speed.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-metamask-green" />
                    </div>
                    <h3 className="text-xl font-metamask-heading font-black text-metamask-purple">Rapid Growth</h3>
                    <p className="text-xs font-bold text-metamask-black/40 leading-relaxed uppercase tracking-wider">Zero friction deployment. From idea to trade in 60s.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center">
                      <Heart className="w-7 h-7 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-metamask-heading font-black text-metamask-purple">Fun Focused</h3>
                    <p className="text-xs font-bold text-metamask-black/40 leading-relaxed uppercase tracking-wider">Where memetic desire drives economic value.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-metamask-heading font-black text-metamask-purple leading-tight">
                Engineering <br />
                <span className="text-metamask-orange">Financial Freedom</span>
                <br /> Through Humor
              </h2>
              <div className="space-y-6">
                <p className="text-lg font-bold text-metamask-black/60 leading-relaxed">
                  MemeHaus isn't just a launchpad; it's a social layer for value exchange. We're democratizing the creation of digital assets through the power of memes.
                </p>
                <div className="h-1 w-20 bg-metamask-orange rounded-full"></div>
                <ul className="space-y-4">
                  {[
                    "10% Community reward distribution",
                    "Permanently fixed token supplies",
                    "Institution-grade security audits",
                    "Seamless Raydium liquidity migration"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm font-black text-metamask-purple uppercase tracking-widest">
                      <Sparkles className="w-4 h-4 text-metamask-orange" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-24 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-metamask-heading font-black text-metamask-purple mb-6">
              The Path to <span className="text-metamask-orange text-shadow-sm">Moon</span>
            </h2>
            <p className="text-lg font-bold text-metamask-black/60 max-w-2xl mx-auto">
              A frictionless 3-step pipeline designed for speed and virality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Architect Your Vision",
                desc: "Configure name, symbol, and visual identity. Set your supply parameters in seconds.",
                color: "bg-purple-50",
                iconColor: "text-metamask-purple"
              },
              {
                step: "02",
                title: "Deploy & Amplify",
                desc: "Launch on the Solana mainnet instantly. Share your creation with the global MemeHaus feed.",
                color: "bg-orange-50",
                iconColor: "text-metamask-orange"
              },
              {
                step: "03",
                title: "Earn & Evolve",
                desc: "Watch as the bonding curve graduates. Earn rewards as the community grows with you.",
                color: "bg-green-50",
                iconColor: "text-metamask-green"
              }
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-[40px] border border-metamask-gray-100 p-10 shadow-sm group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${step.color} opacity-30 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform`}></div>
                <div className="text-5xl font-metamask-heading font-black text-metamask-black/5 mb-8">{step.step}</div>
                <h3 className="text-2xl font-metamask-heading font-black text-metamask-purple mb-4 relative z-10">{step.title}</h3>
                <p className="text-metamask-black/60 font-bold leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="px-4 py-32 md:px-8">
        <div className="max-w-5xl mx-auto text-center bg-metamask-purple rounded-[56px] p-16 md:p-24 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-metamask-purple to-purple-900 opacity-50"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

          <div className="relative z-10 space-y-10">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/20">
              <Sparkles className="w-12 h-12 text-white animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-6xl font-metamask-heading font-black text-white leading-tight">
              Ready to <span className="text-metamask-orange">Capture The Culture?</span>
            </h2>
            <p className="text-xl text-white/70 font-bold max-w-2xl mx-auto leading-relaxed">
              Don't just watch the next 1000x happen from the sidelines.
              Create it yourself or find it in the Haus.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/create" className="bg-metamask-orange text-white font-black py-5 px-12 rounded-full text-lg hover:scale-105 transition-all shadow-xl shadow-orange-500/30">
                Launch My Token
              </Link>
              <Link href="/" className="bg-white/10 border border-white/20 text-white font-black py-5 px-12 rounded-full text-lg hover:bg-white/20 transition-all backdrop-blur-sm">
                View Live Feed
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';

export default function Terms() {
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
            <Link href="/about" className="text-gray-300 hover:text-electric-pink transition-colors font-inter font-medium">
              About
            </Link>
            <Link href="/terms" className="text-electric-pink font-inter font-medium">
              Terms
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

      {/* Content */}
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-300 hover:text-electric-pink transition-colors font-inter mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Terms Content */}
          <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-8 text-center bg-gradient-sexy bg-clip-text text-transparent">
              Terms of Use
            </h1>

            <div className="space-y-6 text-gray-300 font-inter leading-relaxed">
              <p className="text-sm text-gray-400">
                Last Updated: January 2026
              </p>

              <p>
                These Terms of Use constitute a legally binding agreement between you ("you" or "your") and MemeHaus ("MemeHaus", "we", "our" or "us"). The Terms govern your use of all MemeHaus Services made available to you on or through the MemeHaus Platform or otherwise. MemeHaus Services may be developed, maintained, and/or provided by MemeHaus or MemeHaus Affiliates.
              </p>

              <p>
                By accessing the MemeHaus Platform and/or using the MemeHaus Services, you agree that you have read, understood and accepted these Terms, together with any additional documents. You acknowledge and agree that you will be bound by and will comply with these Terms, as updated and amended from time to time.
              </p>

              <p>
                If you do not understand and accept these Terms in their entirety, you should not use the MemeHaus Platform.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-pink mt-8 mb-4">
                RISK WARNING
              </h2>

              <p>
                The MemeHaus Platform and MemeHaus Services generally involve interacting with user-generated Digital Assets in various ways. Neither MemeHaus nor any affiliates are responsible for user-generated Digital Assets that you may, in your sole discretion, engage with on the MemeHaus Platform or via the MemeHaus Services. Please ensure that you fully understand the risks involved with user-generated Digital Assets before using the MemeHaus Platform and MemeHaus Services.
              </p>

              <p>
                The value of User-Generated Digital Assets, especially memecoins that are commonly found on the MemeHaus Platform and as part of the MemeHaus Services, can fluctuate significantly and there is a material risk of economic loss when buying, selling, holding or investing in any Digital Asset. You should therefore consider whether participating on the MemeHaus Platform in general or MemeHaus Services specifically is suitable for you taking into account your personal circumstances, financial, or otherwise.
              </p>

              <p>
                You acknowledge that we are not your broker, intermediary, agent or advisor and we have no fiduciary relationship or obligation to you in connection with any activities you undertake when using the MemeHaus Platform or MemeHaus Services. We do not and are not providing any investment or consulting advice and no communication or information that we provide to you is intended to be, or should be construed as, advice of any kind. We do not recommend that any user-generated Digital Asset be bought, earned, sold or held by you under any circumstances.
              </p>

              <p>
                You are responsible for determining whether any user-generated Digital Asset is appropriate for you to acquire, transact in, or otherwise use on the MemeHaus Platform or with MemeHaus Services based on your personal investment objectives, financial circumstances and risk tolerance. You are responsible for any associated loss or liability.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-purple mt-8 mb-4">
                1. Introduction
              </h2>

              <p>
                1.1. MemeHaus is a platform designed to assist with the creation and trading of Digital Assets. The MemeHaus group provides users with a platform to create Digital Assets.
              </p>

              <p>
                1.2. By using the MemeHaus Platform you are entering into a legally binding agreement with us. These Terms will govern your use of the MemeHaus Platform.
              </p>

              <p>
                1.3. You must read these Terms, together with the documents referenced in the Terms, carefully and let us know if you do not understand anything.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-blue mt-8 mb-4">
                2. Eligibility
              </h2>

              <p>
                2.1. To be eligible to use the MemeHaus Platform, you must:
              </p>

              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>be an individual, corporation, legal person, entity or other organisation with the full power, authority and capacity to enter into these Terms</li>
                <li>be at least 18 years old</li>
                <li>comply with all applicable laws and regulations</li>
                <li>not be prohibited from using the services under applicable law</li>
              </ul>

              <h2 className="text-2xl font-orbitron font-bold text-electric-pink mt-8 mb-4">
                3. User Accounts
              </h2>

              <p>
                3.1. To access certain features of the MemeHaus Platform, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials.
              </p>

              <p>
                3.2. You agree to provide accurate and complete information when creating your account and to update this information as necessary.
              </p>

              <p>
                3.3. You are solely responsible for all activities that occur under your account.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-purple mt-8 mb-4">
                4. Prohibited Activities
              </h2>

              <p>
                You agree not to engage in any of the following prohibited activities:
              </p>

              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Violating any applicable laws or regulations</li>
                <li>Creating tokens with illegal, harmful, or offensive content</li>
                <li>Attempting to manipulate token prices or markets</li>
                <li>Using the platform for money laundering or other illicit activities</li>
                <li>Impersonating other users or entities</li>
                <li>Interfering with the platform's operations</li>
              </ul>

              <h2 className="text-2xl font-orbitron font-bold text-electric-blue mt-8 mb-4">
                5. Intellectual Property
              </h2>

              <p>
                5.1. The MemeHaus Platform and its original content, features, and functionality are owned by MemeHaus and are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <p>
                5.2. You retain ownership of the content you create and upload to the platform, but grant MemeHaus a license to use, display, and distribute such content on the platform.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-pink mt-8 mb-4">
                6. Disclaimers
              </h2>

              <p>
                6.1. The MemeHaus Platform is provided "as is" and "as available" without warranties of any kind, either express or implied.
              </p>

              <p>
                6.2. MemeHaus does not guarantee the accuracy, completeness, or reliability of any content or information on the platform.
              </p>

              <p>
                6.3. You acknowledge that cryptocurrency transactions carry significant risks, including the potential loss of your entire investment.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-purple mt-8 mb-4">
                7. Limitation of Liability
              </h2>

              <p>
                To the fullest extent permitted by applicable law, MemeHaus shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the platform.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-blue mt-8 mb-4">
                8. Indemnification
              </h2>

              <p>
                You agree to indemnify and hold harmless MemeHaus and its affiliates from any claims, damages, losses, or expenses arising from your use of the platform or violation of these Terms.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-pink mt-8 mb-4">
                9. Termination
              </h2>

              <p>
                9.1. MemeHaus may terminate or suspend your account and access to the platform at any time, with or without cause.
              </p>

              <p>
                9.2. Upon termination, your right to use the platform will cease immediately.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-purple mt-8 mb-4">
                10. Governing Law
              </h2>

              <p>
                These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-blue mt-8 mb-4">
                11. Contact Information
              </h2>

              <p>
                If you have any questions about these Terms, please contact us at:
              </p>

              <div className="bg-black/30 rounded-lg p-4 mt-4">
                <p className="text-electric-cyan font-mono">
                  legal@memehaus.com
                </p>
              </div>

              <p className="text-sm text-gray-400 mt-8">
                These Terms were last updated in January 2026. Continued use of the MemeHaus Platform after any changes constitutes acceptance of the new Terms.
              </p>
            </div>
          </div>
        </div>
      </main>

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
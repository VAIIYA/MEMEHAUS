'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Footer';

export default function Privacy() {
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
            <Link href="/privacy" className="text-electric-pink font-inter font-medium">
              Privacy
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

          {/* Privacy Policy Content */}
          <div className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold mb-8 text-center bg-gradient-sexy bg-clip-text text-transparent">
              Privacy Notice
            </h1>

            <div className="space-y-6 text-gray-300 font-inter leading-relaxed">
              <p className="text-sm text-gray-400">
                Last Updated: January 2026
              </p>

              <p>
                This "Privacy Notice" describes the privacy practices of MemeHaus and MemeHaus Affiliates (collectively, "MemeHaus", "our", "us" or "we"), in connection with the Sites and the MemeHaus Platform (collectively, "Services"). This Privacy Notice also explains the rights and choices available to individuals with respect to their information.
              </p>

              <p>
                Please read this Privacy Notice carefully to understand our policies and practices regarding your information. If you do not agree with our policies and practices, please do not use the MemeHaus Platform. By accessing or using the MemeHaus Platform, you acknowledge and agree to the terms of this Privacy Notice.
              </p>

              <p>
                We may update this Privacy Notice based upon evolving laws, regulations and industry standards, or as we may make changes to the MemeHaus Platform. If we make changes that materially alter your privacy rights, we will take appropriate measures to inform you, consistent with the significance of the changes we make. If you disagree with the changes to this Privacy Notice, you should discontinue your access and use of the MemeHaus Platform.
              </p>

              <p>
                Our Site and the MemeHaus Platform are not directed to, and we do not knowingly collect Personal Data from, anyone under the age of 18. If a parent or guardian becomes aware that his or her child has provided us with information, they should contact us. We will delete such information from our files as soon as reasonably practicable.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-pink mt-8 mb-4">
                Personal Data Controller
              </h2>

              <p>
                The term "Personal Data" as used in this policy, describes information that can be associated with a specific person and can identify that person. Personal Data does not include information that has been anonymized or aggregated so that it can no longer be used to identify a specific person, whether in combination with other information or otherwise.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-purple mt-8 mb-4">
                Information We Collect
              </h2>

              <h3 className="text-xl font-orbitron font-semibold text-electric-blue mt-6 mb-3">
                Information You Provide to Us
              </h3>

              <p>
                We collect information you provide directly to us. For example, we collect information when you:
              </p>

              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Create an account or use our Services</li>
                <li>Provide information in your account profile</li>
                <li>Contact us for support</li>
                <li>Participate in surveys or promotions</li>
                <li>Post content on our platform</li>
              </ul>

              <h3 className="text-xl font-orbitron font-semibold text-electric-blue mt-6 mb-3">
                Information We Collect Automatically
              </h3>

              <p>
                When you access or use our Services, we automatically collect certain information, including:
              </p>

              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Location information (approximate location based on IP)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-2xl font-orbitron font-bold text-electric-purple mt-8 mb-4">
                How We Use Your Information
              </h2>

              <p>
                We use the information we collect for various purposes, including to:
              </p>

              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Provide, maintain, and improve our Services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-orbitron font-bold text-electric-pink mt-8 mb-4">
                Information Sharing
              </h2>

              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Notice. We may share your information in the following circumstances:
              </p>

              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>With service providers who assist us in operating our platform</li>
                <li>To comply with legal obligations or court orders</li>
                <li>To protect our rights, property, or safety</li>
                <li>In connection with a business transfer or merger</li>
              </ul>

              <h2 className="text-2xl font-orbitron font-bold text-electric-purple mt-8 mb-4">
                Data Security
              </h2>

              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>

              <h2 className="text-2xl font-orbitron font-bold text-electric-blue mt-8 mb-4">
                Your Rights and Choices
              </h2>

              <p>
                Depending on your location, you may have certain rights regarding your personal information:
              </p>

              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Access: Request a copy of your personal information</li>
                <li>Correction: Request correction of inaccurate information</li>
                <li>Deletion: Request deletion of your personal information</li>
                <li>Portability: Request transfer of your information</li>
                <li>Opt-out: Opt-out of certain data processing activities</li>
              </ul>

              <h2 className="text-2xl font-orbitron font-bold text-electric-pink mt-8 mb-4">
                Contact Us
              </h2>

              <p>
                If you have any questions about this Privacy Notice or our privacy practices, please contact us at:
              </p>

              <div className="bg-black/30 rounded-lg p-4 mt-4">
                <p className="text-electric-cyan font-mono">
                  privacy@memehaus.com
                </p>
              </div>

              <p className="text-sm text-gray-400 mt-8">
                This Privacy Notice was last updated in January 2026. We may update this notice from time to time, and we will notify you of any material changes.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
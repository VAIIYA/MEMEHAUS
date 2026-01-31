'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { ArrowLeft, Zap } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { CreateTokenForm } from '../components/token-creation/CreateTokenForm';
import { TokenCreationModal } from '../components/TokenCreationModal';
import { sanitizeTokenFormData, TokenFormData } from '../lib/sanitize';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WalletNotification } from '../components/WalletNotification';

export default function CreateToken() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showTokenModal, setShowTokenModal] = useState(false);

  // Track if component is mounted to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoized initial form data
  const initialFormData = useMemo(() => {
    if (mounted && typeof window !== 'undefined') {
      const saved = localStorage.getItem('memehaus_token_form');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return sanitizeTokenFormData(
            { ...parsed, image: null },
            undefined,
            { preserveBinaryFields: true }
          );
        } catch (e) {
          console.log('Failed to parse saved form data');
        }
      }
    }

    return sanitizeTokenFormData({}, undefined, { preserveBinaryFields: true });
  }, [mounted]);

  const [formData, setFormData] = useState<TokenFormData>(initialFormData);

  // Memoized form handlers
  const handleFormUpdate = useCallback((data: Partial<TokenFormData>) => {
    setFormData(prev => {
      const sanitizedData = sanitizeTokenFormData({ ...prev, ...data }, prev);

      if (typeof window !== 'undefined') {
        const { image: _image, ...storageSafeData } = sanitizedData;
        localStorage.setItem('memehaus_token_form', JSON.stringify(storageSafeData));
      }

      return sanitizedData;
    });
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - show token creation modal
      setShowTokenModal(true);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Memoized step titles
  const stepTitles = useMemo(() => [
    'Basic Information',
    'Social Links',
    'Tokenomics'
  ], []);

  return (
    <div className="min-h-screen bg-metamask-gray-50 text-metamask-black font-metamask">
      <WalletNotification />
      <Header />

      {/* Main Content */}
      <main className="px-4 py-20 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="mb-6 inline-block bg-white shadow-sm border border-metamask-gray-100 rounded-full px-4 py-2 text-metamask-purple font-bold text-xs uppercase tracking-widest">
              Token Launchpad
            </div>
            <h2 className="text-5xl md:text-7xl font-metamask-heading font-black mb-8 text-metamask-purple">
              Bring your <span className="text-metamask-orange">vision to life.</span>
            </h2>
            <p className="text-xl text-metamask-black/60 max-w-2xl mx-auto leading-relaxed">
              Launch your memecoin on Solana in just 3 simple steps. Reliable, secure, and community-driven.
              {!connected && (
                <span className="block mt-4 text-metamask-orange font-bold">
                  Connect your wallet to get started
                </span>
              )}
            </p>
          </div>

          {/* Wallet Connection Required */}
          {!connected && (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white border border-metamask-gray-100 rounded-3xl p-12 shadow-sm">
                <div className="w-20 h-20 bg-orange-50 text-metamask-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-metamask-heading font-bold text-metamask-purple mb-4">
                  Wallet Required
                </h3>
                <p className="text-metamask-black/60 mb-8">
                  Please connect your wallet to access the token creation tools.
                </p>
                <Link href="/" className="inline-block text-metamask-purple font-bold hover:text-metamask-orange transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </div>
          )}

          {/* Token Creation Form */}
          {connected && (
            <div className="bg-white border border-metamask-gray-100 rounded-[32px] p-8 md:p-12 shadow-sm">
              <CreateTokenForm
                formData={formData}
                onUpdate={handleFormUpdate}
                onNext={handleNext}
                onBack={handleBack}
                currentStep={currentStep}
                totalSteps={3}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Token Creation Modal */}
      {showTokenModal && (
        <TokenCreationModal
          isOpen={showTokenModal}
          onClose={() => setShowTokenModal(false)}
          tokenParams={{
            name: formData.name,
            symbol: formData.symbol,
            description: formData.description,
            image: formData.image,
            imageUrl: formData.imageUrl,
            socialLinks: formData.socialLinks,
            tokenomics: formData.tokenomics
          }}
        />
      )}
    </div>
  );
}

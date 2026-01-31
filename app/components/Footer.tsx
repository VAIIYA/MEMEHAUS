'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="px-4 py-12 md:px-8 bg-white border-t border-metamask-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-3 mb-6 md:mb-0">
          <Zap className="w-8 h-8 text-metamask-orange" />
          <span className="font-metamask-heading font-bold text-2xl text-metamask-purple">MemeHaus</span>
        </div>
        <div className="flex items-center space-x-8 mb-6 md:mb-0">
          <Link href="/about" className="text-metamask-black/60 hover:text-metamask-orange transition-colors font-metamask font-semibold text-sm">
            About
          </Link>
          <Link href="/privacy" className="text-metamask-black/60 hover:text-metamask-orange transition-colors font-metamask font-semibold text-sm">
            Privacy
          </Link>
          <Link href="/terms" className="text-metamask-black/60 hover:text-metamask-orange transition-colors font-metamask font-semibold text-sm">
            Terms
          </Link>
        </div>
        <div className="text-metamask-black/40 font-metamask text-xs text-center md:text-left font-bold uppercase tracking-widest">
          <a
            href="https://vaiiya.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-metamask-orange transition-colors"
          >
            © 2025 VAIIYA. It's All a Meme.
          </a>
        </div>
      </div>
    </footer>
  );
};
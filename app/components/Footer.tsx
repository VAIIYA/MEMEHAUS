'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
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
            © 2025 VAIIYA. It's All a Meme.
          </a>
        </div>
      </div>
    </footer>
  );
};
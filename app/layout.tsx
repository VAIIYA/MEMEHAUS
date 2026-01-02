import type { Metadata } from 'next'
import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from './providers/WalletProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './components/ToastProvider'
import { validateEnvironment } from './lib/env'
import Script from 'next/script'

// Validate environment variables on app startup
if (typeof window === 'undefined') {
  try {
    validateEnvironment();
  } catch (error) {
    console.error('Environment validation failed:', error);
  }
}

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  title: 'MemeHaus - Memecoin Launchpad',
  description: 'MemeHaus is your all-in-one Solana hub — create, trade, stake, and explore the blockchain faster than Doc Brown\'s DeLorean. Roads? Where we\'re going, we don\'t need roads.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'MemeHaus - Memecoin Launchpad',
    description: 'The premier Solana launchpad for memecoins. Create, trade, and stake with 10% community rewards.',
    url: 'https://memehaus.vercel.app',
    siteName: 'MemeHaus',
    images: [
      {
        url: 'https://memehaus.vercel.app/favicon.png',
        width: 512,
        height: 512,
        alt: 'MemeHaus Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MemeHaus - Memecoin Launchpad',
    description: 'Create, trade, and stake memecoins on Solana with community rewards.',
    images: ['https://memehaus.vercel.app/favicon.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <Script
          src="https://plugin.jup.ag/plugin-v1.js"
          strategy="beforeInteractive"
          data-preload
          defer
        />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} font-inter`}>
        <ErrorBoundary>
          <WalletContextProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </WalletContextProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 
# MemeHaus - Create Memecoins on Solana

MemeHaus is your all-in-one Solana hub — create, trade, stake, and explore the blockchain faster than Doc Brown's DeLorean. Launch your next viral memecoin on Solana with our easy-to-use platform.

![MemeHaus](https://img.shields.io/badge/MemeHaus-Memecoin%20Creator-brightgreen)
![Solana](https://img.shields.io/badge/Solana-Mainnet-purple)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🚀 Features

- **Token Creation**: Launch memecoins in minutes with our intuitive 3-step process
- **Token Trading**: Swap tokens instantly with the best rates on Solana
- **Liquidity Pools**: Provide liquidity and earn rewards
- **Auto-Staking**: Optimize your yields with automated staking
- **Wallet Integration**: Support for Phantom, Solflare, Backpack, and more
- **Modern UI**: Beautiful, responsive design with Solana-inspired colors
- **Real-time Data**: Live token prices, volumes, and market data

## 🎨 Design Inspiration

MemeHaus combines sleek design with Solana.com's signature color palette:

- **Primary Green**: `#14F195` (Solana Green)
- **Secondary Purple**: `#9945FF` (Solana Purple)
- **Accent Coral**: `#FF6B6B` (Coral Accent)
- **Dark Background**: `#0F0F23` (Deep Space)
- **Card Background**: `#1E1E2E` (Glass Morphism)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Wallets**: Solana Wallet Adapter
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/memehaus.git
   cd memehaus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_NETWORK=mainnet-beta
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on every push

3. **Custom Domain**
   - Configure `memehaus.vercel.app` in Vercel settings
   - Add custom domain if needed

### Manual Deployment

```bash
npm run build
npm start
```

## 📱 Pages & Features

### Homepage (`/`)
- Hero section with "When this baby hits MemeHaus" theme
- Platform statistics and trending tokens
- Quick action cards for main features
- Responsive navigation with wallet connection

### Token Creation (`/create`)
- 3-step wizard for token creation
- Basic information (name, symbol, supply)
- Token image and social links
- Tokenomics configuration (burn, tax)
- Success confirmation with contract details

### Token Trading (`/swap`)
- Intuitive swap interface
- Slippage tolerance settings
- Real-time rate calculations
- Popular tokens list
- Transaction details and fees

### Liquidity Pools (`/liquidity`)
- Add/remove liquidity interface
- Pool statistics and APY
- Impermanent loss warnings
- Yield farming opportunities

### Auto-Staking (`/auto-stake`)
- Automated yield optimization
- Strategy selection
- Performance tracking
- Risk management tools

## 🔧 Configuration

### Solana Network
The app is configured for Solana Mainnet by default. To switch networks:

```typescript
// app/providers.tsx
const network = WalletAdapterNetwork.Mainnet // or Devnet, Testnet
```

### RPC Endpoints
Configure your preferred RPC endpoint:

```typescript
const endpoint = 'https://api.mainnet-beta.solana.com'
```

### Supported Wallets
- Phantom
- Solflare
- Backpack
- Torus
- Ledger
- Slope

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic token creation
- ✅ Token swapping interface
- ✅ Wallet integration
- ✅ Responsive design

### Phase 2 (Next)
- 🔄 Advanced tokenomics
- 🔄 Liquidity pool management
- 🔄 Auto-staking features
- 🔄 Analytics dashboard

### Phase 3 (Future)
- 📋 Cross-chain bridges
- 📋 NFT integration
- 📋 DAO governance
- 📋 Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Built on Solana blockchain
- Styled with Solana.com color palette
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support

- **Website**: [memehaus.vercel.app](https://memehaus.vercel.app)
- **Discord**: [Join our community](https://discord.gg/memehaus)
- **Twitter**: [@memehaus_app](https://twitter.com/memehaus_app)
- **Email**: support@memehaus.app

---

**Built for time travelers, by time travelers.** ⚡

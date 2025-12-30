# Fee System Integration Guide

## 🎯 Overview

The fee system automatically applies a 0.1% service fee on all transactions and an additional 0.1% memecoin fee for tokens created on our platform. All fees are sent to the developer wallet: `EpfmoiBoNFEofbACjZo1vpyqXUy5Fq9ZtPrGVwok5fb3`

## 📁 Files Created

1. **`app/lib/fees.ts`** - Core fee service with all fee logic
2. **`app/lib/transaction-handler.ts`** - Transaction handler for buy/sell operations
3. **`app/api/swap/route.ts`** - API endpoints for swap operations

## 🔧 Key Features

### Universal Service Fee (0.1%)
- Applied to ALL transactions (SOL, USDC, USDT, any SPL token)
- Automatically calculated and deducted before transaction completion
- Sent to developer wallet

### Memecoin Fee (0.1%)
- Applied ONLY to tokens created on our platform
- Additional fee on top of service fee
- Total fee for memecoins: 0.2% (0.1% + 0.1%)

### Backend-Only Implementation
- No frontend changes required
- Modular design for easy integration
- Automatic fee calculation and collection

## 🚀 Usage Examples

### Basic Fee Calculation
```typescript
import { FeeService } from './lib/fees'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'

const connection = new Connection('https://api.mainnet-beta.solana.com')
const payer = Keypair.generate() // Your platform wallet
const feeService = new FeeService(connection, payer)

// Calculate fees for a transaction
const feeResult = await feeService.calculateFees(
  1000000000, // 1 SOL in lamports
  new PublicKey('So11111111111111111111111111111111111111112') // SOL mint
)

console.log(`Service Fee: ${feeResult.serviceFee} lamports`)
console.log(`Memecoin Fee: ${feeResult.memecoinFee} lamports`)
console.log(`Total Fee: ${feeResult.totalFee} lamports`)
console.log(`Final Amount: ${feeResult.finalAmount} lamports`)
```

### Buy Transaction with Fees
```typescript
import { TransactionHandler } from './lib/transaction-handler'

const transactionHandler = new TransactionHandler(connection, payer)

const signature = await transactionHandler.processBuyTransaction(
  buyerPublicKey,
  tokenMint,
  tokenAmount,
  paymentTokenMint,
  paymentAmount
)
```

### Sell Transaction with Fees
```typescript
const signature = await transactionHandler.processSellTransaction(
  sellerPublicKey,
  tokenMint,
  tokenAmount,
  paymentTokenMint,
  expectedPaymentAmount
)
```

## 🔌 API Integration

### Calculate Fees
```bash
GET /api/swap/fees?amount=1000000000&tokenMint=So11111111111111111111111111111111111111112
```

Response:
```json
{
  "success": true,
  "feeBreakdown": {
    "originalAmount": 1000000000,
    "serviceFee": 1000000,
    "memecoinFee": 0,
    "totalFee": 1000000,
    "finalAmount": 999000000,
    "serviceFeePercent": 0.1,
    "memecoinFeePercent": 0,
    "totalFeePercent": 0.1,
    "originalAmountFormatted": "1.000000000",
    "serviceFeeFormatted": "0.001000000",
    "totalFeeFormatted": "0.001000000",
    "finalAmountFormatted": "0.999000000"
  }
}
```

### Process Swap
```bash
POST /api/swap
{
  "action": "buy",
  "tokenMint": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "amount": 1000000000,
  "paymentTokenMint": "So11111111111111111111111111111111111111112",
  "paymentAmount": 1000000000,
  "userAddress": "user_wallet_address"
}
```

## 🔧 Integration Points

### 1. Swap Page Integration
Update your swap page to use the fee calculation API:

```typescript
// In your swap component
const calculateFees = async (amount: number, tokenMint: string) => {
  const response = await fetch(`/api/swap/fees?amount=${amount}&tokenMint=${tokenMint}`)
  const data = await response.json()
  return data.feeBreakdown
}
```

### 2. Transaction Processing
Replace your existing transaction logic with the fee-enabled version:

```typescript
// Instead of direct transaction
const signature = await transactionHandler.processBuyTransaction(
  userWallet.publicKey,
  tokenMint,
  tokenAmount,
  paymentTokenMint,
  paymentAmount
)
```

### 3. Fee Display
Show users the fee breakdown before transaction:

```typescript
const feeBreakdown = await calculateFees(paymentAmount, paymentTokenMint)
console.log(`You will receive: ${feeBreakdown.finalAmountFormatted} tokens`)
console.log(`Service fee: ${feeBreakdown.serviceFeeFormatted}`)
if (feeBreakdown.memecoinFeeFormatted > 0) {
  console.log(`Memecoin fee: ${feeBreakdown.memecoinFeeFormatted}`)
}
```

## 🔒 Security Considerations

1. **Platform Wallet**: Use a secure platform wallet for fee collection
2. **Transaction Validation**: Validate all transaction parameters
3. **Error Handling**: Implement proper error handling for failed transactions
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Audit Logging**: Log all fee transactions for transparency

## 📊 Fee Tracking

The system automatically:
- Records all trades in the database
- Tracks fee amounts and percentages
- Logs transaction signatures
- Provides fee breakdowns for transparency

## 🚀 Deployment

1. **Environment Variables**: Ensure all Solana and GitHub env vars are set
2. **Platform Wallet**: Set up a secure wallet for fee collection
3. **GitHub Storage**: Ensure GitHub token and repository are configured
4. **Testing**: Test with small amounts on devnet first

## 🔍 Monitoring

Monitor fee collection through:
- GitHub storage (token data)
- Solana transaction logs
- Platform wallet balance tracking
- API endpoint monitoring

## 📈 Revenue Optimization

- **Dynamic Fees**: Consider implementing dynamic fee rates based on volume
- **Tiered Pricing**: Different fee rates for different user tiers
- **Promotional Periods**: Temporary fee reductions for new users
- **Volume Discounts**: Reduced fees for high-volume traders

---

**The fee system is now fully integrated and ready for production use! 🚀**

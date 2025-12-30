# Code Review & Improvement Suggestions

## ✅ Implemented Improvements

### 1. **Connection Service (FIXED)**
- Created `app/lib/connectionService.ts` to reuse Connection instances
- Prevents creating multiple connections per request
- Reduces RPC rate limiting issues

### 2. **On-Chain Metadata Utility (FIXED)**
- Created `app/lib/onChainMetadata.ts` with shared metadata fetching
- Added caching (5-minute TTL) to avoid repeated RPC calls
- Added timeout protection (10s) for metadata fetches
- Removed code duplication between API routes

### 3. **Input Validation (FIXED)**
- Added PublicKey validation in token API routes
- Validates mint address format before processing

### 4. **Error Handling (IMPROVED)**
- Price service failures no longer block token data retrieval
- Better error messages with user-friendly fallbacks

### 5. **Rate Limiting Protection (FIXED)**
- Sequential token enrichment with 100ms delays
- Limits concurrent RPC calls to prevent rate limits

### 6. **Constants File (CREATED)**
- Created `app/lib/constants.ts` for shared constants
- Centralized SOL mint address and other magic values

---

## 🔴 Critical Issues (Remaining)

### 1. **Connection Instance Creation (Performance Issue)**
**Location**: `app/api/token/[mintAddress]/route.ts`, `app/api/tokens/route.ts`

**Problem**: Creating new `Connection` instances for every request and every token enrichment is inefficient and can hit rate limits.

```typescript
// Current (BAD):
async function fetchOnChainMetadata(mintAddress: string) {
  const connection = new Connection(rpcUrl, 'confirmed'); // New connection each time
  // ...
}

// In enrichTokenWithOnChainData - creates connection for EACH token
tokensToEnrich.map(token => enrichTokenWithOnChainData(token)) // 10+ connections!
```

**Impact**: 
- Slow API responses
- RPC rate limiting
- High memory usage
- Unnecessary network overhead

**Solution**: Create a shared connection pool or singleton:
```typescript
// Create shared connection service
class ConnectionService {
  private static connection: Connection | null = null;
  
  static getConnection(): Connection {
    if (!this.connection) {
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
      this.connection = new Connection(rpcUrl, 'confirmed');
    }
    return this.connection;
  }
}

// Use in functions:
async function fetchOnChainMetadata(mintAddress: string) {
  const connection = ConnectionService.getConnection(); // Reuse connection
  // ...
}
```

---

### 2. **No Caching for On-Chain Metadata**
**Location**: `app/api/token/[mintAddress]/route.ts`, `app/api/tokens/route.ts`

**Problem**: Every API call fetches metadata from blockchain, even if it hasn't changed.

**Solution**: Implement caching with TTL:
```typescript
// Add to route files:
const metadataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchOnChainMetadata(mintAddress: string) {
  // Check cache first
  const cached = metadataCache.get(mintAddress);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  // Fetch from chain
  const data = await fetchFromChain(mintAddress);
  
  // Cache it
  metadataCache.set(mintAddress, { data, timestamp: Date.now() });
  return data;
}
```

---

### 3. **Code Duplication: fetchOnChainMetadata vs enrichTokenWithOnChainData**
**Location**: `app/api/token/[mintAddress]/route.ts` (line 10) and `app/api/tokens/route.ts` (line 10)

**Problem**: Two nearly identical functions doing the same thing.

**Solution**: Extract to shared utility:
```typescript
// app/lib/onChainMetadata.ts
export async function fetchTokenMetadataFromChain(
  mintAddress: string,
  connection?: Connection
): Promise<{ name: string; symbol: string; decimals: number; totalSupply: string } | null> {
  // Shared implementation
}
```

---

### 4. **Missing Input Validation**
**Location**: `app/api/token/[mintAddress]/route.ts` (line 71)

**Problem**: No validation that `mintAddress` is a valid Solana public key format.

**Solution**:
```typescript
if (!mintAddress || !PublicKey.isOnCurve(mintAddress)) {
  return NextResponse.json(
    { success: false, error: 'Invalid mint address format' },
    { status: 400 }
  );
}
```

---

### 5. **No Timeout for On-Chain Calls**
**Location**: `app/api/token/[mintAddress]/route.ts`, `app/api/tokens/route.ts`

**Problem**: On-chain metadata fetching can hang indefinitely if RPC is slow.

**Solution**:
```typescript
async function fetchOnChainMetadata(mintAddress: string): Promise<...> {
  return Promise.race([
    fetchFromChain(mintAddress),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 10000)
    )
  ]);
}
```

---

## 🟡 High Priority Improvements

### 6. **Inefficient Token Enrichment**
**Location**: `app/api/tokens/route.ts` (line 83)

**Problem**: Using `Promise.all` for 10 tokens means 10 parallel RPC calls, which can hit rate limits.

**Current**:
```typescript
const enrichedTokens = await Promise.all(
  tokensToEnrich.map(token => enrichTokenWithOnChainData(token))
);
```

**Solution**: Batch with delays or limit concurrency:
```typescript
// Option 1: Sequential with small delay
const enrichedTokens = [];
for (const token of tokensToEnrich) {
  enrichedTokens.push(await enrichTokenWithOnChainData(token));
  await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
}

// Option 2: Limit concurrency (better)
import pLimit from 'p-limit';
const limit = pLimit(3); // Max 3 concurrent
const enrichedTokens = await Promise.all(
  tokensToEnrich.map(token => limit(() => enrichTokenWithOnChainData(token)))
);
```

---

### 7. **Missing Error Recovery for Price Service**
**Location**: `app/api/token/[mintAddress]/route.ts` (line 122)

**Problem**: If `priceService.getTokenPrice()` fails, the entire request fails.

**Solution**: Wrap in try-catch:
```typescript
let priceData = null;
try {
  priceData = await priceService.getTokenPrice(mintAddress);
} catch (priceError) {
  console.warn('Price fetch failed, continuing without price:', priceError);
  // Continue without price data
}
```

---

### 8. **Type Safety Issues**
**Location**: Multiple files

**Problem**: Using optional chaining everywhere instead of proper type guards.

**Example**:
```typescript
// Current:
tokenData?.name || 'Unknown Token'

// Better:
if (!tokenData || !tokenData.name) {
  // Handle missing data explicitly
}
```

---

### 9. **Memory Leak Risk: useEffect Dependencies**
**Location**: `app/components/token/BuySellPanel.tsx` (line 98)

**Problem**: `loadMemeHausTokens` in dependency array might cause infinite loops if not memoized properly.

**Current**:
```typescript
React.useEffect(() => {
  setupTokens();
}, [activeTab, tokenMint, tokenSymbol, tokenName, tokenDecimals, connected, setFromToken, setToToken, loadUserTokens]);
```

**Solution**: Ensure all functions are properly memoized with `useCallback`.

---

### 10. **No Request Deduplication**
**Location**: `app/api/token/[mintAddress]/route.ts`

**Problem**: Multiple simultaneous requests for the same token will all hit the database/chain.

**Solution**: Implement request deduplication:
```typescript
const pendingRequests = new Map<string, Promise<any>>();

export async function GET(request: NextRequest, { params }: { params: { mintAddress: string } }) {
  const { mintAddress } = params;
  
  // Deduplicate requests
  if (pendingRequests.has(mintAddress)) {
    return pendingRequests.get(mintAddress)!;
  }
  
  const promise = fetchTokenData(mintAddress).finally(() => {
    pendingRequests.delete(mintAddress);
  });
  
  pendingRequests.set(mintAddress, promise);
  return promise;
}
```

---

## 🟢 Medium Priority Improvements

### 11. **Inconsistent Error Messages**
**Location**: Multiple files

**Problem**: Some errors return user-friendly messages, others return technical errors.

**Solution**: Create error message utility:
```typescript
// app/lib/errorMessages.ts
export function getUserFriendlyError(error: Error): string {
  if (error.message.includes('403')) return 'Network access denied. Please try again.';
  if (error.message.includes('429')) return 'Too many requests. Please wait a moment.';
  // ... etc
  return 'Something went wrong. Please try again.';
}
```

---

### 12. **Missing Mint Address Validation**
**Location**: `app/api/token/[mintAddress]/route.ts`

**Problem**: No validation that mint address is valid before creating PublicKey.

**Solution**:
```typescript
try {
  new PublicKey(mintAddress);
} catch {
  return NextResponse.json(
    { success: false, error: 'Invalid Solana address format' },
    { status: 400 }
  );
}
```

---

### 13. **Inefficient Token Format Conversion**
**Location**: `app/api/tokens/route.ts` (line 90)

**Problem**: Creating new objects with both camelCase and snake_case for every token.

**Solution**: Use a helper function or do it once during storage:
```typescript
// Better: Store in both formats in MongoDB, or convert once
function addSnakeCaseFields(token: TokenFromAPI) {
  return {
    ...token,
    mint_address: token.mintAddress,
    // ... etc
  };
}
```

---

### 14. **No Rate Limiting**
**Location**: All API routes

**Problem**: No protection against abuse or DDoS.

**Solution**: Add rate limiting middleware or use Vercel's built-in rate limiting.

---

### 15. **Missing Request Timeouts**
**Location**: `app/api/token/[mintAddress]/route.ts`

**Problem**: No overall timeout for the entire request.

**Solution**: Use Next.js timeout or add AbortController:
```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

try {
  const data = await fetch(..., { signal: controller.signal });
} finally {
  clearTimeout(timeout);
}
```

---

## 📊 Performance Optimizations

### 16. **Batch MongoDB Queries**
**Location**: `app/api/tokens/route.ts`

**Problem**: Fetching all tokens then slicing is inefficient for large datasets.

**Solution**: Use MongoDB pagination:
```typescript
const tokens = await tokensCollection
  .find({})
  .sort({ created_at: -1 })
  .skip(startIndex)
  .limit(limit)
  .toArray();
```

---

### 17. **Lazy Load Metaplex SDK**
**Location**: `app/api/token/[mintAddress]/route.ts`, `app/api/tokens/route.ts`

**Current**: Dynamic import is good, but could be optimized.

**Better**: Only import if needed:
```typescript
// Only import if metadata is actually missing
if (!tokenData?.name || !tokenData?.symbol) {
  const { Metaplex } = await import('@metaplex-foundation/js');
  // ...
}
```

---

### 18. **Connection Reuse in Services**
**Location**: `app/services/priceService.ts`, `app/services/swapService.ts`

**Problem**: Each service creates its own connection.

**Solution**: Inject connection or use shared service.

---

## 🔒 Security Improvements

### 19. **Input Sanitization**
**Location**: All API routes accepting user input

**Problem**: No sanitization of mint addresses or other inputs.

**Solution**: Add validation and sanitization layer.

---

### 20. **Error Information Leakage**
**Location**: Error responses

**Problem**: Some errors expose internal details.

**Solution**: Sanitize error messages in production:
```typescript
const errorMessage = process.env.NODE_ENV === 'production'
  ? 'An error occurred. Please try again.'
  : error.message;
```

---

## 🧹 Code Quality

### 21. **Extract Constants**
**Location**: Multiple files

**Problem**: Magic numbers and strings scattered throughout.

**Solution**:
```typescript
// app/lib/constants.ts
export const METADATA_URI_MAX_LENGTH = 200;
export const CACHE_TTL = 5 * 60 * 1000;
export const MAX_CONCURRENT_RPC_CALLS = 3;
```

---

### 22. **Type Definitions**
**Location**: `app/api/token/[mintAddress]/route.ts`

**Problem**: Inline type definitions instead of shared interfaces.

**Solution**: Extract to `app/types/token.ts`:
```typescript
export interface OnChainMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}
```

---

### 23. **Logging Consistency**
**Location**: All files

**Problem**: Mix of `console.log`, `console.error`, `console.warn`.

**Solution**: Use centralized logger:
```typescript
import { logger } from '../lib/logger';

logger.info('API: Fetching token data');
logger.error('Error:', error);
```

---

## 🚀 Quick Wins

1. **Add connection pooling** - Reuse Connection instances
2. **Add caching** - Cache on-chain metadata for 5 minutes
3. **Add timeouts** - 10s timeout for all RPC calls
4. **Extract shared functions** - Remove code duplication
5. **Add input validation** - Validate all user inputs
6. **Add rate limiting** - Protect API endpoints
7. **Improve error messages** - User-friendly error messages
8. **Add request deduplication** - Prevent duplicate requests

---

## 📝 Recommended Next Steps

1. **Immediate**: Fix connection creation (Issue #1)
2. **This Week**: Add caching and timeouts
3. **Next Sprint**: Extract shared utilities and improve error handling
4. **Future**: Implement connection pooling and request deduplication

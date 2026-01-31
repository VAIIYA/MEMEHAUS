# 🔧 RPC Setup Guide for Token Creation

## 🚨 **Current Issue: 403 Access Forbidden**

The error you're seeing indicates that the RPC endpoint is rejecting requests. This can happen due to:
- **Rate limiting** on public RPC endpoints
- **High network traffic** on Solana mainnet
- **Endpoint restrictions** or maintenance

## 🛠️ **Solutions**

### **1. Environment Variable Setup**

Create a `.env.local` file in your project root:

```bash
# Solana RPC Configuration (Recommended - Alchemy Premium)
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/Qc7vcbufkAgT7TuKvVrZ6

# Alternative RPC endpoints (if needed)
# NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.rpc.extrnode.com
# NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.ankr.com/solana
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### **2. Recommended RPC Endpoints**

#### **Free Public Endpoints:**
- ✅ `https://api.mainnet-beta.solana.com` (Official Solana)
- ✅ `https://solana-mainnet.rpc.extrnode.com` (Extrnode)
- ✅ `https://rpc.ankr.com/solana` (Ankr)

#### **Paid/Private Endpoints (Better Reliability):**
- 🔥 `https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY` (Alchemy)
- 🔥 `https://solana-mainnet.infura.io/v3/YOUR_PROJECT_ID` (Infura)
- 🔥 `https://api.quicknode.com/YOUR_ENDPOINT` (QuickNode)

### **3. Automatic Fallback System**

The updated code now includes:
- ✅ **RPC Connection Testing**: Tests connection before token creation
- ✅ **Automatic Fallback**: Switches to best available endpoint
- ✅ **Better Error Messages**: Specific error handling for different issues
- ✅ **Retry Logic**: Multiple endpoint attempts

## 🔍 **Testing RPC Connection**

### **Manual Test:**
```bash
# Test current RPC endpoint
curl -X POST https://api.mainnet-beta.solana.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getLatestBlockhash"}'
```

### **Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "context": {
      "slot": 123456789
    },
    "value": {
      "blockhash": "...",
      "lastValidBlockHeight": 123456789
    }
  },
  "id": 1
}
```

## 🚀 **Quick Fix Steps**

### **Step 1: Update Environment**
```bash
# Add to .env.local
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### **Step 2: Restart Development Server**
```bash
npm run dev
```

### **Step 3: Test Token Creation**
- Try creating a token again
- Check browser console for RPC connection logs
- The system will automatically find the best endpoint

## 📊 **RPC Performance Monitoring**

The system now logs RPC performance:
```
✅ https://api.mainnet-beta.solana.com - 150ms
❌ https://solana-api.projectserum.com - Failed after 5000ms
✅ https://rpc.ankr.com/solana - 200ms
```

## 🛡️ **Error Handling Improvements**

### **Specific Error Messages:**
- **403 Error**: "RPC endpoint access denied. The Solana network may be experiencing high traffic."
- **429 Error**: "Rate limit exceeded. Please wait a moment and try again."
- **Timeout**: "Transaction timeout. The network may be congested."
- **Insufficient Funds**: "Insufficient SOL balance. Please ensure you have enough SOL."

### **Automatic Recovery:**
- ✅ Tests current connection before token creation
- ✅ Falls back to best available endpoint
- ✅ Provides clear error messages
- ✅ Suggests retry actions

## 🔧 **Advanced Configuration**

### **For Production:**
```bash
# Use a paid RPC service for better reliability
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

### **For Development:**
```bash
# Use public endpoints with fallback
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## 📈 **Performance Tips**

### **Best Practices:**
1. **Use Environment Variables**: Don't hardcode RPC URLs
2. **Monitor Performance**: Check console logs for endpoint performance
3. **Have Fallbacks**: Multiple endpoints for reliability
4. **Consider Paid Services**: For production applications

### **When to Use Paid RPC:**
- 🔥 **High Volume**: Creating many tokens
- 🔥 **Production Apps**: Need guaranteed uptime
- 🔥 **Real-time Trading**: Low latency requirements
- 🔥 **Enterprise Use**: SLA requirements

## 🎯 **Next Steps**

1. **Add the environment variable** to your `.env.local`
2. **Restart your development server**
3. **Try token creation again**
4. **Monitor the console logs** for RPC performance
5. **Consider a paid RPC service** if issues persist

The updated system should now handle RPC issues gracefully and provide much better error messages! 🚀

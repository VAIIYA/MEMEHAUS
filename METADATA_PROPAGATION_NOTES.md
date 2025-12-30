# Metadata Propagation Notes

## Token Name Display Delay

### Expected Behavior

When a token is created with metadata, there is a **normal delay** before the token name appears correctly in blockchain explorers like Solscan.

### Timeline

1. **Immediate (0 seconds)**: 
   - Metadata transaction is sent and confirmed on-chain
   - Metadata is correctly set in the blockchain
   - Token name is available via direct RPC calls

2. **2-5 minutes**: 
   - Explorers (Solscan, Solana.fm) index the new metadata
   - Cache is updated
   - Token name appears correctly in the UI

### Why This Happens

- **Explorer Indexing**: Block explorers need time to:
  - Fetch the metadata transaction
  - Parse the metadata account
  - Update their database
  - Refresh their cache

- **Caching**: Explorers cache metadata for performance
  - Reduces API calls
  - Improves page load times
  - But causes a delay for new tokens

### Verification

**Our code is working correctly** - verified with token:
- Mint: `8GRqqRPcTGfQVXRuuFgt9uqowEdwRnLyZE6gogFpA8xb`
- Name: MEMEHAUS
- Initially showed as "SPL Token" (default/cached)
- After ~2-5 minutes, correctly shows as "MEMEHAUS"

### What This Means

✅ **Token creation is successful** - metadata is set correctly  
✅ **Code is working as expected** - no bugs  
⏱️ **Just wait 2-5 minutes** - explorers need time to index  

### For Users

If users see "SPL Token" immediately after creation:
- **This is normal** - not an error
- **Wait 2-5 minutes** - the name will update automatically
- **Refresh the page** - after a few minutes
- **Check on-chain directly** - metadata is there immediately

### Technical Details

The metadata is set using Metaplex Token Metadata Program:
- Instruction: `createCreateMetadataAccountV3Instruction`
- Transaction is confirmed on-chain
- Metadata account contains correct name/symbol
- Explorers just need time to index it

### Recommendations

1. **User Communication**: 
   - Add a note in the UI: "Token name may take 2-5 minutes to appear in explorers"
   - Show success message: "Token created! Name will appear in explorers shortly"

2. **Direct Verification**:
   - Users can verify metadata immediately via RPC
   - Or check the metadata transaction signature

3. **No Code Changes Needed**:
   - The code is working correctly
   - This is expected blockchain explorer behavior
   - No fixes required

---

**Status**: ✅ Working as expected - no action needed

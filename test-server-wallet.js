import { testServerWallet } from './app/lib/testServerWallet.js';

console.log('🧪 Testing Server Wallet Setup...');
console.log('=====================================');

testServerWallet()
  .then(() => {
    console.log('✅ Server wallet test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Server wallet test failed:', error);
    process.exit(1);
  });

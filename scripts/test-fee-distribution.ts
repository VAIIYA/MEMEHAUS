/**
 * Test script for fee distribution system
 */
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { getAllCreatorsFromMongoDB } from '../app/lib/mongodbStorage';

// Test configuration
const SERVER_WALLET_PRIVATE_KEY = process.env.SERVER_WALLET_PRIVATE_KEY;
const SERVER_WALLET_ADDRESS = '7UhwWmw1r15fqLKcbYEDVFjqiz2G753MsyDksFAjfT3e';
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

async function testServerWalletKey() {
  console.log('🧪 Testing Server Wallet Private Key...\n');

  if (!SERVER_WALLET_PRIVATE_KEY) {
    console.error('❌ SERVER_WALLET_PRIVATE_KEY is not set in environment variables');
    return false;
  }

  try {
    let keypair: Keypair;
    try {
      const privateKeyBytes = bs58.decode(SERVER_WALLET_PRIVATE_KEY);
      keypair = Keypair.fromSecretKey(privateKeyBytes);
      console.log('✅ Private key loaded (base58 format)');
    } catch (base58Error) {
      const privateKeyBytes = Buffer.from(SERVER_WALLET_PRIVATE_KEY, 'base64');
      keypair = Keypair.fromSecretKey(privateKeyBytes);
      console.log('✅ Private key loaded (base64 format)');
    }

    const expectedPublicKey = new PublicKey(SERVER_WALLET_ADDRESS);
    if (!keypair.publicKey.equals(expectedPublicKey)) {
      console.error('❌ Private key does not match expected server wallet address');
      return false;
    }

    const connection = new Connection(RPC_URL, 'confirmed');
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`✅ Server wallet balance: ${balance / 1e9} SOL`);

    return true;
  } catch (error) {
    console.error('❌ Error testing server wallet:', error);
    return false;
  }
}

async function testCreatorList() {
  console.log('\n🧪 Testing Creator List System...\n');

  try {
    const creators = await getAllCreatorsFromMongoDB();
    console.log('✅ Creator list retrieved from MongoDB');
    console.log(`   Total creators: ${creators.length}`);

    if (creators.length > 0) {
      console.log('   Creators:');
      creators.slice(0, 5).forEach((addr, idx) => {
        console.log(`     ${idx + 1}. ${addr}`);
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Error testing creator list:', error);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Fee Distribution System Test\n');
  await testServerWalletKey();
  await testCreatorList();
}

runTests().catch(console.error);

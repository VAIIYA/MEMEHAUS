/**
 * Test script for storage provider connections
 */
import { testMongoDBConnection } from '../app/lib/mongodbStorage';
import { lighthouseProvider } from '../app/lib/storageService';

async function testMongo() {
  console.log('\n📊 Testing MongoDB Connection...');
  try {
    const isConnected = await testMongoDBConnection();
    if (isConnected) {
      console.log('✅ MongoDB connection successful');
      return true;
    } else {
      console.error('❌ MongoDB connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing MongoDB:', error);
    return false;
  }
}

async function testLighthouse() {
  console.log('\n📊 Testing Lighthouse Connection...');
  try {
    const isConnected = await lighthouseProvider.testConnection();
    if (isConnected) {
      console.log('✅ Lighthouse connection successful');
      return true;
    } else {
      console.error('❌ Lighthouse connection failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing Lighthouse:', error);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Storage Provider Connection Test\n');

  await testMongo();
  await testLighthouse();

  console.log('\n✅ All connection tests completed');
}

runTests().catch(console.error);

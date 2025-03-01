/**
 * Test script for the external-data API endpoint
 * 
 * Before running, install required packages:
 * npm install --save-dev node-fetch@2 dotenv @types/node-fetch
 * 
 * Run this script with:
 * ts-node src/utils/test-external-api.ts
 * 
 * Make sure to set the EXTERNAL_SERVICE_API_KEY environment variable first.
 */
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Configuration
const API_URL = 'http://localhost:3000/api/external-data';
const API_KEY = process.env.EXTERNAL_SERVICE_API_KEY || '';

if (!API_KEY) {
  console.error('ERROR: EXTERNAL_SERVICE_API_KEY not set in environment variables');
  process.exit(1);
}

// Sample data to send
const testData = {
  source: 'test_script',
  timestamp: new Date().toISOString(),
  test_value: 'This is a test message',
  nested: {
    field1: 'value1',
    field2: 42,
    field3: true
  },
  array_data: [1, 2, 3, 4, 5]
};

// Function to test the API
async function testExternalDataAPI() {
  try {
    console.log('Sending test data to external-data API endpoint...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(testData)
    });
    
    const responseData = await response.json();
    
    console.log(`HTTP Status: ${response.status}`);
    console.log('Response:', JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Test successful! The API endpoint is working correctly.');
    } else {
      console.log('\n❌ Test failed. The API endpoint returned an error.');
    }
  } catch (error) {
    console.error('Error testing API:', error);
    console.log('\n❌ Test failed. Could not connect to the API endpoint.');
  }
}

// Run the test
testExternalDataAPI(); 
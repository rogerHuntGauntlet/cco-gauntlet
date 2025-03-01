// A simple script to test Supabase Auth
const fetch = require('node-fetch');

async function testSupabaseAuth() {
  const SUPABASE_URL = 'https://rlaxacnkrfohotpyvnam.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsYXhhY25rcmZvaG90cHl2bmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxOTk3NjcsImV4cCI6MjA1MTc3NTc2N30.djQ3ExBd5Y2wb2sUOZCs5g72U2EgdYte7NqFiLesE9Y';

  console.log('Testing Supabase API access...');
  
  // First test: general API access
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Access Status:', response.status);
    console.log('API Access Headers:', response.headers.get('server'));
    
    if (response.ok) {
      console.log('✅ API access successful');
    } else {
      console.log('❌ API access failed');
    }
  } catch (error) {
    console.error('API access error:', error);
  }
  
  console.log('\nTesting Auth Service...');
  
  // Second test: auth service with dummy credentials
  try {
    const authResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    console.log('Auth Status:', authResponse.status);
    
    const authData = await authResponse.text();
    console.log('Auth Response:', authData);
    
    if (authResponse.status === 500) {
      console.log('❌ Auth service is down (500 status) - This matches your error');
    } else if (authResponse.status === 400) {
      console.log('✅ Auth service is up (400 status for wrong credentials is expected)');
    } else {
      console.log('⚠️ Auth service returned unexpected status');
    }
  } catch (error) {
    console.error('Auth error:', error);
  }
}

testSupabaseAuth(); 
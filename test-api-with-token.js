// Test the API with your access token
const API_BASE = 'http://localhost:3001/api';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6ImYwRTh6Ukp0OG5tb0xOMUciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL25obnR2ZnZpd3Vsd2h4Y3d5dWRkLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJlMGVmMjc4Zi1kM2YzLTQzYzUtOTNhNi01OGM3ODUyMzIwMjYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU5NjgxNDQwLCJpYXQiOjE3NTk2Nzc4NDAsImVtYWlsIjoibW9zY293bnB1ckBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoibW9zY293bnB1ckBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiVGVzdCBVc2VyIEFkbWluIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJlMGVmMjc4Zi1kM2YzLTQzYzUtOTNhNi01OGM3ODUyMzIwMjYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1OTY3Nzg0MH1dLCJzZXNzaW9uX2lkIjoiZmNhZTE2Y2YtNTMxOS00NDQ4LTg5ZGQtMGUwM2JiZWJiNzhjIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.PDJnAr2SFok_3yOdb9wH2QcK0HSjYj6gLGGcyVEzB6k';

async function testAPI() {
  console.log('🧪 Testing BFF API with your access token...\n');

  try {
    // Test health endpoint first
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Test authenticated endpoint
    console.log('\n2. Testing authenticated dashboard endpoint...');
    const dashboardResponse = await fetch(`${API_BASE}/user/dashboard-data`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });

    const dashboardData = await dashboardResponse.json();
    
    if (dashboardResponse.ok) {
      console.log('✅ Dashboard API Success!');
      console.log('📊 Data:', JSON.stringify(dashboardData, null, 2));
    } else {
      console.log('❌ Dashboard API Error:', dashboardData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the Vercel dev server is running:');
    console.log('   npx vercel dev --listen 3001');
  }
}

testAPI();

// Test script for authenticated API routes
const API_BASE = 'http://localhost:3001/api';

async function testAuthenticatedAPI() {
  console.log('🔐 Testing Authenticated API Routes...\n');

  try {
    // First, test public endpoints
    console.log('1. Testing public endpoints...');
    
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    const indexResponse = await fetch(`${API_BASE}/`);
    const indexData = await indexResponse.json();
    console.log('✅ API index:', indexData.message);

    // Test authenticated endpoints without token (should fail)
    console.log('\n2. Testing authenticated endpoints without token...');
    
    const dashboardResponse = await fetch(`${API_BASE}/user/dashboard-data`);
    const dashboardData = await dashboardResponse.json();
    console.log('❌ Dashboard (no auth):', dashboardData.error);

    const worldsResponse = await fetch(`${API_BASE}/user/worlds`);
    const worldsData = await worldsResponse.json();
    console.log('❌ Worlds (no auth):', worldsData.error);

    // Test with invalid token (should fail)
    console.log('\n3. Testing with invalid token...');
    
    const invalidTokenResponse = await fetch(`${API_BASE}/user/dashboard-data`, {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    const invalidTokenData = await invalidTokenResponse.json();
    console.log('❌ Dashboard (invalid token):', invalidTokenData.error);

    console.log('\n📝 To test with valid tokens:');
    console.log('1. Login to your app and get the JWT token from localStorage');
    console.log('2. Use: curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/user/dashboard-data');
    console.log('3. Or use browser dev tools to copy the token from your app');

    console.log('\n🎯 Expected behavior:');
    console.log('✅ Public routes work without auth');
    console.log('❌ Authenticated routes return 401 without valid token');
    console.log('✅ Authenticated routes work with valid JWT token');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthenticatedAPI();

// Script to get Supabase access token from your app
console.log('🔐 Getting Supabase Access Token\n');

console.log('Method 1: Using Browser Console (Recommended)');
console.log(`
1. Open your app in browser: http://localhost:5173
2. Login to your app
3. Open Dev Tools (F12) → Console
4. Run this code:

// Get the Supabase client
const { createClient } = await import('@supabase/supabase-js');
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Get the session and access token
const { data: { session } } = await supabase.auth.getSession();
if (session) {
  console.log('Access Token:', session.access_token);
  console.log('User ID:', session.user.id);
  console.log('Email:', session.user.email);
} else {
  console.log('No active session - please login first');
}
`);

console.log('\nMethod 2: Using localStorage (Alternative)');
console.log(`
1. Open your app in browser
2. Login to your app  
3. Open Dev Tools (F12) → Application → Local Storage
4. Look for keys like:
   - supabase.auth.token
   - sb-<project-id>-auth-token
5. Copy the access_token value from the JSON
`);

console.log('\nMethod 3: Add to your React app temporarily');
console.log(`
// Add this to any component to get the token:
import { supabase } from './lib/supabase';

const getToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    console.log('Access Token:', session.access_token);
    return session.access_token;
  }
  return null;
};

// Call getToken() in your component
`);

console.log('\n🧪 Test the API with the token:');
console.log(`
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
     http://localhost:3001/api/user/dashboard-data
`);

console.log('\n📝 Expected Response:');
console.log(`
✅ With valid token:
{
  "success": true,
  "data": {
    "worlds": [...],
    "totalWorlds": 5,
    "totalChapters": 12,
    "totalCharacters": 8
  }
}

❌ Without token:
{
  "error": "Unauthorized", 
  "message": "No valid authorization header or session"
}
`);

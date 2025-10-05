// Test script to show how to get Supabase access token
console.log('🔐 Supabase Authentication Test\n');

console.log('To test authenticated API routes with Supabase:');
console.log('\n1. 📱 In your React app, get the access token:');
console.log(`
   // In your React component or browser console:
   const { data: { session } } = await supabase.auth.getSession();
   const accessToken = session?.access_token;
   console.log('Access Token:', accessToken);
`);

console.log('\n2. 🧪 Test the API with the token:');
console.log(`
   // Replace YOUR_ACCESS_TOKEN with the actual token
   curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
        http://localhost:3001/api/user/dashboard-data
`);

console.log('\n3. 🌐 Or use browser dev tools:');
console.log(`
   // Open your app in browser
   // Open Dev Tools (F12) → Console
   // Run this code:
   
   supabase.auth.getSession().then(({ data: { session } }) => {
     if (session) {
       console.log('Access Token:', session.access_token);
       console.log('User ID:', session.user.id);
     } else {
       console.log('No active session');
     }
   });
`);

console.log('\n4. 📋 Expected API Response:');
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

console.log('\n🎯 Next Steps:');
console.log('1. Start your React app: npm run dev');
console.log('2. Login to your app');
console.log('3. Get the access token using method above');
console.log('4. Test the API with the token');

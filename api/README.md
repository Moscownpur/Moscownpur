# Moscowvitz BFF API

A **Backend for Frontend (BFF)** API built with Vercel Serverless Functions and Supabase authentication. This API provides optimized data access for the Moscowvitz application.

## 🏗️ Architecture

```
Frontend (React) → BFF API (Vercel Functions) → Supabase Database
```

### Benefits
- **Single optimized queries** instead of multiple database calls
- **Centralized authentication** and authorization
- **Better performance** with serverless functions
- **Auto-scaling** based on demand
- **Global CDN** for fast responses worldwide

## 🚀 Deployment

This API automatically deploys with your frontend when you run:
```bash
vercel --prod
```

**Live URLs:**
- **Frontend + API:** https://www.moscownpur.in
- **API Health:** https://www.moscownpur.in/api/health
- **API Docs:** https://www.moscownpur.in/api/

## 📋 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/` | API documentation |

### Authenticated Endpoints (Require Bearer Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user/dashboard-data` | Optimized dashboard data with worlds, chapters, characters |

### Test Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/test` | Basic test endpoint for API functionality |

## 🔐 Authentication

All authenticated endpoints require a **Bearer token** in the Authorization header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

### Getting Your Token

**Method 1: Browser Console**
```javascript
// In your React app's browser console:
const { createClient } = await import('@supabase/supabase-js');
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const { data: { session } } = await supabase.auth.getSession();
console.log('Access Token:', session.access_token);
```

**Method 2: Using TokenHelper Component**
```typescript
// Add to any React component temporarily:
import { supabase } from './lib/supabase';

const getToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};
```

## 🧪 Testing

### Local Development
```bash
# Start development server
npx vercel dev --listen 3001

# Test health endpoint
curl http://localhost:3001/api/health

# Test authenticated endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/user/dashboard-data
```

### Production Testing
```bash
# Test live API
curl https://www.moscownpur.in/api/health

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://www.moscownpur.in/api/user/dashboard-data
```

## 📊 Example Responses

### Dashboard Data Response
```json
{
  "success": true,
  "data": {
    "worlds": [
      {
        "world_id": "uuid",
        "name": "My Fantasy World",
        "description": "A magical realm...",
        "chapters": [...],
        "characters": [...]
      }
    ],
    "totalWorlds": 5,
    "totalChapters": 12,
    "totalCharacters": 8
  }
}
```

### Error Response
```json
{
  "error": "Unauthorized",
  "message": "No valid authorization header"
}
```

## 🔧 Environment Variables

The API uses these environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are automatically configured in Vercel when you deploy.

## 📁 File Structure

```
api/
├── _utils/
│   └── supabase.ts          # Shared Supabase client & auth utilities
├── user/
│   └── dashboard-data.ts    # GET /api/user/dashboard-data
├── health.ts               # GET /api/health
├── test.ts                 # GET /api/test (for testing)
├── index.ts                # GET /api/ (API documentation)
└── README.md               # This documentation
```

## 🚀 Performance Benefits

### Before (Direct Supabase Calls)
```typescript
// Multiple separate queries
const worlds = await supabase.from('worlds').select('*');
const chapters = await supabase.from('chapters').select('*');
const events = await supabase.from('events').select('*');
const scenes = await supabase.from('scenes').select('*');
const dialogues = await supabase.from('dialogues').select('*');
```

### After (BFF API)
```typescript
// Single optimized query
const { data } = await fetch('/api/user/dashboard-data', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

**Benefits:**
- **5x fewer network requests**
- **Better caching** with serverless functions
- **Optimized database queries** with joins
- **Centralized error handling**
- **Better security** with token validation

## 🔒 Security Features

- **JWT Token Validation** - All requests validated with Supabase
- **User Isolation** - Users can only access their own data
- **Admin Role Checking** - Admin endpoints require elevated permissions
- **Error Handling** - Proper error responses without data leakage
- **Rate Limiting** - Built-in Vercel rate limiting

## 📈 Monitoring

- **Vercel Analytics** - Built-in performance monitoring
- **Error Logging** - Automatic error tracking
- **Health Checks** - `/api/health` endpoint for monitoring
- **Real-time Metrics** - Available in Vercel dashboard

## 🛠️ Development

### Adding New Endpoints

1. Create a new `.ts` file in the appropriate folder
2. Export a default function that handles the request
3. Use the authentication pattern from existing endpoints
4. Test locally with `npx vercel dev`

### Example New Endpoint
```typescript
// api/user/characters.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Your endpoint logic here
  res.json({ success: true, data: [] });
}
```

## 📞 Support

For issues or questions:
- Check the Vercel logs: `vercel logs`
- Test locally: `npx vercel dev`
- Review the health endpoint: `/api/health`

---

**Built with ❤️ for Moscowvitz**


# Supabase OAuth Redirect URL Configuration

## Important: Add these URLs to your Supabase Dashboard

Go to: **Supabase Dashboard** → **Authentication** → **URL Configuration**

### Add these Redirect URLs:

**For Development:**
- `http://localhost:5173/login`
- `http://localhost:5173/dashboard`

**For Production:**
- `https://www.moscownpur.in/login`
- `https://www.moscownpur.in/dashboard`
- `https://moscownpur.in/login`
- `https://moscownpur.in/dashboard`

### Site URL:
Set your **Site URL** to:
- Development: `http://localhost:5173`
- Production: `https://www.moscownpur.in`

### Additional Redirect URLs (Optional):
If you want to support the MaitriLok platform as well:
- `http://localhost:5173/feed` (for MaitriLok development)
- Add your MaitriLok production URLs when deployed

---

## Testing Locally

1. Make sure you're running the dev server: `npm run dev`
2. Navigate to `http://localhost:5173/login`
3. Click "Continue with Google"
4. After Google auth, you should be redirected back to `http://localhost:5173/dashboard`

## Troubleshooting

If you're still seeing the old login page on production:
1. The production site needs to be rebuilt and deployed with the new code
2. Clear your browser cache
3. Verify the redirect URLs are correctly configured in Supabase

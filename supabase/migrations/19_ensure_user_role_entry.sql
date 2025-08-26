-- Migration: Ensure user role entry exists for the specific user
-- This ensures the user has a role entry before testing admin functionality

-- First, ensure the user exists in user_roles table
INSERT INTO public.user_roles (user_id, is_admin)
SELECT 'e28a6d70-b0f0-4ba0-912c-1372cba182f6', false
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = 'e28a6d70-b0f0-4ba0-912c-1372cba182f6'
);

-- Now set this user as admin
UPDATE public.user_roles 
SET is_admin = true 
WHERE user_id = 'e28a6d70-b0f0-4ba0-912c-1372cba182f6';

-- Verify the entry exists
SELECT 
    user_id, 
    is_admin, 
    created_at, 
    updated_at 
FROM public.user_roles 
WHERE user_id = 'e28a6d70-b0f0-4ba0-912c-1372cba182f6';

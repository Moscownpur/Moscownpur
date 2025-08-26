-- Migration: Setup initial admin user
-- This migration sets up an initial admin user for the system

-- First, ensure all existing users have user_roles entries
INSERT INTO public.user_roles (user_id, is_admin)
SELECT id, false
FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.users.id
);

-- Set the first user (or a specific user by email) as admin
-- You can modify the email below to match your admin user's email
UPDATE public.user_roles 
SET is_admin = true 
WHERE user_id = (
    SELECT id FROM auth.users 
    WHERE email = 'moscownpur@gmail.com'  -- Change this to your admin email
    LIMIT 1
);

-- If no specific email is found, set the first user as admin
-- (Uncomment the lines below if you want to use the first user as admin)
-- UPDATE public.user_roles 
-- SET is_admin = true 
-- WHERE user_id = (
--     SELECT id FROM auth.users 
--     ORDER BY created_at ASC 
--     LIMIT 1
-- );

-- Add a comment to document the admin setup
COMMENT ON TABLE public.user_roles IS 'Stores user roles. Users can view their own role, admins can manage all roles. Initial admin setup complete.';

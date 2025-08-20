-- is_admin
-- First ensure all users exist in user_roles
INSERT INTO public.user_roles (user_id, is_admin)
SELECT id, false
FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.users.id
);

-- Then set ALL users to is_admin = false
UPDATE public.user_roles 
SET is_admin = false;
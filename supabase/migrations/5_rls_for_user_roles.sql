-- Migration: Enable RLS on user_roles table with admin-only access
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS user_roles_select_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_insert_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_update_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_delete_policy ON public.user_roles;

-- Policy: Only admins can view ALL user roles
CREATE POLICY user_roles_select_policy ON public.user_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.is_admin = true
        )
    );

-- Policy: Only admins can insert user roles
CREATE POLICY user_roles_insert_policy ON public.user_roles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.is_admin = true
        )
    );

-- Policy: Only admins can update user roles
CREATE POLICY user_roles_update_policy ON public.user_roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.is_admin = true
        )
    );

-- Policy: Only admins can delete user roles
CREATE POLICY user_roles_delete_policy ON public.user_roles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.is_admin = true
        )
    );

-- Add comment to document the strict security
COMMENT ON TABLE public.user_roles IS 'Stores user roles with strict admin-only access. Users cannot view their own roles.';
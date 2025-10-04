-- Fix infinite recursion in user_roles RLS policies
-- The issue is that policies are trying to query user_roles to check admin status,
-- which creates infinite recursion

-- Drop all existing policies
DROP POLICY IF EXISTS user_roles_select_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_insert_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_update_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_delete_policy ON public.user_roles;

-- Create a function to check if current user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- Use security definer to bypass RLS and check admin status
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy: Users can view their own role, admins can view all roles
CREATE POLICY user_roles_select_policy ON public.user_roles
    FOR SELECT USING (
        -- Allow users to view their own role
        user_id = auth.uid()
        OR
        -- Allow admins to view all roles (using function to avoid recursion)
        public.is_admin()
    );

-- Policy: Allow system/trigger to insert user roles (bypass RLS for triggers)
CREATE POLICY user_roles_insert_policy ON public.user_roles
    FOR INSERT WITH CHECK (true);

-- Policy: Only admins can update user roles
CREATE POLICY user_roles_update_policy ON public.user_roles
    FOR UPDATE USING (public.is_admin());

-- Policy: Only admins can delete user roles
CREATE POLICY user_roles_delete_policy ON public.user_roles
    FOR DELETE USING (public.is_admin());

-- Update table comment
COMMENT ON TABLE public.user_roles IS 'Stores user roles. Users can view their own role. Only admins can modify roles. System can insert roles via triggers.';

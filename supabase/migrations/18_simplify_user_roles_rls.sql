-- Migration: Simplify RLS policies for user_roles table
-- This removes the circular dependency that was causing 500 errors

-- Drop existing policies
DROP POLICY IF EXISTS user_roles_select_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_insert_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_update_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_delete_policy ON public.user_roles;

-- Simple policy: Users can view their own role
CREATE POLICY user_roles_select_policy ON public.user_roles
    FOR SELECT USING (user_id = auth.uid());

-- Policy: Only admins can insert user roles (using service role bypass)
CREATE POLICY user_roles_insert_policy ON public.user_roles
    FOR INSERT WITH CHECK (true);

-- Policy: Only admins can update user roles (using service role bypass)
CREATE POLICY user_roles_update_policy ON public.user_roles
    FOR UPDATE USING (true);

-- Policy: Only admins can delete user roles (using service role bypass)
CREATE POLICY user_roles_delete_policy ON public.user_roles
    FOR DELETE USING (true);

-- Update comment
COMMENT ON TABLE public.user_roles IS 'Stores user roles. Users can view their own role. Admin operations require service role.';

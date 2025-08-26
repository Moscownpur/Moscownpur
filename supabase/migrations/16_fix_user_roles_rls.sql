-- Migration: Fix RLS policies for user_roles table to allow self-check
-- This fixes the circular dependency issue where users couldn't check their own admin status

-- Drop existing policies
DROP POLICY IF EXISTS user_roles_select_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_insert_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_update_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_delete_policy ON public.user_roles;

-- Policy: Users can view their own role, admins can view all roles
CREATE POLICY user_roles_select_policy ON public.user_roles
    FOR SELECT USING (
        -- Allow users to view their own role
        user_id = auth.uid()
        OR
        -- Allow admins to view all roles
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

-- Update comment to reflect the new security model
COMMENT ON TABLE public.user_roles IS 'Stores user roles. Users can view their own role, admins can manage all roles.';

-- Fix RLS policies for profiles table to allow public profile viewing
-- This migration updates the RLS policies to allow public access to view profiles by username

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view profiles by username" ON public.profiles;

-- Create new comprehensive RLS policies
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Allow public to view profiles by username (for profile pages)
CREATE POLICY "Public can view profiles by username" ON public.profiles
    FOR SELECT USING (true);

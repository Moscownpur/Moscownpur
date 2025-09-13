-- Migration to populate profiles table with existing users and set up triggers

-- First, let's populate the profiles table with existing users from auth.users
-- This requires a function that can access auth.users (only works with service role)

-- Create a function to populate profiles for existing users
CREATE OR REPLACE FUNCTION public.populate_existing_profiles()
RETURNS void AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Insert profiles for all existing users who don't already have profiles
    FOR user_record IN 
        SELECT 
            au.id,
            au.email,
            COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name') as full_name,
            au.created_at
        FROM auth.users au
        LEFT JOIN public.profiles p ON au.id = p.id
        WHERE p.id IS NULL
    LOOP
        INSERT INTO public.profiles (id, email, full_name, created_at)
        VALUES (
            user_record.id,
            user_record.email,
            user_record.full_name,
            user_record.created_at
        )
        ON CONFLICT (id) DO NOTHING;
    END LOOP;
    
    -- Also ensure all users have entries in user_roles table
    INSERT INTO public.user_roles (user_id, is_admin)
    SELECT 
        au.id,
        false
    FROM auth.users au
    LEFT JOIN public.user_roles ur ON au.id = ur.user_id
    WHERE ur.user_id IS NULL
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to populate existing data
SELECT public.populate_existing_profiles();

-- Drop the temporary function since we don't need it anymore
DROP FUNCTION public.populate_existing_profiles();

-- Update the existing trigger function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.created_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = now();
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, is_admin)
  VALUES (NEW.id, false)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists (it should already exist from the previous migration)
-- But let's recreate it to be sure
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

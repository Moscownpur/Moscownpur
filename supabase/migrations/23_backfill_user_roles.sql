-- Migration to backfill user_roles table for users who don't have entries
-- This ensures all users have a role entry, defaulting to regular user

-- Create a function to backfill user_roles
CREATE OR REPLACE FUNCTION public.backfill_user_roles()
RETURNS void AS $$
BEGIN
    -- Insert user_roles entries for all users who don't have them
    -- Default to is_admin = false (regular user)
    INSERT INTO public.user_roles (user_id, is_admin)
    SELECT 
        p.id,
        false  -- Default to regular user
    FROM public.profiles p
    LEFT JOIN public.user_roles ur ON p.id = ur.user_id
    WHERE ur.user_id IS NULL
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Log how many entries were created
    RAISE NOTICE 'Backfilled user_roles for users without entries';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the backfill function
SELECT public.backfill_user_roles();

-- Drop the temporary function
DROP FUNCTION public.backfill_user_roles();

-- Update the trigger function to ensure user_roles are always created
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
  
  -- Insert into user_roles table (ensure this always happens)
  INSERT INTO public.user_roles (user_id, is_admin)
  VALUES (NEW.id, false)  -- Default to regular user
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

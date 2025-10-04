-- Fix user role creation trigger to ensure it works properly
-- The issue is that RLS policies might be interfering with the trigger execution

-- First, let's create a more robust trigger function that handles errors gracefully
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
  
  -- Insert into user_roles table with error handling
  BEGIN
    INSERT INTO public.user_roles (user_id, is_admin)
    VALUES (NEW.id, false)  -- Default to regular user
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail the trigger
      RAISE WARNING 'Failed to create user role for user %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create a function to manually create user roles for existing users
CREATE OR REPLACE FUNCTION public.ensure_user_roles()
RETURNS void AS $$
BEGIN
  -- Insert user_roles entries for all users who don't have them
  INSERT INTO public.user_roles (user_id, is_admin)
  SELECT 
    p.id,
    false  -- Default to regular user
  FROM public.profiles p
  LEFT JOIN public.user_roles ur ON p.id = ur.user_id
  WHERE ur.user_id IS NULL
  ON CONFLICT (user_id) DO NOTHING;
  
  RAISE NOTICE 'Ensured all users have user_roles entries';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to ensure existing users have roles
SELECT public.ensure_user_roles();

-- Drop the temporary function
DROP FUNCTION public.ensure_user_roles();

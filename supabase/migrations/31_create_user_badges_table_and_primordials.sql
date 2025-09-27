-- Create user_badges table and award Primordials badge to first 10 users
-- This migration creates a junction table for user badges and awards special badges

-- Create user_badges table to track which users have which badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badge_catalog(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS user_badges_user_id_idx 
ON public.user_badges(user_id);

CREATE INDEX IF NOT EXISTS user_badges_badge_id_idx 
ON public.user_badges(badge_id);

CREATE INDEX IF NOT EXISTS user_badges_earned_at_idx 
ON public.user_badges(earned_at DESC);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_badges
-- Users can view their own badges
CREATE POLICY "Users can view own badges" ON public.user_badges
    FOR SELECT USING (auth.uid() = user_id);

-- Users can view other users' badges (for public profile display)
CREATE POLICY "Public can view user badges" ON public.user_badges
    FOR SELECT USING (true);

-- Admins can view all user badges
CREATE POLICY "Admins can view all user badges" ON public.user_badges
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Admins can insert user badges
CREATE POLICY "Admins can insert user badges" ON public.user_badges
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Admins can delete user badges
CREATE POLICY "Admins can delete user badges" ON public.user_badges
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Create trigger for updated_at (if needed in future)
CREATE TRIGGER update_user_badges_updated_at 
    BEFORE UPDATE ON public.user_badges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert the special "Primordials" badge into badge_catalog
INSERT INTO public.badge_catalog (category, rarity, name, description, points, xp_reward) 
VALUES (
  'special_event', 
  'legendary', 
  'Primordials', 
  'One of the first 10 users to join the platform - a true pioneer of the community', 
  1000, 
  5000
);

-- Get the badge ID for the Primordials badge
DO $$
DECLARE
  primordials_badge_id uuid;
  user_record RECORD;
  user_count integer := 0;
BEGIN
  -- Get the Primordials badge ID
  SELECT id INTO primordials_badge_id 
  FROM public.badge_catalog 
  WHERE name = 'Primordials' AND category = 'special_event';
  
  -- If badge doesn't exist, create it (this should not happen since we just inserted it)
  IF primordials_badge_id IS NULL THEN
    INSERT INTO public.badge_catalog (category, rarity, name, description, points, xp_reward) 
    VALUES (
      'special_event', 
      'legendary', 
      'Primordials', 
      'One of the first 10 users to join the platform - a true pioneer of the community', 
      1000, 
      5000
    ) RETURNING id INTO primordials_badge_id;
  END IF;
  
  -- Award the badge to the first 10 users (ordered by created_at)
  FOR user_record IN 
    SELECT id, created_at 
    FROM public.profiles 
    ORDER BY created_at ASC 
    LIMIT 10
  LOOP
    -- Insert the badge for this user (ignore if already exists)
    INSERT INTO public.user_badges (user_id, badge_id, earned_at)
    VALUES (user_record.id, primordials_badge_id, user_record.created_at)
    ON CONFLICT (user_id, badge_id) DO NOTHING;
    
    user_count := user_count + 1;
  END LOOP;
  
  -- Log the result
  RAISE NOTICE 'Awarded Primordials badge to % users', user_count;
END $$;

-- Function to award a badge to a user
CREATE OR REPLACE FUNCTION public.award_badge_to_user(
  target_user_id uuid,
  badge_name text,
  badge_category text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  target_badge_id uuid;
  badge_exists boolean;
BEGIN
  -- Find the badge
  IF badge_category IS NOT NULL THEN
    SELECT id INTO target_badge_id 
    FROM public.badge_catalog 
    WHERE name = badge_name 
      AND category = badge_category 
      AND is_active = true;
  ELSE
    SELECT id INTO target_badge_id 
    FROM public.badge_catalog 
    WHERE name = badge_name 
      AND is_active = true;
  END IF;
  
  -- Check if badge exists
  IF target_badge_id IS NULL THEN
    RAISE EXCEPTION 'Badge not found: %', badge_name;
  END IF;
  
  -- Check if user already has this badge
  SELECT EXISTS(
    SELECT 1 FROM public.user_badges 
    WHERE user_id = target_user_id AND badge_id = target_badge_id
  ) INTO badge_exists;
  
  IF badge_exists THEN
    RETURN false; -- Badge already awarded
  END IF;
  
  -- Award the badge
  INSERT INTO public.user_badges (user_id, badge_id)
  VALUES (target_user_id, target_badge_id);
  
  -- Update user's XP if the badge has XP reward
  UPDATE public.profiles 
  SET xp_score = xp_score + (
    SELECT xp_reward FROM public.badge_catalog WHERE id = target_badge_id
  )
  WHERE id = target_user_id;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's badges
CREATE OR REPLACE FUNCTION public.get_user_badges(target_user_id uuid)
RETURNS TABLE (
  badge_id uuid,
  category text,
  rarity text,
  name text,
  description text,
  points integer,
  xp_reward integer,
  earned_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bc.id as badge_id,
    bc.category,
    bc.rarity,
    bc.name,
    bc.description,
    bc.points,
    bc.xp_reward,
    ub.earned_at
  FROM public.user_badges ub
  JOIN public.badge_catalog bc ON ub.badge_id = bc.id
  WHERE ub.user_id = target_user_id
    AND bc.is_active = true
  ORDER BY ub.earned_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has a specific badge
CREATE OR REPLACE FUNCTION public.user_has_badge(
  target_user_id uuid,
  badge_name text,
  badge_category text DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  badge_exists boolean;
BEGIN
  IF badge_category IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 
      FROM public.user_badges ub
      JOIN public.badge_catalog bc ON ub.badge_id = bc.id
      WHERE ub.user_id = target_user_id 
        AND bc.name = badge_name 
        AND bc.category = badge_category
        AND bc.is_active = true
    ) INTO badge_exists;
  ELSE
    SELECT EXISTS(
      SELECT 1 
      FROM public.user_badges ub
      JOIN public.badge_catalog bc ON ub.badge_id = bc.id
      WHERE ub.user_id = target_user_id 
        AND bc.name = badge_name
        AND bc.is_active = true
    ) INTO badge_exists;
  END IF;
  
  RETURN badge_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.award_badge_to_user(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_badges(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_badge(uuid, text, text) TO authenticated;

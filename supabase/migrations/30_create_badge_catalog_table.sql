-- Create badge catalog table for managing available badges
-- This migration creates a table to store all available badges that users can earn

-- Create badge_catalog table
CREATE TABLE IF NOT EXISTS public.badge_catalog (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  rarity text,
  name text NOT NULL,
  description text NOT NULL,
  points integer DEFAULT 0,
  xp_reward integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints for badge catalog
-- Category must be one of the valid types
ALTER TABLE public.badge_catalog 
ADD CONSTRAINT badge_catalog_category_check 
CHECK (category IN ('achievement', 'referral', 'milestone', 'special_event'));

-- Rarity must be one of the valid types (optional)
ALTER TABLE public.badge_catalog 
ADD CONSTRAINT badge_catalog_rarity_check 
CHECK (rarity IS NULL OR rarity IN ('common', 'rare', 'legendary'));

-- Name should not be empty
ALTER TABLE public.badge_catalog 
ADD CONSTRAINT badge_catalog_name_not_empty 
CHECK (length(trim(name)) > 0);

-- Description should not be empty
ALTER TABLE public.badge_catalog 
ADD CONSTRAINT badge_catalog_description_not_empty 
CHECK (length(trim(description)) > 0);

-- Points should be non-negative
ALTER TABLE public.badge_catalog 
ADD CONSTRAINT badge_catalog_points_positive 
CHECK (points >= 0);

-- XP reward should be non-negative
ALTER TABLE public.badge_catalog 
ADD CONSTRAINT badge_catalog_xp_reward_positive 
CHECK (xp_reward >= 0);

-- Name should be unique within category
CREATE UNIQUE INDEX IF NOT EXISTS badge_catalog_name_category_unique_idx 
ON public.badge_catalog(category, name) 
WHERE is_active = true;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS badge_catalog_category_idx 
ON public.badge_catalog(category) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS badge_catalog_rarity_idx 
ON public.badge_catalog(rarity) 
WHERE is_active = true AND rarity IS NOT NULL;

CREATE INDEX IF NOT EXISTS badge_catalog_points_idx 
ON public.badge_catalog(points DESC) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS badge_catalog_xp_reward_idx 
ON public.badge_catalog(xp_reward DESC) 
WHERE is_active = true;

-- Create trigger for updated_at
CREATE TRIGGER update_badge_catalog_updated_at 
    BEFORE UPDATE ON public.badge_catalog
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.badge_catalog ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public can view active badges
CREATE POLICY "Public can view active badges" ON public.badge_catalog
    FOR SELECT USING (is_active = true);

-- Admins can view all badges
CREATE POLICY "Admins can view all badges" ON public.badge_catalog
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Admins can insert badges
CREATE POLICY "Admins can insert badges" ON public.badge_catalog
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Admins can update badges
CREATE POLICY "Admins can update badges" ON public.badge_catalog
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Admins can delete badges
CREATE POLICY "Admins can delete badges" ON public.badge_catalog
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Insert some default badges
INSERT INTO public.badge_catalog (category, rarity, name, description, points, xp_reward) VALUES
-- Achievement badges
('achievement', 'common', 'First Steps', 'Created your first world', 10, 50),
('achievement', 'common', 'Character Creator', 'Created your first character', 10, 50),
('achievement', 'common', 'Storyteller', 'Created your first scene', 15, 75),
('achievement', 'rare', 'World Builder', 'Created 5 worlds', 50, 250),
('achievement', 'rare', 'Character Master', 'Created 10 characters', 50, 250),
('achievement', 'rare', 'Scene Director', 'Created 20 scenes', 75, 375),
('achievement', 'legendary', 'Epic Creator', 'Created 50+ creative works', 200, 1000),

-- Referral badges
('referral', 'common', 'First Invite', 'Invited your first friend', 25, 100),
('referral', 'rare', 'Social Butterfly', 'Invited 5 friends', 100, 500),
('referral', 'legendary', 'Community Builder', 'Invited 20+ friends', 500, 2500),

-- Milestone badges
('milestone', 'common', 'Week One', 'Been active for 1 week', 20, 100),
('milestone', 'rare', 'Month One', 'Been active for 1 month', 100, 500),
('milestone', 'legendary', 'Year One', 'Been active for 1 year', 1000, 5000),

-- Special event badges
('special_event', 'legendary', 'Beta Tester', 'Participated in beta testing', 150, 750),
('special_event', 'legendary', 'Early Adopter', 'Joined in the first month', 100, 500),
('special_event', 'rare', 'Community Helper', 'Helped other users in the community', 75, 375);

-- Function to get badges by category
CREATE OR REPLACE FUNCTION public.get_badges_by_category(badge_category text)
RETURNS TABLE (
  id uuid,
  category text,
  rarity text,
  name text,
  description text,
  points integer,
  xp_reward integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bc.id,
    bc.category,
    bc.rarity,
    bc.name,
    bc.description,
    bc.points,
    bc.xp_reward
  FROM public.badge_catalog bc
  WHERE bc.category = badge_category 
    AND bc.is_active = true
  ORDER BY bc.rarity DESC, bc.points DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get badges by rarity
CREATE OR REPLACE FUNCTION public.get_badges_by_rarity(badge_rarity text)
RETURNS TABLE (
  id uuid,
  category text,
  rarity text,
  name text,
  description text,
  points integer,
  xp_reward integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bc.id,
    bc.category,
    bc.rarity,
    bc.name,
    bc.description,
    bc.points,
    bc.xp_reward
  FROM public.badge_catalog bc
  WHERE bc.rarity = badge_rarity 
    AND bc.is_active = true
  ORDER BY bc.points DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search badges
CREATE OR REPLACE FUNCTION public.search_badges(search_term text)
RETURNS TABLE (
  id uuid,
  category text,
  rarity text,
  name text,
  description text,
  points integer,
  xp_reward integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bc.id,
    bc.category,
    bc.rarity,
    bc.name,
    bc.description,
    bc.points,
    bc.xp_reward
  FROM public.badge_catalog bc
  WHERE bc.is_active = true
    AND (
      bc.name ILIKE '%' || search_term || '%' 
      OR bc.description ILIKE '%' || search_term || '%'
    )
  ORDER BY bc.rarity DESC, bc.points DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_badges_by_category(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_badges_by_rarity(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_badges(text) TO authenticated;

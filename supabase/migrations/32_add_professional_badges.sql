-- Add professional category and new rarity levels to badge catalog
-- This migration updates the constraints to support professional badges

-- Drop existing constraints
ALTER TABLE public.badge_catalog DROP CONSTRAINT IF EXISTS badge_catalog_category_check;
ALTER TABLE public.badge_catalog DROP CONSTRAINT IF EXISTS badge_catalog_rarity_check;

-- Add updated category constraint to include 'professional'
ALTER TABLE public.badge_catalog 
ADD CONSTRAINT badge_catalog_category_check 
CHECK (category IN ('achievement', 'referral', 'milestone', 'special_event', 'professional'));

-- Add updated rarity constraint to include 'premium' and 'ultimate'
ALTER TABLE public.badge_catalog 
ADD CONSTRAINT badge_catalog_rarity_check 
CHECK (rarity IS NULL OR rarity IN ('common', 'rare', 'legendary', 'premium', 'ultimate'));

-- Insert professional badges
INSERT INTO public.badge_catalog (category, rarity, name, description, points, xp_reward) VALUES
-- Professional Premium Badges
('professional', 'premium', 'Architect', 'Master world builder with 10+ intricate worlds', 300, 1500),
('professional', 'premium', 'Scholar', 'Deep knowledge of world building lore and mechanics', 280, 1400),
('professional', 'premium', 'Cartographer', 'Created detailed maps and geographical systems', 260, 1300),
('professional', 'premium', 'Diplomat', 'Expert in character relationship management', 250, 1250),
('professional', 'premium', 'Curator', 'Organized and managed extensive world collections', 240, 1200),
('professional', 'premium', 'Librarian', 'Master of timeline and historical event management', 230, 1150),
('professional', 'premium', 'Analyst', 'Advanced data analysis and insight generation', 220, 1100),
('professional', 'premium', 'Explorer', 'Discovered and mapped unique world features', 210, 1050),

-- Professional Ultimate Badges  
('professional', 'ultimate', 'Visionary', 'Created groundbreaking world building concepts', 500, 2500),
('professional', 'ultimate', 'Legend', 'Achieved legendary status in world building community', 450, 2250),
('professional', 'ultimate', 'Pioneer', 'First to achieve major world building milestones', 400, 2000),
('professional', 'ultimate', 'Master', 'Complete mastery of all world building aspects', 350, 1750);
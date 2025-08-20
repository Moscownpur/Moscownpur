-- Automated assignment with conditional logic
DO $$
DECLARE
  user_count INTEGER;
BEGIN
  -- Count eligible users who don't already have the badge
  SELECT COUNT(*) INTO user_count
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 FROM badges ub 
    WHERE ub.user_id = u.id AND ub.badge_name = 'PRIME'
  );
  
  -- If we have users to badge (regardless of count)
  IF user_count > 0 THEN
    -- Insert for up to 25 users who don't already have the badge
    INSERT INTO badges (user_id, badge_name)
    SELECT id, 'PRIME'
    FROM auth.users u
    WHERE NOT EXISTS (
      SELECT 1 FROM badges ub 
      WHERE ub.user_id = u.id AND ub.badge_name = 'PRIME'
    )
    ORDER BY created_at ASC
    LIMIT 25;
    
    RAISE NOTICE 'Assigned PRIME badge to % users', LEAST(user_count, 25);
  ELSE
    RAISE NOTICE 'No eligible users found for PRIME badge assignment';
  END IF;
END $$;
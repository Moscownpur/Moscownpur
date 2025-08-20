-- Migration: Enable RLS on badges table with admin-only management and public read access
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS badges_select_policy ON public.badges;
DROP POLICY IF EXISTS badges_insert_policy ON public.badges;
DROP POLICY IF EXISTS badges_update_policy ON public.badges;
DROP POLICY IF EXISTS badges_delete_policy ON public.badges;

-- Policy: Anyone can view all badges (public read access)
CREATE POLICY badges_select_policy ON public.badges
    FOR SELECT USING (true);

-- Policy: Only admins can insert badges
CREATE POLICY badges_insert_policy ON public.badges
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.is_admin = true
        )
    );

-- Policy: Only admins can update badges
CREATE POLICY badges_update_policy ON public.badges
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.is_admin = true
        )
    );

-- Policy: Only admins can delete badges
CREATE POLICY badges_delete_policy ON public.badges
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.is_admin = true
        )
    );

-- Add comment to document the security settings
COMMENT ON TABLE public.badges IS 'Stores user badges with admin-only management and public read access. Anyone can view all badges.';
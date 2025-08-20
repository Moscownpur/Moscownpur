-- Migration: Create blogs table with author reference
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    body TEXT,
    tags TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT blogs_pkey PRIMARY KEY (id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS blogs_created_at_idx ON public.blogs(created_at);
CREATE INDEX IF NOT EXISTS blogs_category_idx ON public.blogs(category);
CREATE INDEX IF NOT EXISTS blogs_author_id_idx ON public.blogs(author_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blogs updated_at
DROP TRIGGER IF EXISTS update_blogs_updated_at ON public.blogs;
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_blogs_updated_at();

-- Add comment to table for documentation
COMMENT ON TABLE public.blogs IS 'Stores blog posts with author reference to auth.users';

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can insert blogs
CREATE POLICY blogs_insert_policy ON public.blogs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.is_admin = true
        )
    );

-- Policy: Only admins can update blogs
CREATE POLICY blogs_update_policy ON public.blogs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.is_admin = true
        )
    );

-- Policy: Only admins can delete blogs
CREATE POLICY blogs_delete_policy ON public.blogs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.is_admin = true
        )
    );

-- Policy: Everyone can read blogs
CREATE POLICY blogs_select_policy ON public.blogs
    FOR SELECT USING (true);
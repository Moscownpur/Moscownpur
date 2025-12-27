-- Add maitrilok_id to profiles for cross-platform integration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS maitrilok_id text;
CREATE INDEX IF NOT EXISTS profiles_maitrilok_id_idx ON public.profiles(maitrilok_id);

COMMENT ON COLUMN public.profiles.maitrilok_id IS 'Stored ID of the user in the Maitrilok (Circles) platform';

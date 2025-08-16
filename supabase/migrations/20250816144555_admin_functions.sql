-- Migration: Admin Functions
-- Description: Add functions for admin dashboard to fetch user information
-- Date: 2025-08-16

-- Function to get user statistics for admins
create or replace function public.get_user_statistics()
returns table (
  id uuid,
  email text,
  full_name text,
  created_at timestamptz,
  is_admin boolean,
  world_count bigint,
  character_count bigint,
  region_count bigint,
  event_count bigint
)
language plpgsql
security definer
as $$
begin
  -- Check if current user is admin
  if not exists (
    select 1 from public.user_roles 
    where id = auth.uid() and is_admin = true
  ) then
    raise exception 'Access denied. Admin privileges required.';
  end if;

  return query
  select 
    ur.id,
    au.email,
    au.raw_user_meta_data->>'full_name' as full_name,
    au.created_at,
    ur.is_admin,
    coalesce(wc.world_count, 0) as world_count,
    coalesce(cc.character_count, 0) as character_count,
    coalesce(rc.region_count, 0) as region_count,
    coalesce(ec.event_count, 0) as event_count
  from public.user_roles ur
  join auth.users au on ur.id = au.id
  left join (
    select created_by, count(*) as world_count
    from public.worlds
    group by created_by
  ) wc on ur.id = wc.created_by
  left join (
    select created_by, count(*) as character_count
    from public.characters
    group by created_by
  ) cc on ur.id = cc.created_by
  left join (
    select created_by, count(*) as region_count
    from public.regions
    group by created_by
  ) rc on ur.id = rc.created_by
  left join (
    select created_by, count(*) as event_count
    from public.timeline_events
    group by created_by
  ) ec on ur.id = ec.created_by
  order by au.created_at desc;
end;
$$;

-- Function to get world details with creator information for admins
create or replace function public.get_world_details()
returns table (
  id uuid,
  name text,
  type text,
  description text,
  created_by uuid,
  created_at timestamptz,
  user_email text,
  user_full_name text,
  character_count bigint,
  region_count bigint,
  event_count bigint
)
language plpgsql
security definer
as $$
begin
  -- Check if current user is admin
  if not exists (
    select 1 from public.user_roles 
    where id = auth.uid() and is_admin = true
  ) then
    raise exception 'Access denied. Admin privileges required.';
  end if;

  return query
  select 
    w.id,
    w.name,
    w.type,
    w.description,
    w.created_by,
    w.created_at,
    au.email as user_email,
    au.raw_user_meta_data->>'full_name' as user_full_name,
    coalesce(cc.character_count, 0) as character_count,
    coalesce(rc.region_count, 0) as region_count,
    coalesce(ec.event_count, 0) as event_count
  from public.worlds w
  join auth.users au on w.created_by = au.id
  left join (
    select world_id, count(*) as character_count
    from public.characters
    group by world_id
  ) cc on w.id = cc.world_id
  left join (
    select world_id, count(*) as region_count
    from public.regions
    group by world_id
  ) rc on w.id = rc.world_id
  left join (
    select world_id, count(*) as event_count
    from public.timeline_events
    group by world_id
  ) ec on w.id = ec.world_id
  order by w.created_at desc;
end;
$$;

-- Grant execute permissions only to service_role (server-side)
grant execute on function public.get_user_statistics() to service_role;
grant execute on function public.get_world_details() to service_role;

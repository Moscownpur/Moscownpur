-- =========================
-- Worlds Policies
-- =========================
drop policy if exists "Users can manage their own worlds" on public.worlds;
create policy "Users can manage their own worlds"
on public.worlds
for all
using (auth.uid() = user_id);

drop policy if exists "Admins can view all worlds" on public.worlds;
create policy "Admins can view all worlds"
on public.worlds
for select
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.is_admin = true
  )
);

-- =========================
-- Characters Policies
-- =========================
drop policy if exists "Users can manage characters in their own worlds" on public.characters;
create policy "Users can manage characters in their own worlds"
on public.characters
for all
using (
  exists (
    select 1
    from public.worlds w
    where w.id = characters.world_id
      and w.user_id = auth.uid()
  )
);

drop policy if exists "Admins can view all characters" on public.characters;
create policy "Admins can view all characters"
on public.characters
for select
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.is_admin = true
  )
);

-- =========================
-- Regions Policies
-- =========================
drop policy if exists "Users can manage regions in their own worlds" on public.regions;
create policy "Users can manage regions in their own worlds"
on public.regions
for all
using (
  exists (
    select 1
    from public.worlds w
    where w.id = regions.world_id
      and w.user_id = auth.uid()
  )
);

drop policy if exists "Admins can view all regions" on public.regions;
create policy "Admins can view all regions"
on public.regions
for select
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.is_admin = true
  )
);

-- =========================
-- Timeline Events Policies
-- =========================
drop policy if exists "Users can manage events in their own worlds" on public.timeline_events;
create policy "Users can manage events in their own worlds"
on public.timeline_events
for all
using (
  exists (
    select 1
    from public.worlds w
    where w.id = timeline_events.world_id
      and w.user_id = auth.uid()
  )
);

drop policy if exists "Admins can view all events" on public.timeline_events;
create policy "Admins can view all events"
on public.timeline_events
for select
using (
  exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.is_admin = true
  )
);

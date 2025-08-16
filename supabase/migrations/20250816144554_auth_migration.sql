-- Migration: Auth System Migration
-- Description: Migrate from custom auth_users table to Supabase auth.users with user_roles table
-- Date: 2025-08-16

-- Drop old custom auth_users table if exists
drop table if exists public.auth_users cascade;

-- Create new user_roles table linked to auth.users
create table if not exists public.user_roles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Optional: helpful index for queries on is_admin
create index if not exists idx_user_roles_is_admin on public.user_roles (is_admin);

-- Add RLS (Row Level Security) to user_roles table
alter table public.user_roles enable row level security;

-- Create RLS policies for user_roles table
-- Users can only see their own role
create policy "Users can view own role" on public.user_roles
  for select using (auth.uid() = id);

-- Users can update their own role (but not is_admin field)
create policy "Users can update own role" on public.user_roles
  for update using (auth.uid() = id);

-- Only admins can insert new user roles
create policy "Admins can insert user roles" on public.user_roles
  for insert with check (
    exists (
      select 1 from public.user_roles 
      where id = auth.uid() and is_admin = true
    )
  );

-- Only admins can delete user roles
create policy "Admins can delete user roles" on public.user_roles
  for delete using (
    exists (
      select 1 from public.user_roles 
      where id = auth.uid() and is_admin = true
    )
  );

-- Create a function to automatically create user_roles entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_roles (id, is_admin)
  values (new.id, false);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create user_roles entry
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant select, update on public.user_roles to authenticated;

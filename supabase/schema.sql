-- 2heartsdating Supabase schema
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  gender text,
  date_of_birth date,
  religion text,
  denomination text,
  profession text,
  education_level text,
  marital_status text,
  country text,
  city text,
  bio text,
  looking_for text,
  profile_photo_url text,
  is_approved boolean default false,
  is_verified boolean default false,
  is_suspended boolean default false,
  role text default 'user' check (role in ('user','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.profile_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  photo_url text not null,
  storage_path text not null,
  is_primary boolean default false,
  is_approved boolean default false,
  uploaded_at timestamptz default now()
);

create table if not exists public.preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique,
  preferred_gender text,
  age_min int,
  age_max int,
  preferred_religion text,
  preferred_denomination text,
  preferred_profession text,
  preferred_country text,
  preferred_city text,
  verified_only boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(sender_id, receiver_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references public.profiles(id) on delete cascade,
  user2_id uuid references public.profiles(id) on delete cascade,
  matched_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'free' check (plan in ('free','premium','gold')),
  status text default 'inactive',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  reason text not null,
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid references public.profiles(id) on delete cascade,
  blocked_user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(blocker_id, blocked_user_id)
);

alter table public.profiles enable row level security;
alter table public.profile_photos enable row level security;
alter table public.preferences enable row level security;
alter table public.likes enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
alter table public.subscriptions enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "Approved profiles are public" on public.profiles for select using (is_approved = true and is_suspended = false or id = auth.uid() or public.is_admin());
create policy "Users insert own profile" on public.profiles for insert with check (id = auth.uid());
create policy "Users update own profile" on public.profiles for update using (id = auth.uid() or public.is_admin());

create policy "Approved photos are public" on public.profile_photos for select using (is_approved = true or user_id = auth.uid() or public.is_admin());
create policy "Users upload own photos" on public.profile_photos for insert with check (user_id = auth.uid());
create policy "Users update own photos" on public.profile_photos for update using (user_id = auth.uid() or public.is_admin());
create policy "Users delete own photos" on public.profile_photos for delete using (user_id = auth.uid() or public.is_admin());

create policy "Users manage own preferences" on public.preferences for all using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "Users manage own likes" on public.likes for all using (sender_id = auth.uid() or receiver_id = auth.uid() or public.is_admin()) with check (sender_id = auth.uid() or public.is_admin());
create policy "Users see their matches" on public.matches for select using (user1_id = auth.uid() or user2_id = auth.uid() or public.is_admin());
create policy "Users see match messages" on public.messages for select using (public.is_admin() or exists(select 1 from public.matches m where m.id = match_id and (m.user1_id = auth.uid() or m.user2_id = auth.uid())));
create policy "Users send match messages" on public.messages for insert with check (sender_id = auth.uid() and exists(select 1 from public.matches m where m.id = match_id and (m.user1_id = auth.uid() or m.user2_id = auth.uid())));
create policy "Users see own subscription" on public.subscriptions for select using (user_id = auth.uid() or public.is_admin());
create policy "Users create reports" on public.reports for insert with check (reporter_id = auth.uid());
create policy "Admins manage reports" on public.reports for all using (public.is_admin());
create policy "Users manage own blocks" on public.blocks for all using (blocker_id = auth.uid() or public.is_admin()) with check (blocker_id = auth.uid() or public.is_admin());

-- Live chat support
-- Supabase Realtime listens to INSERT events on public.messages.
-- Run this once so message inserts can be streamed to the frontend.
alter publication supabase_realtime add table public.messages;

-- Helpful indexes for faster chat loading.
create index if not exists messages_match_id_created_at_idx on public.messages(match_id, created_at);
create index if not exists matches_user1_id_idx on public.matches(user1_id);
create index if not exists matches_user2_id_idx on public.matches(user2_id);

-- Allow matched users to mark messages as read.
create policy "Users update read status for match messages" on public.messages
for update using (
  public.is_admin() or exists(
    select 1 from public.matches m
    where m.id = match_id
    and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
  )
);

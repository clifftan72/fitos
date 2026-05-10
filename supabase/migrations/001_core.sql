-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  display_name  text,
  avatar_url    text,
  age           smallint,
  sex           text check (sex in ('male', 'female', 'prefer_not_to_say')),
  height_cm     numeric(5,1),
  weight_kg     numeric(5,1),
  primary_goal  text check (primary_goal in ('fat_loss', 'muscle_gain', 'posture', 'general_health', 'injury_recovery')),
  equipment     text[] default array['none'],
  subscription_tier text default 'free' check (subscription_tier in ('free', 'premium')),
  onboarding_complete boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- BODY SCANS
-- ─────────────────────────────────────────────
create table if not exists public.scans (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles(id) on delete cascade not null,
  front_image_url text,
  back_image_url  text,
  left_image_url  text,
  right_image_url text,
  landmarks_raw   jsonb,
  findings        jsonb,
  overall_score   smallint check (overall_score between 0 and 100),
  status          text default 'pending' check (status in ('pending', 'processing', 'complete', 'failed')),
  created_at      timestamptz default now()
);

-- ─────────────────────────────────────────────
-- EXERCISES (seeded, not user-generated)
-- ─────────────────────────────────────────────
create table if not exists public.exercises (
  id              uuid default uuid_generate_v4() primary key,
  name            text not null,
  slug            text unique not null,
  category        text check (category in ('strength', 'mobility', 'corrective', 'cardio', 'recovery')),
  muscle_groups   text[],
  equipment       text[] default array['none'],
  difficulty      text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  posture_tags    text[],
  sets_default    smallint,
  reps_default    text,
  rest_seconds    smallint,
  video_url       text,
  thumbnail_url   text,
  coaching_cue    text,
  why_it_helps    text,
  created_at      timestamptz default now()
);

-- ─────────────────────────────────────────────
-- WORKOUT PROGRAMS
-- ─────────────────────────────────────────────
create table if not exists public.programs (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  scan_id       uuid references public.scans(id) on delete set null,
  title         text not null,
  description   text,
  weeks_total   smallint default 4,
  weeks_data    jsonb not null,
  is_active     boolean default true,
  started_at    timestamptz default now(),
  created_at    timestamptz default now()
);

create unique index if not exists one_active_program_per_user
  on public.programs (user_id)
  where is_active = true;

-- ─────────────────────────────────────────────
-- WORKOUT LOGS
-- ─────────────────────────────────────────────
create table if not exists public.workout_logs (
  id                  uuid default uuid_generate_v4() primary key,
  user_id             uuid references public.profiles(id) on delete cascade not null,
  program_id          uuid references public.programs(id) on delete cascade not null,
  week_number         smallint not null,
  day_number          smallint not null,
  completed_at        timestamptz default now(),
  exercises_completed jsonb,
  duration_minutes    smallint,
  notes               text
);

-- ─────────────────────────────────────────────
-- AI COACH CONVERSATIONS
-- ─────────────────────────────────────────────
create table if not exists public.conversations (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references public.profiles(id) on delete cascade not null,
  messages    jsonb default '[]'::jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create unique index if not exists one_conversation_per_user on public.conversations (user_id);

-- ─────────────────────────────────────────────
-- TRAINER WAITLIST
-- ─────────────────────────────────────────────
create table if not exists public.waitlist (
  id         uuid default uuid_generate_v4() primary key,
  email      text unique not null,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.scans          enable row level security;
alter table public.programs       enable row level security;
alter table public.workout_logs   enable row level security;
alter table public.conversations  enable row level security;
alter table public.exercises      enable row level security;
alter table public.waitlist       enable row level security;

-- Drop policies before recreating (safe re-run)
do $$ begin
  drop policy if exists "Users can view own profile"   on public.profiles;
  drop policy if exists "Users can update own profile" on public.profiles;
  drop policy if exists "Users can view own scans"     on public.scans;
  drop policy if exists "Users can insert own scans"   on public.scans;
  drop policy if exists "Users can update own scans"   on public.scans;
  drop policy if exists "Users can view own programs"   on public.programs;
  drop policy if exists "Users can insert own programs" on public.programs;
  drop policy if exists "Users can update own programs" on public.programs;
  drop policy if exists "Users can view own logs"      on public.workout_logs;
  drop policy if exists "Users can insert own logs"    on public.workout_logs;
  drop policy if exists "Users can view own conversation"   on public.conversations;
  drop policy if exists "Users can upsert own conversation" on public.conversations;
  drop policy if exists "Users can update own conversation" on public.conversations;
  drop policy if exists "Anyone can read exercises"    on public.exercises;
  drop policy if exists "Anyone can join waitlist"     on public.waitlist;
end $$;

-- Profiles
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Scans
create policy "Users can view own scans"     on public.scans for select using (auth.uid() = user_id);
create policy "Users can insert own scans"   on public.scans for insert with check (auth.uid() = user_id);
create policy "Users can update own scans"   on public.scans for update using (auth.uid() = user_id);

-- Programs
create policy "Users can view own programs"   on public.programs for select using (auth.uid() = user_id);
create policy "Users can insert own programs" on public.programs for insert with check (auth.uid() = user_id);
create policy "Users can update own programs" on public.programs for update using (auth.uid() = user_id);

-- Workout logs
create policy "Users can view own logs"   on public.workout_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs" on public.workout_logs for insert with check (auth.uid() = user_id);

-- Conversations
create policy "Users can view own conversation"   on public.conversations for select using (auth.uid() = user_id);
create policy "Users can upsert own conversation" on public.conversations for insert with check (auth.uid() = user_id);
create policy "Users can update own conversation" on public.conversations for update using (auth.uid() = user_id);

-- Exercises: public read
create policy "Anyone can read exercises" on public.exercises for select using (true);

-- Waitlist: anyone can insert
create policy "Anyone can join waitlist" on public.waitlist for insert with check (true);

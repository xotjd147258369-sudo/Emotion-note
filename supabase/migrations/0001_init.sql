create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text not null default 'Asia/Seoul',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.emotion_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  mood_score integer not null check (mood_score between 1 and 5),
  emotion_tags text[] not null default '{}',
  situation text,
  body text not null check (char_length(trim(body)) > 0),
  entry_date date not null default ((now() at time zone 'Asia/Seoul')::date),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gratitude_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  items text[] not null check (cardinality(items) >= 1),
  note text,
  note_date date not null default ((now() at time zone 'Asia/Seoul')::date),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.motivation_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  text text not null check (char_length(trim(text)) > 0),
  tags text[] not null default '{}',
  theme text not null default 'sage' check (theme in ('sage', 'rose', 'amber', 'sky')),
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists emotion_entries_user_date_idx
  on public.emotion_entries(user_id, entry_date desc, created_at desc);

create index if not exists gratitude_notes_user_date_idx
  on public.gratitude_notes(user_id, note_date desc, created_at desc);

create index if not exists motivation_cards_user_favorite_idx
  on public.motivation_cards(user_id, is_favorite desc, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists emotion_entries_set_updated_at on public.emotion_entries;
create trigger emotion_entries_set_updated_at
before update on public.emotion_entries
for each row execute function public.set_updated_at();

drop trigger if exists gratitude_notes_set_updated_at on public.gratitude_notes;
create trigger gratitude_notes_set_updated_at
before update on public.gratitude_notes
for each row execute function public.set_updated_at();

drop trigger if exists motivation_cards_set_updated_at on public.motivation_cards;
create trigger motivation_cards_set_updated_at
before update on public.motivation_cards
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '감정 노트 사용자'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.emotion_entries enable row level security;
alter table public.gratitude_notes enable row level security;
alter table public.motivation_cards enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "emotion_entries_select_own" on public.emotion_entries;
create policy "emotion_entries_select_own"
on public.emotion_entries for select
using (user_id = auth.uid());

drop policy if exists "emotion_entries_insert_own" on public.emotion_entries;
create policy "emotion_entries_insert_own"
on public.emotion_entries for insert
with check (user_id = auth.uid());

drop policy if exists "emotion_entries_update_own" on public.emotion_entries;
create policy "emotion_entries_update_own"
on public.emotion_entries for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "emotion_entries_delete_own" on public.emotion_entries;
create policy "emotion_entries_delete_own"
on public.emotion_entries for delete
using (user_id = auth.uid());

drop policy if exists "gratitude_notes_select_own" on public.gratitude_notes;
create policy "gratitude_notes_select_own"
on public.gratitude_notes for select
using (user_id = auth.uid());

drop policy if exists "gratitude_notes_insert_own" on public.gratitude_notes;
create policy "gratitude_notes_insert_own"
on public.gratitude_notes for insert
with check (user_id = auth.uid());

drop policy if exists "gratitude_notes_update_own" on public.gratitude_notes;
create policy "gratitude_notes_update_own"
on public.gratitude_notes for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "gratitude_notes_delete_own" on public.gratitude_notes;
create policy "gratitude_notes_delete_own"
on public.gratitude_notes for delete
using (user_id = auth.uid());

drop policy if exists "motivation_cards_select_own" on public.motivation_cards;
create policy "motivation_cards_select_own"
on public.motivation_cards for select
using (user_id = auth.uid());

drop policy if exists "motivation_cards_insert_own" on public.motivation_cards;
create policy "motivation_cards_insert_own"
on public.motivation_cards for insert
with check (user_id = auth.uid());

drop policy if exists "motivation_cards_update_own" on public.motivation_cards;
create policy "motivation_cards_update_own"
on public.motivation_cards for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "motivation_cards_delete_own" on public.motivation_cards;
create policy "motivation_cards_delete_own"
on public.motivation_cards for delete
using (user_id = auth.uid());

alter table public.profiles enable row level security;
alter table public.emotion_entries enable row level security;
alter table public.gratitude_notes enable row level security;
alter table public.motivation_cards enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.emotion_entries to authenticated;
grant select, insert, update, delete on public.gratitude_notes to authenticated;
grant select, insert, update, delete on public.motivation_cards to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (id = (select auth.uid()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists "emotion_entries_select_own" on public.emotion_entries;
create policy "emotion_entries_select_own"
on public.emotion_entries for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "emotion_entries_insert_own" on public.emotion_entries;
create policy "emotion_entries_insert_own"
on public.emotion_entries for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "emotion_entries_update_own" on public.emotion_entries;
create policy "emotion_entries_update_own"
on public.emotion_entries for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "emotion_entries_delete_own" on public.emotion_entries;
create policy "emotion_entries_delete_own"
on public.emotion_entries for delete
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "gratitude_notes_select_own" on public.gratitude_notes;
create policy "gratitude_notes_select_own"
on public.gratitude_notes for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "gratitude_notes_insert_own" on public.gratitude_notes;
create policy "gratitude_notes_insert_own"
on public.gratitude_notes for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "gratitude_notes_update_own" on public.gratitude_notes;
create policy "gratitude_notes_update_own"
on public.gratitude_notes for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "gratitude_notes_delete_own" on public.gratitude_notes;
create policy "gratitude_notes_delete_own"
on public.gratitude_notes for delete
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "motivation_cards_select_own" on public.motivation_cards;
create policy "motivation_cards_select_own"
on public.motivation_cards for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "motivation_cards_insert_own" on public.motivation_cards;
create policy "motivation_cards_insert_own"
on public.motivation_cards for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "motivation_cards_update_own" on public.motivation_cards;
create policy "motivation_cards_update_own"
on public.motivation_cards for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "motivation_cards_delete_own" on public.motivation_cards;
create policy "motivation_cards_delete_own"
on public.motivation_cards for delete
to authenticated
using (user_id = (select auth.uid()));

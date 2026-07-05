-- ÉTAPE 3A — Messagerie temps réel
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  expediteur uuid references auth.users(id) on delete cascade,
  destinataire uuid references auth.users(id) on delete cascade,
  contenu text not null,
  lu boolean default false,
  created_at timestamptz default now()
);
alter table messages enable row level security;
drop policy if exists "voir mes messages" on messages;
create policy "voir mes messages" on messages for select
  using (auth.uid() = expediteur or auth.uid() = destinataire);
drop policy if exists "envoyer message" on messages;
create policy "envoyer message" on messages for insert
  with check (auth.uid() = expediteur);
drop policy if exists "marquer lu" on messages;
create policy "marquer lu" on messages for update
  using (auth.uid() = destinataire);
alter publication supabase_realtime add table messages;

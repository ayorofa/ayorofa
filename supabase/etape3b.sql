-- ÉTAPE 3B — profils enrichis, avis, commentaires, réactions, stockage photos

-- Profils : bio + photo
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists avatar_url text;

-- AVIS
create table if not exists avis (
  id uuid primary key default gen_random_uuid(),
  cible uuid references auth.users(id) on delete cascade,
  auteur uuid references auth.users(id) on delete cascade,
  note int not null check (note between 1 and 5),
  texte text,
  created_at timestamptz default now(),
  unique (cible, auteur)
);
alter table avis enable row level security;
drop policy if exists "avis visibles" on avis;
create policy "avis visibles" on avis for select using (true);
drop policy if exists "laisser avis" on avis;
create policy "laisser avis" on avis for insert with check (auth.uid() = auteur and auteur <> cible);
drop policy if exists "maj avis" on avis;
create policy "maj avis" on avis for update using (auth.uid() = auteur);

-- COMMENTAIRES
create table if not exists commentaires (
  id uuid primary key default gen_random_uuid(),
  besoin uuid references besoins(id) on delete cascade,
  auteur uuid references auth.users(id) on delete cascade,
  texte text not null,
  created_at timestamptz default now()
);
alter table commentaires enable row level security;
drop policy if exists "commentaires visibles" on commentaires;
create policy "commentaires visibles" on commentaires for select using (true);
drop policy if exists "ecrire commentaire" on commentaires;
create policy "ecrire commentaire" on commentaires for insert with check (auth.uid() = auteur);
drop policy if exists "supprimer commentaire" on commentaires;
create policy "supprimer commentaire" on commentaires for delete using (auth.uid() = auteur);

-- REACTIONS (j'aime)
create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  besoin uuid references besoins(id) on delete cascade,
  auteur uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (besoin, auteur)
);
alter table reactions enable row level security;
drop policy if exists "reactions visibles" on reactions;
create policy "reactions visibles" on reactions for select using (true);
drop policy if exists "reagir" on reactions;
create policy "reagir" on reactions for insert with check (auth.uid() = auteur);
drop policy if exists "annuler reaction" on reactions;
create policy "annuler reaction" on reactions for delete using (auth.uid() = auteur);

-- STOCKAGE des photos de profil
insert into storage.buckets (id, name, public) values ('avatars','avatars', true)
  on conflict (id) do nothing;
drop policy if exists "avatars lisibles" on storage.objects;
create policy "avatars lisibles" on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists "avatars upload" on storage.objects;
create policy "avatars upload" on storage.objects for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
drop policy if exists "avatars maj" on storage.objects;
create policy "avatars maj" on storage.objects for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');

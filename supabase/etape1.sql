-- ÉTAPE 1 — Profils, besoins, notifications + sécurité (RLS) + temps réel
-- À coller dans Supabase → SQL Editor → Run.

-- Types
do $$ begin
  create type profil_type as enum ('entreprise','particulier','chercheur');
exception when duplicate_object then null; end $$;
do $$ begin
  create type besoin_type as enum ('demande','offre_emploi','recherche');
exception when duplicate_object then null; end $$;

-- PROFILS (liés aux comptes auth)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nom text,
  type profil_type not null default 'particulier',
  ville text,
  interets text[] default '{}',
  telephone text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
drop policy if exists "profils lisibles" on profiles;
create policy "profils lisibles" on profiles for select using (true);
drop policy if exists "creer son profil" on profiles;
create policy "creer son profil" on profiles for insert with check (auth.uid() = id);
drop policy if exists "maj son profil" on profiles;
create policy "maj son profil" on profiles for update using (auth.uid() = id);

-- BESOINS / OFFRES
create table if not exists besoins (
  id uuid primary key default gen_random_uuid(),
  auteur uuid references auth.users(id) on delete cascade,
  type besoin_type not null default 'demande',
  titre text not null,
  description text,
  metier text,
  ville text,
  created_at timestamptz default now()
);
alter table besoins enable row level security;
drop policy if exists "besoins visibles" on besoins;
create policy "besoins visibles" on besoins for select using (true);
drop policy if exists "publier besoin" on besoins;
create policy "publier besoin" on besoins for insert with check (auth.uid() = auteur);
drop policy if exists "gerer ses besoins" on besoins;
create policy "gerer ses besoins" on besoins for update using (auth.uid() = auteur);
drop policy if exists "supprimer ses besoins" on besoins;
create policy "supprimer ses besoins" on besoins for delete using (auth.uid() = auteur);

-- NOTIFICATIONS
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  destinataire uuid references auth.users(id) on delete cascade,
  besoin uuid references besoins(id) on delete cascade,
  lu boolean default false,
  created_at timestamptz default now()
);
alter table notifications enable row level security;
drop policy if exists "mes notifications" on notifications;
create policy "mes notifications" on notifications for select using (auth.uid() = destinataire);

-- Création automatique du profil à l'inscription (lit les infos du formulaire)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nom, type, ville, interets)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nom',''),
    coalesce((new.raw_user_meta_data->>'type')::profil_type,'particulier'),
    new.raw_user_meta_data->>'ville',
    coalesce((select array_agg(x) from jsonb_array_elements_text(coalesce(new.raw_user_meta_data->'interets','[]'::jsonb)) x), '{}')
  );
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Temps réel sur les besoins et notifications
alter publication supabase_realtime add table besoins;
alter publication supabase_realtime add table notifications;

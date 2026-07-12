-- ═══════════════════════════════════════════════
--  MODÉRATION — Ayôrôfa Connect
-- ═══════════════════════════════════════════════

-- 1) Table des signalements
create table if not exists signalements (
  id uuid primary key default gen_random_uuid(),
  type text not null,                  -- 'besoin' | 'profil' | 'commentaire'
  cible_id uuid not null,              -- l'annonce / le profil / le commentaire visé
  auteur_cible uuid,                   -- le membre concerné (pour bannir vite)
  signale_par uuid references auth.users(id) on delete set null,
  motif text not null,                 -- spam | arnaque | faux | offensant | autre
  details text,
  statut text not null default 'ouvert',  -- ouvert | traite | rejete
  created_at timestamptz default now()
);
alter table signalements enable row level security;

-- Un membre connecté peut signaler
drop policy if exists "signaler" on signalements;
create policy "signaler" on signalements for insert
  with check (auth.uid() = signale_par);

-- Seul l'admin lit et traite les signalements
drop policy if exists "admin lit signalements" on signalements;
create policy "admin lit signalements" on signalements for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

drop policy if exists "admin traite signalements" on signalements;
create policy "admin traite signalements" on signalements for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- 2) Bannissement d'un membre
alter table profiles add column if not exists banni boolean default false;

-- 3) L'admin peut supprimer une annonce ou un commentaire abusif
drop policy if exists "admin supprime besoin" on besoins;
create policy "admin supprime besoin" on besoins for delete
  using (auth.uid() = auteur or exists (
    select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

drop policy if exists "admin supprime commentaire" on commentaires;
create policy "admin supprime commentaire" on commentaires for delete
  using (auth.uid() = auteur or exists (
    select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- 4) ANTI-SPAM : max 5 annonces par jour et par membre + blocage des bannis
create or replace function public.limite_publication()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare
  nb int;
  est_banni boolean;
begin
  select coalesce(banni, false) into est_banni from public.profiles where id = new.auteur;
  if est_banni then
    raise exception 'Votre compte a été suspendu.';
  end if;

  select count(*) into nb from public.besoins
    where auteur = new.auteur and created_at > now() - interval '24 hours';
  if nb >= 5 then
    raise exception 'Limite atteinte : 5 annonces par jour maximum.';
  end if;

  return new;
end;
$fn$;

drop trigger if exists trg_limite_publication on besoins;
create trigger trg_limite_publication
  before insert on besoins
  for each row execute function public.limite_publication();

-- 5) Un membre banni ne peut plus commenter ni envoyer de messages
create or replace function public.bloque_banni()
returns trigger
language plpgsql
security definer
set search_path = public
as $fn$
declare est_banni boolean;
begin
  select coalesce(banni, false) into est_banni from public.profiles
    where id = coalesce(new.auteur, new.expediteur);
  if est_banni then
    raise exception 'Votre compte a été suspendu.';
  end if;
  return new;
end;
$fn$;

drop trigger if exists trg_banni_commentaire on commentaires;
create trigger trg_banni_commentaire
  before insert on commentaires
  for each row execute function public.bloque_banni();

drop trigger if exists trg_banni_message on messages;
create trigger trg_banni_message
  before insert on messages
  for each row execute function public.bloque_banni();

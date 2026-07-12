-- ÉTAPE 8 — Abonnements (paiement manuel maintenant, CinetPay ensuite)

-- Plan de chaque membre : 'decouverte' | 'pro' | 'verifie'
alter table profiles add column if not exists plan text default 'decouverte';
alter table profiles add column if not exists plan_expire timestamptz;

-- Demandes d'abonnement (l'utilisateur déclare son paiement, l'admin valide)
create table if not exists abonnements (
  id uuid primary key default gen_random_uuid(),
  utilisateur uuid references auth.users(id) on delete cascade,
  plan text not null,                      -- pro | verifie
  montant int not null,
  moyen text,                              -- wave | orange | mtn | moov
  reference text,                          -- réf. de la transaction Mobile Money
  statut text not null default 'en_attente', -- en_attente | valide | refuse
  created_at timestamptz default now()
);
alter table abonnements enable row level security;

drop policy if exists "voir mes abonnements" on abonnements;
create policy "voir mes abonnements" on abonnements for select
  using (auth.uid() = utilisateur or exists (
    select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

drop policy if exists "demander un abonnement" on abonnements;
create policy "demander un abonnement" on abonnements for insert
  with check (auth.uid() = utilisateur);

drop policy if exists "admin valide abonnement" on abonnements;
create policy "admin valide abonnement" on abonnements for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

-- L'admin peut mettre à jour le plan et le badge d'un membre
drop policy if exists "admin maj profils" on profiles;
create policy "admin maj profils" on profiles for update
  using (auth.uid() = id or exists (
    select 1 from profiles p where p.id = auth.uid() and p.is_admin = true));

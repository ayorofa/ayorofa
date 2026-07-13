-- ═══════════════════════════════════════════════
--  SOCIAL — Ayôrôfa Connect
--  Abonnements (suivre) + présence (en ligne / vu il y a…)
-- ═══════════════════════════════════════════════

-- 1) ABONNEMENTS : qui suit qui
create table if not exists abonnes (
  id uuid primary key default gen_random_uuid(),
  suiveur uuid references auth.users(id) on delete cascade,   -- celui qui suit
  suivi   uuid references auth.users(id) on delete cascade,   -- celui qui est suivi
  created_at timestamptz default now(),
  unique (suiveur, suivi),
  check (suiveur <> suivi)
);
alter table abonnes enable row level security;

drop policy if exists "abonnes visibles" on abonnes;
create policy "abonnes visibles" on abonnes for select using (true);

drop policy if exists "suivre" on abonnes;
create policy "suivre" on abonnes for insert with check (auth.uid() = suiveur);

drop policy if exists "ne plus suivre" on abonnes;
create policy "ne plus suivre" on abonnes for delete using (auth.uid() = suiveur);

-- 2) PRÉSENCE : dernière activité
alter table profiles add column if not exists derniere_activite timestamptz default now();

-- Chacun met à jour SA propre présence
create or replace function public.ping_presence()
returns void
language plpgsql
security definer
set search_path = public
as $fn$
begin
  update public.profiles
    set derniere_activite = now()
    where id = auth.uid();
end;
$fn$;

grant execute on function public.ping_presence() to authenticated;

-- 3) INVITATIONS : notifier quand quelqu'un vous suit
--    (on réutilise la table notifications, avec un type)
alter table notifications add column if not exists type text default 'interet';
alter table notifications add column if not exists emetteur uuid references auth.users(id) on delete cascade;
alter table notifications alter column besoin drop not null;

drop policy if exists "envoyer notification" on notifications;
create policy "envoyer notification" on notifications for insert
  with check (auth.uid() is not null);

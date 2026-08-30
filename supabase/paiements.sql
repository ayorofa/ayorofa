-- ═══════════════════════════════════════════════════════════
--  PAIEMENTS AUTOMATIQUES (CinetPay) — Ayôrôfa Connect
--
--  À coller dans Supabase → SQL Editor → Run.
--  Le script est idempotent : on peut le relancer sans risque.
--
--  Cette table manquait alors que le code l'utilise déjà :
--    · app/api/paiement/initier   → insère la transaction
--    · app/api/paiement/notifier  → la met à jour après vérification
--    · app/factures               → le membre consulte ses reçus
--    · app/abonnements/retour     → suit l'état de son paiement
--
--  À ne pas confondre avec la table « abonnements » (etape8.sql), qui
--  sert au paiement MANUEL : le membre déclare son versement Mobile
--  Money et un administrateur le valide depuis /admin-plans.
--  Ici, tout est automatique.
-- ═══════════════════════════════════════════════════════════

create table if not exists paiements (
  id             uuid primary key default gen_random_uuid(),
  -- Référence unique générée par /api/paiement/initier (AYO-<plan>-<horodatage>-<aléa>).
  -- C'est la clé par laquelle CinetPay nous rappelle : elle doit être unique.
  transaction_id text not null unique,
  utilisateur    uuid references auth.users(id) on delete cascade,
  plan           text not null,              -- pro | verifie | entreprise | recruteur | vip
  montant        int  not null,              -- en francs CFA
  statut         text not null default 'en_attente',  -- en_attente | paye | echoue
  operateur      text,                       -- wave | orange | mtn | moov (renvoyé par CinetPay)
  paye_at        timestamptz,
  created_at     timestamptz default now()
);

-- Les reçus d'un membre sont listés par utilisateur et par statut.
create index if not exists paiements_utilisateur_idx on paiements (utilisateur, statut);

alter table paiements enable row level security;

-- ── Lecture ──
-- Un membre voit ses propres paiements ; l'administrateur voit tout.
-- C'est cette règle qui empêche de consulter le reçu d'autrui, car
-- /factures/[id] interroge la table par identifiant seul.
drop policy if exists "voir mes paiements" on paiements;
create policy "voir mes paiements" on paiements for select
  using (
    auth.uid() = utilisateur
    or exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin = true)
  );

-- ── Écriture ──
-- Aucune policy d'insertion ni de mise à jour : c'est voulu.
-- Seul le serveur écrit, avec SUPABASE_SERVICE_ROLE_KEY, qui contourne
-- RLS. Un membre ne peut donc pas fabriquer un paiement « payé » depuis
-- son navigateur, ni s'attribuer un plan qu'il n'a pas réglé.

-- ── Vérification ──
-- Après exécution, la requête suivante doit renvoyer une ligne :
--   select table_name from information_schema.tables
--    where table_schema = 'public' and table_name = 'paiements';

-- ÉTAPE 4 — Curation & croissance
-- Nouveaux champs sur les annonces + rôle admin
alter table besoins  add column if not exists source  text;   -- auteur / d'où vient l'annonce
alter table besoins  add column if not exists contact text;   -- n° WhatsApp de la personne
alter table besoins  add column if not exists lien    text;   -- lien d'origine (optionnel)
alter table profiles add column if not exists is_admin boolean default false;

-- Donne-toi les droits admin : remplace TON_EMAIL par l'e-mail de TON compte, puis exécute.
-- update public.profiles set is_admin = true
--   where id in (select id from auth.users where email = 'TON_EMAIL');

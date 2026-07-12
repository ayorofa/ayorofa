-- ÉTAPE 7 — Photos de profil publiques + badge vérifié
-- 1) colonne "verifie" (badge)
alter table profiles add column if not exists verifie boolean default false;

-- 2) les profils (nom + photo) sont lisibles par tous — déjà le cas, on s'en assure
drop policy if exists "profils lisibles" on profiles;
create policy "profils lisibles" on profiles for select using (true);

-- 3) le bucket des photos doit être PUBLIC pour que les images s'affichent partout
update storage.buckets set public = true where id = 'avatars';

-- 4) lecture publique des photos
drop policy if exists "avatars lisibles" on storage.objects;
create policy "avatars lisibles" on storage.objects for select using (bucket_id = 'avatars');

-- Pour vérifier un pro (badge doré), remplace l'e-mail puis exécute :
-- update public.profiles set verifie = true
--   where id in (select id from auth.users where email = 'EMAIL_DU_PRO');

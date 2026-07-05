-- ÉTAPE 2 — autoriser l'envoi d'une notification à l'auteur d'un besoin
drop policy if exists "envoyer notification" on notifications;
create policy "envoyer notification" on notifications
  for insert with check (auth.uid() is not null);
